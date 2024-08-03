import { useStore } from '@nanostores/react'
import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { atom } from 'nanostores'
import { useMemo } from 'react'

export const $output = atom<string>('')

export default function Output() {
  const { height, width } = useThree(st => st.viewport)
  const output = useStore($output)

  const [w, h] = useMemo(
    () => [width / 2 - 0.05, height / 2 - 0.05],
    [width, height]
  )

  return (
    <group position={[-w, h, 2]}>
      <Text anchorX="left" anchorY="top" fontSize={0.02} fontWeight={500}>
        I am a full stack engineer{'\n'}
        &amp; have been coding since I was ~12
        {'\n'}
        w/ over 10 years of professional experience
      </Text>

      <Text
        anchorX="left"
        anchorY="top"
        fillOpacity={0.25}
        fontSize={0.02}
        letterSpacing={-0.03}>
        {'\n\n\n\n'}
        {output}
      </Text>
    </group>
  )
}
