import * as THREE from 'three'

export const eps = 0.00001

export function createShape(w: number, h: number, rad: number) {
  const s = new THREE.Shape()
  const r = (rad - eps) * 1.5

  return s
    .moveTo(r, 0)
    .lineTo(w - r, 0)
    .quadraticCurveTo(w, 0, w, r)
    .lineTo(w, h - r)
    .quadraticCurveTo(w, h, w - r, h)
    .lineTo(r, h)
    .quadraticCurveTo(0, h, 0, h - r)
    .lineTo(0, r)
    .quadraticCurveTo(0, 0, r, 0)
}
