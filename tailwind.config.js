const gridSteps = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => [i, `${i} / ${i * -1}`])
)

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css,scss}'],
  plugins: [],
  theme: {
    extend: {
      gridTemplateColumns: { 40: 'repeat(40, minmax(0, 1fr))' },
      gridTemplateRows: { 40: 'repeat(40, minmax(0, 1fr))' },
      overflow: {
        overlay: 'overlay'
      }
    },
    gridColumn: gridSteps,
    gridRow: gridSteps
  }
}
