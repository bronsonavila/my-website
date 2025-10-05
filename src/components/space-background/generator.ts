import { CONFIG } from './config'
import type { Nebula, Star } from './types'

const STAR_COLORS = [
  '170, 210, 255', // Pale blue
  '255, 255, 200', // Pale yellow
  '255, 220, 180', // Pale orange
  '255, 200, 200' // Pale red
]
const WHITE = '255, 255, 255'

export const generateNebulae = (width: number, height: number): Nebula[] => {
  const holeX = width / 2
  const holeY = height / 2
  const nebulae: Nebula[] = []

  for (let i = 0; i < CONFIG.nebulae.count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = width * 0.2 + Math.random() * (width * 0.4)
    const distanceFactor = 0.5 + 0.5 * (distance / (width * 0.6))
    const size = width * (0.15 + Math.random() * 0.25)
    const x = holeX + Math.cos(angle) * distance
    const y = holeY + Math.sin(angle) * distance

    const { primary, secondary, secondaryChance } = CONFIG.nebulae.baseHue

    const baseHue =
      Math.random() > secondaryChance
        ? primary.min + Math.random() * primary.range
        : secondary.min + Math.random() * secondary.range

    // Pre-render nebula to an offscreen canvas (for performance).
    const nebulaCanvas = document.createElement('canvas')
    const nebulaCtx = nebulaCanvas.getContext('2d')!
    const diameter = size * 2

    nebulaCanvas.width = diameter
    nebulaCanvas.height = diameter

    const nebulaGradient = nebulaCtx.createRadialGradient(size, size, 0, size, size, size)

    CONFIG.nebulae.gradientStops.forEach(({ stop, hsla }) => {
      nebulaGradient.addColorStop(stop, hsla(baseHue))
    })

    nebulaCtx.fillStyle = nebulaGradient

    nebulaCtx.fillRect(0, 0, diameter, diameter)

    nebulae.push({ canvas: nebulaCanvas, x, y, size, baseHue, distanceFactor })
  }

  return nebulae
}

export const generateStars = (width: number, height: number): Star[] => {
  const holeX = width / 2
  const holeY = height / 2
  const starDensity = width >= 1280 ? 7000 : width >= 768 ? 9000 : 13000
  const starCount = Math.floor((width * height) / starDensity)
  const stars: Star[] = []

  for (let i = 0; i < starCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const baseBrightness = 0.15 + Math.random() * 0.35
    const color = Math.random() < 0.5 ? STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)] : WHITE
    const distance = width * 0.1 + Math.random() * width * 0.6
    const distanceFactor = 0.6 + 0.6 * (distance / (width * 0.7))
    const normalizedDistance = (distance - width * 0.1) / (width * 0.6)
    const size = Math.random() < 0.25 ? 1.5 : 1
    const x = holeX + Math.cos(angle) * distance
    const y = holeY + Math.sin(angle) * distance

    stars.push({
      brightness: baseBrightness + normalizedDistance * 0.6,
      color,
      distanceFactor,
      phase: Math.random() * Math.PI * 2,
      size,
      x,
      y
    })
  }

  return stars
}
