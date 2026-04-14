import { Effects } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { folder, useControls } from 'leva'
import { useMemo } from 'react'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three-stdlib'

import { GrainPass } from './grain'

extend({ GrainPass, UnrealBloomPass })

export default function FX() {
  const bloomSize = useMemo(() => new THREE.Vector2(1024, 1024), [])

  const config = useControls(
    'Effects',
    {
      bloom: folder({
        bloomRadius: { max: 2, min: 0, step: 0.01, value: 0.95 },
        bloomStrength: { max: 3, min: 0, step: 0.01, value: 0.25 },
        bloomThreshold: { max: 1, min: 0, step: 0.01, value: 0.01 },
        enableBloom: { value: true }
      }),
      grain: folder({
        blendMode: {
          options: {
            Add: 0,
            Multiply: 1,
            Overlay: 2,
            Screen: 3,
            'Soft Light': 4
          },
          value: 0
        },
        enableGrain: { value: false },
        intensity: { max: 1, min: 0, step: 0.003, value: 0.02 },
        size: { max: 5, min: 0.5, step: 0.1, value: 0.5 },
        speed: { max: 60, min: 0, step: 1, value: 0 }
      })
    },
    { collapsed: true }
  )

  return (
    <Effects anisotropy={16} disableGamma multisamping={0}>
      <grainPass
        args={[
          {
            blendMode: config.blendMode,
            intensity: config.intensity,
            size: config.size,
            speed: config.speed
          }
        ]}
        enabled={config.enableGrain}
      />

      <unrealBloomPass
        args={[bloomSize, 0.25, 0.95, 0.01]}
        enabled={config.enableBloom}
        radius={config.bloomRadius}
        strength={config.bloomStrength}
        threshold={config.bloomThreshold}
      />
    </Effects>
  )
}
