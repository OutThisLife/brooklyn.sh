import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

import { createShape, eps } from '../../utils'

export default function Geometry() {
  const geometry = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(createShape(1, 1, 0.175), {
      bevelEnabled: true,
      bevelSegments: 16,
      bevelSize: 0.15,
      curveSegments: 16,
      depth: 1 - 0.175 - eps
    })

    geometry.center()

    return geometry
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return <primitive attach="geometry" object={geometry} />
}
