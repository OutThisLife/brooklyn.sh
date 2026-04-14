import { Environment } from '@react-three/drei'
import { useControls } from 'leva'

export default function Env() {
  const { fog } = useControls({ fog: { label: 'Fog', value: '#f800a8' } })

  return (
    <>
      <color args={['#000']} attach="background" />
      <fogExp2 args={[fog, 0.08]} attach="fog" />

      <Environment environmentIntensity={0.24} preset="city" />
    </>
  )
}
