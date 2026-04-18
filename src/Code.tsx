import { useStore } from '@nanostores/react'
import { useControls } from 'leva'

import { $output } from './Scene/Output'

const mask =
  'linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)'

export default function Code() {
  const { template, vals } = useStore($output)

  const { fillOpacity } = useControls({
    fillOpacity: {
      label: 'Code Opacity',
      max: 1,
      min: 0,
      step: 0.01,
      value: 0.57
    }
  })

  const parts = template.split(/\{(\w+)\}/g)

  return (
    <pre
      className="
        pointer-events-auto fixed inset-y-20 left-7 z-10 m-0
        max-w-[55vw] overflow-x-hidden overflow-y-auto
        touch-pan-y select-text whitespace-pre
        font-mono text-[11px] leading-snug tracking-tight
      "
      style={{
        color: `rgba(255, 255, 255, ${fillOpacity})`,
        WebkitMaskImage: mask,
        maskImage: mask
      }}>
      {parts.map((part, i) =>
        i % 2 === 0 ? (
          part
        ) : (
          <span key={i} style={{ color: 'rgb(255, 255, 255)' }}>
            {vals[part] ?? ''}
          </span>
        )
      )}
    </pre>
  )
}
