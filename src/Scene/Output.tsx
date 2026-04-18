import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { atom } from 'nanostores'

export interface Telemetry {
  template: string
  vals: Record<string, string>
}

export const $output = atom<Telemetry>({ template: '', vals: {} })

export default function Output() {
  const { height, width } = useThree(st => st.viewport)

  return (
    <group position={[-(width / 2 - 0.05), height / 2 - 0.05, 2]}>
      <Text anchorX="left" anchorY="top" fontSize={0.02} fontWeight={500}>
        I am a full stack, design engineer; top ~0.05% token user{'\n'}
        &amp; have been coding since I was ~12{'\n'}
        w/ over 18 years of professional experience
      </Text>
    </group>
  )
}
