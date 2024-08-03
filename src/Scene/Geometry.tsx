import { createShape, eps } from '../../utils'

export default function Geometry({ size = 1 }: { size?: number }) {
  return (
    <extrudeGeometry
      args={[
        createShape(size, size, 0.175),
        {
          bevelEnabled: true,
          bevelSegments: 32,
          bevelSize: 0.15,
          curveSegments: 32,
          depth: size - 0.175 - eps
        }
      ]}
    />
  )
}
