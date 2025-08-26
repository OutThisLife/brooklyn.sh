import * as THREE from 'three'
import { FullScreenQuad } from 'three-stdlib'

export class QuadPass {
  clear = false
  enabled = true
  fsQuad: FullScreenQuad
  material: THREE.ShaderMaterial
  needsSwap = true
  renderToScreen = false
  uniforms: Record<string, THREE.IUniform<any>>

  constructor(shader: ShaderConfig) {
    this.uniforms = THREE.UniformsUtils.clone(shader.uniforms)
    this.material = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      ...shader,
      uniforms: this.uniforms
    })

    this.fsQuad = new FullScreenQuad(this.material)
  }

  dispose() {
    this.material.dispose()
    this.fsQuad.dispose()
  }

  protected updateCommonUniforms(
    renderer: THREE.WebGLRenderer,
    readBuffer: THREE.WebGLRenderTarget
  ) {
    const u = this.uniforms

    if (u.tDiffuse) u.tDiffuse.value = readBuffer.texture

    if (u.resolution)
      u.resolution.value.set(readBuffer.width, readBuffer.height)

    if (u.dpr) u.dpr.value = renderer.getPixelRatio()
  }

  protected beginRender(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget
  ) {
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)

    if (this.clear && !this.renderToScreen) renderer.clear()
  }

  protected renderQuad(renderer: THREE.WebGLRenderer) {
    this.fsQuad.render(renderer)
  }

  setSize(width: number, height: number) {
    if (this.uniforms.resolution)
      this.uniforms.resolution.value.set(width, height)
  }
}

interface ShaderConfig {
  fragmentShader: string
  uniforms: Record<string, THREE.IUniform<any>>
  vertexShader: string
}
