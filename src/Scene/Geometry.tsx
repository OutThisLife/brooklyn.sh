import { createShape, eps } from '../../utils'

export default function Geometry() {
  return (
    <extrudeGeometry
      args={[
        createShape(1, 1, 0.175),
        {
          depth: 1 - 0.175 - eps,
          bevelEnabled: true,
          bevelSize: 0.15,
          bevelSegments: 32,
          curveSegments: 32
        }
      ]}
    />
  )
}
