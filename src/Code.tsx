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

  return (
    <pre
      className="
        pointer-events-auto fixed inset-y-20 left-7 z-10 m-0 hidden
        max-w-[55vw] md:block overflow-x-hidden overflow-y-auto
        touch-pan-y select-text whitespace-pre
        font-mono text-[11px] leading-snug tracking-tight
      "
      style={{
        WebkitMaskImage: mask,
        color: `rgba(255, 255, 255, ${fillOpacity})`,
        maskImage: mask
      }}>
      {template.split(/\{(\w+)\}/g).map((part, i) =>
        i % 2 === 0 ? (
          part
        ) : (
          <span className="text-white" key={i}>
            {vals[part] ?? ''}
          </span>
        )
      )}
    </pre>
  )
}
