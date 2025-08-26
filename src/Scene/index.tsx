import { Instances } from '@react-three/drei'
import { useControls } from 'leva'
import { lazy, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const Geometry = lazy(() => import('./Geometry'))
const Material = lazy(() => import('./Material'))
const Output = lazy(() => import('./Output'))
const Particle = lazy(() => import('./Particle'))
const FX = lazy(() => import('./effects'))

export default function Scene() {
  const ref = useRef<THREE.Group>(null!)

  const { gridSize, spacing } = useControls({
    gridSize: { label: 'Grid Size', max: 20, min: 1, value: 10 },
    spacing: { label: 'Spacing', max: 1, min: 0.1, value: 0.4 }
  })

  const particles = useMemo(
    () =>
      Array.from({ length: gridSize }).flatMap((_, x) =>
        Array.from({ length: gridSize }).map((__, y) => (
          <Particle
            id={x * gridSize ** 2 + y * gridSize + x}
            key={x * gridSize ** 2 + y * gridSize + x}
            position={[
              (x - gridSize / 2 + 0.5) * spacing,
              0,
              (y - gridSize / 2 + 0.5) * spacing
            ]}
          />
        ))
      ),
    [gridSize, spacing]
  )

  useEffect(() => {
    ref.current?.updateMatrix()
    ref.current?.traverse(
      el => el instanceof THREE.Mesh && el.geometry.center()
    )
  }, [gridSize, spacing])

  return (
    <>
      <group rotation={[Math.PI / 5, -Math.PI / 4, 0]} {...{ ref }}>
        <Instances range={gridSize ** 3}>
          <Geometry />
          <Material />

          {particles}
        </Instances>
      </group>

      <Output />
    </>
  )
}
