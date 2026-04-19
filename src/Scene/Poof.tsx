import { useStore } from '@nanostores/react'
import gsap from 'gsap'
import { atom } from 'nanostores'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export interface PoofEvent {
  key: number
  pos: [number, number, number]
  size: number
}

export const $poofs = atom<PoofEvent[]>([])

let nextKey = 0

export const poof = (pos: [number, number, number], size: number) => {
  $poofs.set([...$poofs.get(), { key: ++nextKey, pos, size }])
}

const kill = (key: number) => {
  $poofs.set($poofs.get().filter(p => p.key !== key))
}

const N = 26

export default function Poof() {
  const poofs = useStore($poofs)

  return (
    <>
      {poofs.map(p => (
        <PoofOne ev={p} key={p.key} />
      ))}
    </>
  )
}

function PoofOne({ ev }: { ev: PoofEvent }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  const seeds = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        color: i % 4 === 0 ? '#ffb6d2' : '#ffffff',
        delay: Math.random() * 0.1,
        dir: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() * 0.5 + 0.5,
          Math.random() - 0.5
        ).normalize(),
        origin: new THREE.Vector3(
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.35,
          (Math.random() - 0.5) * 0.7
        ),
        reach: 0.5 + Math.random() * 0.4,
        size: 0.4 + Math.random() * 0.7
      })),
    []
  )

  useEffect(() => {
    const root = groupRef.current

    if (!root) return

    const { pos, size: s } = ev

    root.position.set(...pos)

    const tweens = meshRefs.current.flatMap((mesh, i) => {
      if (!mesh) return []

      const { delay, dir, origin, reach, size } = seeds[i]
      const start = origin.clone().multiplyScalar(s * 0.5)
      const end = dir
        .clone()
        .multiplyScalar(s * reach)
        .add(start)
      const dot = s * 0.055 * size
      const mat = mesh.material as THREE.MeshBasicMaterial

      mesh.position.copy(start)
      mesh.scale.setScalar(0.001)
      mat.opacity = 0.95

      return [
        gsap.to(mesh.scale, {
          delay,
          duration: 0.16,
          ease: 'back.out(2.6)',
          x: dot,
          y: dot,
          z: dot
        }),
        gsap.to(mesh.position, {
          delay,
          duration: 0.7,
          ease: 'power2.out',
          x: end.x,
          y: end.y,
          z: end.z
        }),
        gsap.to(mat, {
          delay: delay + 0.16,
          duration: 0.55,
          ease: 'power2.in',
          opacity: 0
        }),
        gsap.to(mesh.scale, {
          delay: delay + 0.5,
          duration: 0.22,
          ease: 'power2.in',
          x: 0.001,
          y: 0.001,
          z: 0.001
        })
      ]
    })

    tweens.push(gsap.delayedCall(1.05, () => kill(ev.key)))

    return () => tweens.forEach(t => t.kill())
  }, [ev, seeds])

  return (
    <group ref={groupRef}>
      {seeds.map((s, i) => (
        <mesh
          key={i}
          ref={el => {
            meshRefs.current[i] = el
          }}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color={s.color} transparent />
        </mesh>
      ))}
    </group>
  )
}
