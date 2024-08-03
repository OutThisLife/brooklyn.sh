import { Instance, InstanceProps } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function Particle({
  seed = Math.random(),
  ...props
}: ParticleProps) {
  const ref = useRef<any>(null!)

  useEffect(() => {
    ref.current?.updateMatrix()
    ref.current?.geometry?.center()
  }, [ref.current?.geometry])

  useEffect(() => {
    const duration = Math.PI / 2 + seed * Math.PI
    const delay = seed * 1.8 + 0.2
    const scalar = seed * 0.05 - 0.05

    const settings = () => ({
      [Math.random() < 0.5 ? 'x' : 'z']: `+=${Math.PI * 0.5}`,
      ease: ['power2.inOut', 'power3.inOut', 'power4.inOut'][
        Math.floor(seed * 3)
      ]
    })

    const tl = gsap.timeline({
      defaults: { duration, ease: 'power2.inOut', delay },
      repeat: -1,
      repeatDelay: 2 + seed,
      onStart: () => {
        const init = ref.current?.scale?.clone()

        void gsap.to(ref.current?.scale, {
          delay,
          duration: 2,
          ease: 'sine.inOut',
          repeat: 1,
          x: `+=${scalar}`,
          y: `+=${scalar}`,
          yoyo: true,
          z: `+=${scalar}`,
          onComplete: () => void gsap.set(ref.current?.scale, init)
        })
      },
      onRepeat: () => void tl.clear().to(ref.current?.rotation, settings())
    })

    tl.clear().to(ref.current?.rotation, settings())

    return () => void tl.kill()
  }, [])

  return <Instance {...{ ref, ...props }} />
}

interface ParticleProps extends InstanceProps {
  seed?: number
}
