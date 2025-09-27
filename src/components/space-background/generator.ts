import { CONFIG } from './config'
import type { Nebula, Star } from './types'

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
  const starDensity = width >= 1280 ? 6000 : width >= 768 ? 8000 : 12000
  const starCount = Math.floor((width * height) / starDensity)
  const stars: Star[] = []

  for (let i = 0; i < starCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const baseBrightness = 0.2 + Math.random() * 0.4
    const distance = width * 0.1 + Math.random() * width * 0.6
    const distanceFactor = 0.6 + 0.6 * (distance / (width * 0.7))
    const normalizedDistance = (distance - width * 0.1) / (width * 0.6)
    const x = holeX + Math.cos(angle) * distance
    const y = holeY + Math.sin(angle) * distance

    stars.push({
      brightness: baseBrightness + normalizedDistance * 0.6,
      distanceFactor,
      phase: Math.random() * Math.PI * 2,
      x,
      y
    })
  }

  return stars
}
