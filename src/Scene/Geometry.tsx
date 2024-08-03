import { createShape, eps } from '../../utils'

export default function Geometry() {
  return (
    <extrudeGeometry
      args={[
        createShape(1, 1, 0.175),
        {
          bevelEnabled: true,
          bevelSegments: 32,
          bevelSize: 0.15,
          curveSegments: 32,
          depth: 1 - 0.175 - eps
        }
      ]}
    />
  )
}
