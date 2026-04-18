import { useTexture } from '@react-three/drei'
import type { MeshStandardMaterialProps } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { useCallback, useMemo, useRef } from 'react'
import type { WebGLProgramParametersWithUniforms } from 'three'
import * as THREE from 'three'

import { $output } from './Output'

export const vertex = /* glsl */ `
vec4 mvPosition = vec4(transformed, 1);

#ifdef USE_INSTANCING
  vec4 instanceOrigin = instanceMatrix * vec4(vec3(0), 1);
  vec4 worldInstanceOrigin = modelMatrix * instanceOrigin;

  mvPosition = instanceMatrix * mvPosition;
  vPos = mvPosition.xyz;
  vMouse = uMouse - (mvPosition - instanceOrigin).xyz;
#else
  vPos = position;
  vMouse = uMouse - position;
#endif

mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`

const sgn = (n: number) => `${n >= 0 ? '+' : '-'}${Math.abs(n).toFixed(2)}`
const pad = (s: string, w: number) => s.padStart(w, ' ')

export const fragment = /* glsl */ `
#include <map_fragment>

vec2 st = vUv * 2. - .5;
vec3 q = vPosition.xyz;
vec3 p = (modelMatrix * vec4(vPos, 1)).xyz;
vec2 mv = (vMouse - p).xy;

{
  float isTop = step(.45, q.y);
  float isBottom = step(q.y, -.45);
  float isFront = step(.45, q.z);
  float isBack = step(q.z, -.45);
  float isRight = step(.45, q.x);
  float isLeft = step(q.x, -.45);

  vec2 p = st;
  p = rotateUV(p, length(mv) * PI, vec2(.5));
  p = rotateUV(p, uTime * .15, vec2(.5));

  vec4 lin = mix(
    vec4(0),
    mix(
      mix(
        texture2D(uChannel0, p),
        texture2D(uChannel1, p),
        isBottom
      ),
      texture2D(uChannel0, p),
      step(0.9, diffuseColor.g)
    ),
    min(isBottom + isBack, 1.)
  );

  float d = 1. - smoothstep(.2, .745, length(mv));
  lin.rgb = mix(lin.rgb, 1. - lin.rgb, d);

  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.2), smoothstep(1.5, 0., distance(abs(st), vec2(1, .5))));
  diffuseColor = mix(diffuseColor, vec4(lin.rgb * 2., 1), pow(lin.a, 4.));
}

{
  float d = 1. - smoothstep(-.2, .6, length(mv));
  float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));

  vec3 lin = vec3(1. - lum);
  lin = diffuseColor.rgb + (1. - 2. * lum);

  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.23, d);
}
`

const indent = (s: string) =>
  s
    .split('\n')
    .map(l => (l ? '  ' + l : l))
    .join('\n')

const vbody = indent(
  vertex.trim().replace(/\buMouse\b/g, 'vec3({mx}, {my}, {mz})')
)

const fbody = indent(fragment.trim().replace(/\buTime\b/g, '{t}'))

const template = `uniform vec3 uMouse;

varying vec3 vPos;
varying vec3 vMouse;

void main() {
${vbody}
}


uniform mat4 modelMatrix;
uniform float uTime;
uniform vec3 uMouse;
uniform sampler2D uChannel0;
uniform sampler2D uChannel1;

varying vec3 vPos;
varying vec3 vMouse;

vec2 rotateUV(vec2 uv, float a, vec2 mid) {
  return vec2(
    cos(a) * (uv.x - mid.x) + sin(a) * (uv.y - mid.y) + mid.x,
    cos(a) * (uv.y - mid.y) - sin(a) * (uv.x - mid.x) + mid.y
  );
}

void main() {
${fbody}
}`
  .split('\n')
  .map((ln, i) => `${String(i + 1).padStart(3, ' ')} │ ${ln}`)
  .join('\n')

export default function Material(props: MeshStandardMaterialProps) {
  const [tex0, tex1] = useTexture(['/tex0.png', '/tex1.png'])
  const output = useRef(0)

  const uniforms = useMemo(
    () => ({
      uChannel0: { value: tex0 },
      uChannel1: { value: tex1 },
      uMouse: { value: new THREE.Vector3() },
      uTime: { value: 0 }
    }),
    [tex0, tex1]
  )

  const pointer = useMemo(() => new THREE.Vector3(), [])

  const onBeforeCompile = useCallback(
    (v: WebGLProgramParametersWithUniforms) => {
      v.defines = { ...v.defines, USE_ALPHAHASH: true, USE_UV: true }
      v.uniforms = { ...v.uniforms, ...uniforms }

      v.vertexShader = v.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
          varying vec3 vPos;
          varying vec3 vMouse;
          uniform vec3 uMouse;`
        )
        .replace('#include <project_vertex>', vertex)

      v.fragmentShader = v.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>

          varying vec3 vPos;
          varying vec3 vMouse;

          uniform mat4 modelMatrix;
          uniform float uTime;
          uniform vec3 uMouse;
          uniform sampler2D uChannel0;
          uniform sampler2D uChannel1;

          vec2 rotateUV(vec2 uv, float a, vec2 mid) {
            return vec2(
              cos(a) * (uv.x - mid.x) + sin(a) * (uv.y - mid.y) + mid.x,
              cos(a) * (uv.y - mid.y) - sin(a) * (uv.x - mid.x) + mid.y
            );
          }`
        )
        .replace('#include <map_fragment>', fragment)
    },
    [uniforms]
  )

  useFrame(({ camera, clock, pointer: mouse }, delta) => {
    pointer.set(mouse.x, mouse.y, 0.5).unproject(camera)
    pointer.z = 0

    uniforms.uMouse.value.copy(pointer)
    uniforms.uTime.value = clock.elapsedTime

    output.current += delta

    if (output.current < 1 / 12) return
    output.current = 0

    const vals: Record<string, string> = {
      mx: sgn(pointer.x),
      my: sgn(pointer.y),
      mz: sgn(pointer.z),
      t: pad(uniforms.uTime.value.toFixed(2), 6)
    }

    $output.set({ template, vals })
  })

  return (
    <meshStandardMaterial
      key={`${vertex}.${fragment}`}
      metalness={0}
      onBeforeCompile={onBeforeCompile}
      roughness={0.5}
      {...props}
    />
  )
}
