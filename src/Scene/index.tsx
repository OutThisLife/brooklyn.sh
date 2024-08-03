import { useStore } from '@nanostores/react'
import { Instances, Text } from '@react-three/drei'
import { lazy } from 'react'
import { $output } from './Material'

const gridSize = 10
const spacing = 0.4

const Particle = lazy(() => import('./Particle'))
const Material = lazy(() => import('./Material'))
const Geometry = lazy(() => import('./Geometry'))

function Output() {
  const output = useStore($output)

  return (
    <Text
      anchorX="right"
      position={[0, 0, 2]}
      fillOpacity={0.25}
      fontSize={0.02}
      letterSpacing={-0.03}>
      {output}
    </Text>
  )
}

export default function Scene() {
  return (
    <>
      <group rotation={[Math.PI / 5, -Math.PI / 4, 0]}>
        <Instances limit={gridSize ** 3} range={gridSize ** 3}>
          <Geometry />
          <Material />

          {Array.from({ length: gridSize }).flatMap((_, x) =>
            Array.from({ length: gridSize }).flatMap((_, y) => (
              <Particle
                key={`${x}-${y}`}
                position={[
                  (x - gridSize / 2 + 0.5) * spacing,
                  0,
                  (y - gridSize / 2 + 0.5) * spacing
                ]}
                scale={0.3}
                color="#f51155"
              />
            ))
          )}
        </Instances>
      </group>

      <Output />
    </>
  )
}
