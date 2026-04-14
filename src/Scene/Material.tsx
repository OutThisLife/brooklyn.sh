import { useTexture } from '@react-three/drei'
import type { MeshStandardMaterialProps } from '@react-three/fiber'
import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { WebGLProgramParametersWithUniforms } from 'three'

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

export default function Material(props: MeshStandardMaterialProps) {
  const { scene } = useThree()
  const [tex0, tex1] = useTexture(['/tex0.png', '/tex1.png'])
  const cursor = useRef<THREE.Mesh | null>(null)
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

  useEffect(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.1,
      transparent: true
    })

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.01), mat)
    const edge = new THREE.Mesh(new THREE.RingGeometry(0.015, 0.016, 32), mat)

    mesh.add(edge)
    mesh.name = 'cursor'
    scene.add(mesh)
    cursor.current = mesh

    return () => {
      scene.remove(mesh)
      mesh.geometry.dispose()
      edge.geometry.dispose()
      mat.dispose()
      cursor.current = null
    }
  }, [scene])

  useFrame(({ camera, clock, pointer: mouse }, delta) => {
    pointer.set(mouse.x, mouse.y, 0.5).unproject(camera)
    pointer.z = 0

    uniforms.uMouse.value.copy(pointer)
    uniforms.uTime.value = clock.elapsedTime

    cursor.current?.position.copy(pointer)
    cursor.current && (cursor.current.position.z = 2)

    output.current += delta

    if (output.current < 1 / 12) return
    output.current = 0

    $output.set(
      `${vertex}\n${fragment}`
        .replace(
          /uMouse/gm,
          `vec3(${pointer
            .toArray()
            .map(i => i.toFixed(2))
            .join(', ')})`
        )
        .replace(/uTime/gm, uniforms.uTime.value.toFixed(2))
        .trim()
    )
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
