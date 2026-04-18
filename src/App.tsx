import { Canvas } from '@react-three/fiber'
import { Leva, button, useControls } from 'leva'
import { Suspense, lazy, useState } from 'react'

import Cursor from './Cursor'
import FX from './Scene/effects'

const Scene = lazy(() => import('./Scene'))
const Env = lazy(() => import('./Env'))
const Code = lazy(() => import('./Code'))

export default function App() {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)

  useControls('(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 🐇', {
    'Email Me': button(() =>
      window.open('mailto:brooklyn.bb.nicholson@gmail.com', '_blank')
    ),
    GitHub: button(() =>
      window.open('//github.com/outthislife', '_blank', 'noopener,noreferrer')
    ),
    LinkedIn: button(() =>
      window.open(
        '//linkedin.com/in/bbbrooklyn',
        '_blank',
        'noopener,noreferrer'
      )
    ),
    Resume: button(() =>
      window.open('/resume.pdf', '_blank', 'noopener,noreferrer')
    )
  })

  return (
    <>
      <div className="fixed inset-0" ref={setStage}>
        <Canvas
          camera={{ zoom: 600 }}
          dpr={[1, 1.5]}
          eventPrefix="client"
          eventSource={stage ?? undefined}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          orthographic>
          <Suspense>
            <Scene />
            <Env />
            <FX />
          </Suspense>
        </Canvas>

        <Suspense>
          <Code />
        </Suspense>

        <Cursor />
      </div>

      <Leva
        collapsed
        theme={{ colors: { accent2: '#ec4899' } }}
        titleBar={{ filter: false }}
      />
    </>
  )
}
