import { Effects, Environment } from '@react-three/drei'
import { Canvas, extend } from '@react-three/fiber'
import clsx from 'clsx'
import { lazy, Suspense } from 'react'
import { FilmPass, LUTPass, UnrealBloomPass, WaterPass } from 'three-stdlib'

extend({ WaterPass, UnrealBloomPass, FilmPass, LUTPass })

const Scene = lazy(() => import('./Scene'))

export default function App() {
  return (
    <>
      <Canvas orthographic camera={{ zoom: 600 }}>
        <color attach="background" args={['#fff']} />
        <fogExp2 attach="fog" args={['#f800a8', 0.08]} />

        <Suspense>
          <Environment preset="city" environmentIntensity={0.24} />
          <Scene />

          <Effects disableGamma>
            {/* @ts-ignore */}
            <unrealBloomPass args={[undefined, 0.3, 1, 0]} />
          </Effects>
        </Suspense>
      </Canvas>

      <div
        id="output"
        style={{ overflow: 'overlay' }}
        className={clsx(
          'fixed inset-0 p-5 select-none',
          'text-xs font-mono whitespace-pre-wrap break-words tracking-tighter',
          'mix-blend-hard-light'
        )}
      />
    </>
  )
}
