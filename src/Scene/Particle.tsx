import type { InstanceProps } from '@react-three/drei'
import { Instance } from '@react-three/drei'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'

export default function Particle({
  id = 0,
  seed = Math.random(),
  ...props
}: ParticleProps) {
  const ref = useRef<any>(null!)

  const { color, gridSize, spacing } = useControls({
    color: { label: 'Color', value: '#f51155' },
    gridSize: { label: 'Grid Size', max: 20, min: 1, step: 2, value: 10 },
    spacing: { label: 'Spacing', max: 1, min: 0.1, value: 0.4 }
  })

  const scale = useMemo(() => {
    const x = 10 * 0.4
    const y = gridSize * spacing

    return 1.2 / (x * (y / x))
  }, [gridSize, spacing])

  useEffect(() => {
    const duration = Math.PI / 2 + seed * Math.PI
    const delay = seed * 1.8 + 0.2
    const scalar = seed * 0.05 - 0.05

    const fn = () => ({
      [Math.random() < 0.5 ? 'x' : 'z']: `+=${Math.PI * 0.5}`,
      ease: ['power2.inOut', 'power3.inOut', 'power4.inOut'][
        Math.floor(seed * 3)
      ]
    })

    const tl = gsap.timeline({
      defaults: { delay, duration, ease: 'power2.inOut' },
      onRepeat: () => void tl.clear().to(ref.current?.rotation, fn()),
      onStart: () =>
        void gsap.to(ref.current?.scale, {
          delay,
          duration: 2,
          ease: 'sine.inOut',
          onComplete: () => void gsap.set(ref.current?.scale, { x: scale, y: scale, z: scale }),
          repeat: 1,
          x: `+=${scalar}`,
          y: `+=${scalar}`,
          yoyo: true,
          z: `+=${scalar}`
        }),
      repeat: -1,
      repeatDelay: 2 + seed
    })

    tl.clear().to(ref.current?.rotation, fn())

    return () => void tl.kill()
  }, [])

  useEffect(() => {
    if (id === Math.round(gridSize ** 3 * 0.434)) {
      ref.current?.color?.set(0xffffff)
    }

    ref.current?.scale?.setScalar(scale)
  }, [gridSize, id, scale])

  return <Instance {...{ color, ref, ...props }} />
}

interface ParticleProps extends InstanceProps {
  seed?: number
}
