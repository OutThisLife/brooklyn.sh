import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current

    if (!el) return

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-50"
      ref={ref}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform'
      }}>
      <div
        className="absolute left-0 top-0 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60"
        style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}
      />
      <div className="absolute left-0 top-0 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
    </div>
  )
}
