import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { type WebGLProgramParametersWithUniforms } from 'three'

export default function Material() {
  const $output = useMemo(() => document.getElementById('output')!, [])
  const [tex0, tex1] = useTexture(['/tex0.png', '/tex1.png'])

  const uniforms = useMemo(
    () => ({
      uChannel0: { value: tex0 },
      uChannel1: { value: tex1 },
      uMouse: { value: new THREE.Vector3() },
      uTime: { value: 0 }
    }),
    [tex0, tex1]
  )

  const onBeforeCompile = useCallback(
    (v: WebGLProgramParametersWithUniforms) => {
      v.defines = {
        ...v.defines,
        USE_UV: true,
        USE_ALPHAHASH: true
      }

      v.uniforms = { ...v.uniforms, ...uniforms }

      v.vertexShader = v.vertexShader
        .replace(
          '#include <common>',
          `
          #include <common>
          uniform vec3 uMouse;

          varying vec3 vPos;
          `
        )
        .replace(
          '#include <project_vertex>',
          `
          vec4 mvPosition = vec4(transformed, 1);

          #ifdef USE_INSTANCING

            mvPosition = instanceMatrix * mvPosition;
            vPos = mvPosition.xyz;

          #endif

          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;
          `
        )
        .replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>

          {
            const float maxD = 2.;
            const float amp = .04;
            
            vec3 p = (modelMatrix * vec4(position, 1.0)).xyz;
            vec3 mv = uMouse - p;
            mv.z = .5;

            float d = length(mv) - .1;
            d = 1. - smoothstep(0., maxD, d);
            d *= amp;

            transformed += normalize(mv) * d;
          }
          `
        )

      v.fragmentShader = v.fragmentShader
        .replace(
          '#include <common>',
          `
          #include <common>

          varying vec3 vPos;

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
          }
          `
        )
        .replace(
          '#include <map_fragment>',
          `
          #include <map_fragment>

          vec3 q = vPosition.xyz;
          vec2 p = vUv * 2. - .5;
          vec2 mv = uMouse.xy * 2. - 1.;

          {
            float isTop = step(.45, q.y);
            float isBottom = step(q.y, -.45);
            float isFront = step(.45, q.z);
            float isBack = step(q.z, -.45);
            float isRight = step(.45, q.x);
            float isLeft = step(q.x, -.45);

            p = rotateUV(p, distance(p, mv) * .2, vec2(.5));
            p = rotateUV(p, uTime * .15, vec2(.5));

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
          }

          {
            vec3 p = (modelMatrix * vec4(vPos, 1.0)).xyz;
            vec3 mv = uMouse - p;
            mv.z = 0.;
            
            float d = length(mv);
            d = 1. - step(.05, d);

            // diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0, 1, 0), d);
          }
          `
        )

      $output.innerText = `${v.fragmentShader}`
    },
    []
  )

  useFrame(({ pointer, clock, camera, scene }) => {
    uniforms.uMouse.value.lerp(
      new THREE.Vector3(pointer.x, pointer.y, 0.5).unproject(camera),
      0.03
    )

    uniforms.uTime.value = clock.getElapsedTime()

    if (!scene.getObjectByName('cursor')) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1
      })

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.01), mat)
      const edge = new THREE.Mesh(new THREE.RingGeometry(0.015, 0.016, 32), mat)

      mesh.add(edge)
      mesh.name = 'cursor'
      scene.add(mesh)
    }

    scene
      .getObjectByName('cursor')
      ?.position.copy(uniforms.uMouse.value.setZ(2))
  })

  return (
    <meshStandardMaterial
      key={Math.random()}
      roughness={0.5}
      metalness={0}
      {...{ onBeforeCompile }}
    />
  )
}
