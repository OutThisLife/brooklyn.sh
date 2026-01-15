import { Effects, Environment } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three-stdlib'

extend({ UnrealBloomPass })

export default function Env() {
  const { fog } = useControls({ fog: { label: 'Fog', value: '#f800a8' } })

  return (
    <>
      <color args={['#000']} attach="background" />
      <fogExp2 args={[fog, 0.08]} attach="fog" />

      <Environment environmentIntensity={0.24} preset="city" />

      <Effects disableGamma>
        <unrealBloomPass args={[new THREE.Vector2(1024, 1024), 0.3, 1, 0]} />
      </Effects>
    </>
  )
}
