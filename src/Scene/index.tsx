import { Instances } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { lazy, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const Geometry = lazy(() => import('./Geometry'))
const Material = lazy(() => import('./Material'))
const Output = lazy(() => import('./Output'))
const Particle = lazy(() => import('./Particle'))

const gridRot = new THREE.Euler(Math.PI / 5, -Math.PI / 4, 0)
const gridQ = new THREE.Quaternion().setFromEuler(gridRot)
const gridInvQ = gridQ.clone().invert()

export default function Scene() {
  const ref = useRef<THREE.Group>(null!)
  const { viewport } = useThree()

  const { gridSize } = useControls({
    gridSize: { label: 'Grid Size', max: 20, min: 1, value: 16 }
  })

  const gridSpan = useMemo(
    () => Math.max(4, Math.max(viewport.width, viewport.height) * 1.1),
    [viewport]
  )

  const steps = Math.max(gridSize - 1, 1)
  const spacing = useMemo(() => gridSpan / steps, [gridSpan, steps])

  const highlight = useMemo(() => {
    const x = (viewport.width / 2) * 0.4
    const y = (viewport.height / 2) * 0.4

    const rayOrigin = new THREE.Vector3(x, y, 10)
    const rayDir = new THREE.Vector3(0, 0, -1)

    rayOrigin.applyQuaternion(gridInvQ)
    rayDir.applyQuaternion(gridInvQ)

    if (Math.abs(rayDir.y) < 0.0001) return -1

    const t = -rayOrigin.y / rayDir.y
    const localX = rayOrigin.x + t * rayDir.x
    const localZ = rayOrigin.z + t * rayDir.z

    const idxX = Math.max(
      0,
      Math.min(gridSize - 1, Math.round(localX / spacing + gridSize / 2 - 0.5))
    )

    const idxY = Math.max(
      0,
      Math.min(gridSize - 1, Math.round(localZ / spacing + gridSize / 2 - 0.5))
    )

    return idxX * gridSize + idxY
  }, [gridSize, spacing, viewport])

  const { particleCount, particles } = useMemo(() => {
    const count = gridSize ** 2

    return {
      particleCount: count,
      particles: Array.from({ length: count }, (_, i) => {
        const x = Math.floor(i / gridSize)
        const y = i % gridSize

        return (
          <Particle
            gridSize={gridSize}
            highlight={i === highlight}
            id={i}
            key={`${gridSize}-${i}`}
            position={[(x - steps / 2) * spacing, 0, (y - steps / 2) * spacing]}
            spacing={spacing}
          />
        )
      })
    }
  }, [gridSize, spacing, highlight, steps])

  useEffect(() => {
    ref.current?.updateMatrix()
    ref.current?.traverse(
      el => el instanceof THREE.Mesh && el.geometry.center()
    )
  }, [gridSize])

  return (
    <>
      <group ref={ref} rotation={[Math.PI / 5, -Math.PI / 4, 0]}>
        <Instances key={gridSize} range={particleCount}>
          <Geometry />
          <Material />
          {particles}
        </Instances>
      </group>

      <Output />
    </>
  )
}
