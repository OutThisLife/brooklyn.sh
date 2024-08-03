import { Canvas, extend } from '@react-three/fiber'
import { button, Leva, useControls } from 'leva'
import { lazy, Suspense } from 'react'
import { FilmPass, LUTPass, UnrealBloomPass, WaterPass } from 'three-stdlib'

extend({ FilmPass, LUTPass, UnrealBloomPass, WaterPass })

const Scene = lazy(() => import('./Scene'))
const Env = lazy(() => import('./Env'))

export default function App() {
  useControls('(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', {
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
      <Canvas camera={{ zoom: 600 }} orthographic>
        <Suspense>
          <Scene />
          <Env />
        </Suspense>
      </Canvas>

      <Leva
        theme={{ colors: { accent2: '#ec4899' } }}
        titleBar={{ filter: false }}
      />
    </>
  )
}
