import type * as THREE from 'three'

import { defaultVertexShader, QuadPass } from './pass'

const GrainShader = {
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    uniform float size;
    uniform int blendMode;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec3 blendOverlay(vec3 base, vec3 blend) {
      return mix(
        1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
        2.0 * base * blend,
        step(base, vec3(0.5))
      );
    }

    vec3 blendSoftLight(vec3 base, vec3 blend) {
      return mix(
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
        step(base, vec3(0.5))
      );
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      vec2 scaledUv = vUv * size;
      float grain = rand(scaledUv + time) * 2.0 - 1.0;
      vec3 grainColor = vec3(grain) * intensity;

      vec3 result;

      if (blendMode == 0) {
        result = color.rgb + grainColor;
      } else if (blendMode == 1) {
        result = color.rgb * (1.0 + grainColor);
      } else if (blendMode == 2) {
        result = blendOverlay(color.rgb, vec3(0.5) + grainColor);
      } else if (blendMode == 3) {
        result = 1.0 - (1.0 - color.rgb) * (1.0 - grainColor * 0.5);
      } else if (blendMode == 4) {
        result = blendSoftLight(color.rgb, vec3(0.5) + grainColor);
      } else {
        result = color.rgb;
      }

      gl_FragColor = vec4(result, color.a);
    }
  `,
  uniforms: {
    blendMode: { value: 0 },
    intensity: { value: 0.02 },
    size: { value: 0.5 },
    tDiffuse: { value: null as THREE.Texture | null },
    time: { value: 0 }
  },
  vertexShader: defaultVertexShader
}

export class GrainPass extends QuadPass {
  private speed = 0
  private time = 0

  constructor(options: GrainOptions = {}) {
    super(GrainShader)

    if (options.intensity !== undefined)
      this.uniforms.intensity.value = options.intensity

    if (options.size !== undefined) this.uniforms.size.value = options.size

    if (options.blendMode !== undefined)
      this.uniforms.blendMode.value = options.blendMode

    this.speed = options.speed ?? 0
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ) {
    this.time += deltaTime * this.speed
    this.uniforms.time.value = this.time

    this.updateCommonUniforms(renderer, readBuffer)
    this.beginRender(renderer, writeBuffer)
    this.renderQuad(renderer)
  }
}

interface GrainOptions {
  blendMode?: number
  intensity?: number
  size?: number
  speed?: number
}
