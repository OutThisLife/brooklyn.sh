import type { InstanceProps } from '@react-three/drei'
import { Instance } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import type * as THREE from 'three'

export default function Particle({
  color,
  highlight,
  id = 0,
  seed,
  spacing,
  ...props
}: ParticleProps) {
  const ref = useRef<(THREE.Object3D & { color?: THREE.Color }) | null>(null)

  const stableSeed = useMemo(
    () => seed ?? (id * 0.618033988749895) % 1,
    [id, seed]
  )

  const scale = useMemo(() => spacing * 0.9, [spacing])

  useEffect(() => {
    const current = ref.current

    if (!current) return

    const duration = Math.PI / 2 + stableSeed * Math.PI
    const delay = stableSeed * 1.8 + 0.2
    const scalar = stableSeed * 0.05 - 0.05

    const getRotation = () => ({
      [stableSeed < 0.5 ? 'x' : 'z']: `+=${Math.PI * 0.5}`,
      ease: ['power2.inOut', 'power3.inOut', 'power4.inOut'][
        Math.floor(stableSeed * 3)
      ]
    })

    const tl = gsap.timeline({
      defaults: { delay, duration, ease: 'power2.inOut' },
      onRepeat: () => {
        tl.clear().to(current.rotation, getRotation())
      },
      onStart: () => {
        gsap.to(current.scale, {
          delay,
          duration: 2,
          ease: 'sine.inOut',
          onComplete: () => {
            gsap.set(current.scale, { x: scale, y: scale, z: scale })
          },
          repeat: 1,
          x: `+=${scalar}`,
          y: `+=${scalar}`,
          yoyo: true,
          z: `+=${scalar}`
        })
      },
      repeat: -1,
      repeatDelay: 2 + stableSeed
    })

    tl.clear().to(current.rotation, getRotation())

    return () => {
      tl.kill()
    }
  }, [stableSeed, scale])

  useEffect(() => {
    ref.current?.color?.set(highlight ? 0xffffff : color)
    ref.current?.scale.setScalar(scale)
    ref.current?.updateMatrix()
  }, [color, highlight, scale])

  return <Instance color={color} ref={ref} {...props} />
}

interface ParticleProps extends InstanceProps {
  color: string
  highlight?: boolean
  seed?: number
  spacing: number
}
