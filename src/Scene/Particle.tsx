import type { InstanceProps } from '@react-three/drei'
import { Instance } from '@react-three/drei'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'

export default function Particle({
  gridSize,
  highlight,
  id = 0,
  seed,
  spacing,
  ...props
}: ParticleProps) {
  const ref = useRef<any>(null!)

  const stableSeed = useMemo(
    () => seed ?? (id * 0.618033988749895) % 1,
    [id, seed]
  )

  const scale = useMemo(() => spacing * 0.9, [spacing])

  const { color } = useControls({
    color: { label: 'Color', value: '#f51155' }
  })

  useEffect(() => {
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
        tl.clear().to(ref.current?.rotation, getRotation())
      },
      onStart: () => {
        gsap.to(ref.current?.scale, {
          delay,
          duration: 2,
          ease: 'sine.inOut',
          onComplete: () => {
            gsap.set(ref.current?.scale, { x: scale, y: scale, z: scale })
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

    tl.clear().to(ref.current?.rotation, getRotation())

    return () => {
      tl.kill()
    }
  }, [stableSeed, scale])

  useEffect(() => {
    highlight && ref.current?.color?.set(0xffffff)

    if (ref.current) {
      ref.current.scale.setScalar(scale)
      ref.current.updateMatrix()
    }
  }, [gridSize, highlight, scale])

  return <Instance color={color} ref={ref} {...props} />
}

interface ParticleProps extends InstanceProps {
  gridSize: number
  highlight?: boolean
  seed?: number
  spacing: number
}
