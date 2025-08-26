import type { ReactThreeFiber } from '@react-three/fiber'
import type { UnrealBloomPass } from 'three-stdlib'

import type { DitheringPass } from './dithering'
import type { GrainPass } from './grain'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ditheringPass: ReactThreeFiber.Node<DitheringPass, typeof DitheringPass>
      grainPass: ReactThreeFiber.Node<GrainPass, typeof GrainPass>
      unrealBloomPass: ReactThreeFiber.Node<
        UnrealBloomPass,
        typeof UnrealBloomPass
      >
    }
  }
}
