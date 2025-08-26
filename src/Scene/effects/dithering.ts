import * as THREE from 'three'

import { QuadPass } from './pass'

const DitheringShader = {
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float dpr;
    uniform float gridSize;
    uniform float pixelSizeRatio;
    uniform float grayscaleOnly;
    uniform vec2 xRange;
    uniform vec2 yRange;
    varying vec2 vUv;

    float bayer4x4(vec2 pos) {
      const mat4 d = mat4(
        0.0,  8.0,  2.0, 10.0,
        12.0, 4.0, 14.0,  6.0,
        3.0, 11.0,  1.0,  9.0,
        15.0, 7.0, 13.0,  5.0
      );

      ivec2 p = ivec2(mod(pos, 4.0));
      
      return d[p.x][p.y] / 16.0;
    }

    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;
      
      if (vUv.x >= xRange.x && vUv.x <= xRange.y && 
          vUv.y >= yRange.x && vUv.y <= yRange.y) {
        float pixelSize = gridSize * pixelSizeRatio * max(dpr, 1.0);
        
        if (pixelSize > 1.0) {
          vec2 res = resolution;
          vec2 coord = floor(vUv * res / pixelSize) * pixelSize;
          color = texture2D(tDiffuse, coord / res).rgb;
        }
        
        if (grayscaleOnly > 0.0) {
          color = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
        }
        
        if (gridSize > 1.0) {
          float threshold = bayer4x4(gl_FragCoord.xy / (gridSize * max(dpr, 1.0)));
          color = floor((color + (threshold - 0.5) * 0.1) * 8.0 + 0.5) / 8.0;
        }
      }
      
      float lineWidthX = 1.0 / resolution.x;
      float lineWidthY = 1.0 / resolution.y;
      
      // if (xRange.x > 0.0 && abs(vUv.x - xRange.x) < lineWidthX) {
      //   color = vec3(0.5);
      // }
      
      // if (xRange.y < 1.0 && abs(vUv.x - xRange.y) < lineWidthX) {
      //   color = vec3(0.5);
      // }
      
      // if (yRange.x > 0.0 && abs(vUv.y - yRange.x) < lineWidthY) {
      //   color = vec3(0.5);
      // }
      
      // if (yRange.y < 1.0 && abs(vUv.y - yRange.y) < lineWidthY) {
      //   color = vec3(0.5);
      // }

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    dpr: { value: 1 },
    grayscaleOnly: { value: 0 },
    gridSize: { value: 4 },
    pixelSizeRatio: { value: 1 },
    resolution: { value: new THREE.Vector2(1, 1) },
    tDiffuse: { value: null as THREE.Texture | null },
    xRange: { value: new THREE.Vector2(0, 1) },
    yRange: { value: new THREE.Vector2(0, 1) }
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
    }
  `
}

export class DitheringPass extends QuadPass {
  constructor(options: DitheringOptions = {}) {
    super(DitheringShader)

    if (options.gridSize !== undefined)
      this.uniforms.gridSize.value = options.gridSize

    if (options.grayscaleOnly !== undefined)
      this.uniforms.grayscaleOnly.value = +options.grayscaleOnly

    if (options.pixelSizeRatio !== undefined)
      this.uniforms.pixelSizeRatio.value = options.pixelSizeRatio

    if (options.xRange !== undefined)
      this.uniforms.xRange.value.set(options.xRange[0], options.xRange[1])

    if (options.yRange !== undefined)
      this.uniforms.yRange.value.set(options.yRange[0], options.yRange[1])
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget
  ) {
    this.updateCommonUniforms(renderer, readBuffer)
    this.beginRender(renderer, writeBuffer)
    this.renderQuad(renderer)
  }
}

interface DitheringOptions {
  grayscaleOnly?: boolean
  gridSize?: number
  pixelSizeRatio?: number
  xRange?: [number, number]
  yRange?: [number, number]
}
