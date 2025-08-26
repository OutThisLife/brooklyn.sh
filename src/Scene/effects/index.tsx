import { Effects } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { folder, useControls } from 'leva'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three-stdlib'

import { DitheringPass } from './dithering'
import { GrainPass } from './grain'

extend({ DitheringPass, GrainPass, UnrealBloomPass })

export default function FX() {
  const config = useControls(
    'Effects',
    {
      bloom: folder({
        bloomRadius: {
          max: 2,
          min: 0,
          step: 0.01,
          value: 0.95
        },
        bloomStrength: {
          max: 3,
          min: 0,
          step: 0.01,
          value: .25
        },
        bloomThreshold: { max: 1, min: 0, step: 0.01, value: 0.01 },
        enableBloom: { value: true }
      }),
      dithering: folder({
        enableDithering: { value: true },
        grayscaleOnly: { value: false },
        gridSize: {
          max: 20,
          min: 1,
          step: 0.01,
          value: 4.11
        },
        pixelSizeRatio: {
          max: 10,
          min: 1,
          step: 0.01,
          value: 2.01
        },
        xRange: {
          max: 1,
          min: 0,
          step: 0.01,
          value: [.3, 1]
        },
        yRange: {
          max: 1,
          min: 0,
          step: 0.01,
          value: [0, 1]
        }
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
        intensity: {
          max: 1,
          min: 0,
          step: 0.003,
          value: 0.02
        },
        size: {
          max: 5,
          min: 0.5,
          step: 0.1,
          value: 0.5
        },
        speed: {
          max: 60,
          min: 0,
          step: 1,
          value: 0
        }
      })
    },
    { collapsed: true }
  )

  return (
    <Effects anisotropy={16} disableGamma multisamping={0}>
      <ditheringPass
        args={[
          {
            grayscaleOnly: config.grayscaleOnly,
            gridSize: config.gridSize,
            pixelSizeRatio: config.pixelSizeRatio,
            xRange: config.xRange as [number, number],
            yRange: config.yRange as [number, number]
          }
        ]}
        enabled={config.enableDithering}
      />

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
        args={[
          new THREE.Vector2(1024, 1024),
          config.bloomStrength,
          config.bloomRadius,
          config.bloomThreshold
        ]}
        enabled={config.enableBloom}
      />
    </Effects>
  )
}
