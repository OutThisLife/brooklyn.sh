import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { type WebGLProgramParametersWithUniforms } from 'three'

export default function Material() {
  const [tex0, tex1] = useTexture(['/tex0.png', '/tex1.png'])

  const uniforms = useMemo(
    () => ({
      uChannel0: { value: tex0 },
      uChannel1: { value: tex1 },
      uMouse: { value: new THREE.Vector2() },
      uTime: { value: 0 }
    }),
    [tex0, tex1]
  )

  const onBeforeCompile = useCallback(
    (v: WebGLProgramParametersWithUniforms) => {
      v.defines = { ...v.defines, USE_UV: true, USE_ALPHAHASH: true }
      v.uniforms = { ...v.uniforms, ...uniforms }

      v.fragmentShader = v.fragmentShader
        .replace(
          '#include <common>',
          `
          #include <common>

          uniform float uTime;
          uniform vec2 uMouse;
          uniform sampler2D uChannel0;
          uniform sampler2D uChannel1;

          vec2 rotateUV(vec2 uv, float a, vec2 mid) {
            return vec2(
              cos(a) * (uv.x - mid.x) + sin(a) * (uv.y - mid.y) + mid.x,
              cos(a) * (uv.y - mid.y) - sin(a) * (uv.x - mid.x) + mid.y
            );
          }
          `
        )
        .replace(
          '#include <map_fragment>',
          `
          #include <map_fragment>

          vec3 q = vPosition.xyz;
          vec2 p = vUv * 2. - .5;
          vec2 mv = uMouse * 2. - 1.;

          float isTop = step(.45, q.y);
          float isBottom = step(q.y, -.45);
          float isFront = step(.45, q.z);
          float isBack = step(q.z, -.45);
          float isRight = step(.45, q.x);
          float isLeft = step(q.x, -.45);

          p = rotateUV(p, distance(p, mv) * .2, vec2(.5));
          p = rotateUV(p, uTime * 2., vec2(.5));

          vec4 lin = mix(
            vec4(0),
            mix(
              texture2D(uChannel0, p),
              texture2D(uChannel1, p),
              isBottom
            ),
            min(isBottom + isBack, 1.)
          );

          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.85), smoothstep(1.5, 0., distance(abs(p), vec2(1, .5))));
          diffuseColor = mix(diffuseColor, vec4(lin.rgb * 2., 1), pow(lin.a, 4.));
          `
        )

      document.getElementById('output')!.innerText =
        `${v.vertexShader}\n\n${v.fragmentShader}`
    },
    []
  )

  useFrame(({ pointer, clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uMouse.value.lerp(pointer, 0.1)
  })

  return (
    <meshStandardMaterial
      roughness={0.5}
      metalness={0}
      {...{ onBeforeCompile }}
    />
  )
}
