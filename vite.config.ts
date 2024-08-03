import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    glsl({ warnDuplicatedImports: false, watch: true }),
    tsconfigPaths()
  ],
  server: { host: '0.0.0.0' }
})
