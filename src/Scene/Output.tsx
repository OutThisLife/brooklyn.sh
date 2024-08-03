import { useStore } from '@nanostores/react'
import { Text } from '@react-three/drei'
import { atom } from 'nanostores'
import { fragment, vertex } from './Material'

export const $output = atom<string>(`${vertex}\n${fragment}`)

export default function Output() {
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
