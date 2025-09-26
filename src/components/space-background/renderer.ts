import { CONFIG } from './config'
import type { Nebula, Star } from './types'

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  parallaxAmount: number
) => {
  const holeX = width / 2
  const holeY = height / 2
  const bgGradient = ctx.createRadialGradient(holeX, holeY, 0, holeX, holeY, Math.max(width, height))

  CONFIG.background.gradientStops.forEach(({ stop, color }) => {
    bgGradient.addColorStop(stop, color)
  })

  ctx.fillStyle = bgGradient

  ctx.fillRect(-parallaxAmount, -parallaxAmount, width + parallaxAmount * 2, height + parallaxAmount * 2)
}

export const drawNebulaeToContext = (
  ctx: CanvasRenderingContext2D,
  nebulae: Nebula[],
  state: {
    backgroundRotation: number
    mouseX: number
    mouseY: number
    scrollY: number
    width: number
    height: number
  }
) => {
  const holeX = state.width / 2
  const holeY = state.height / 2

  for (const nebula of nebulae) {
    ctx.save()
    ctx.translate(holeX, holeY)

    const nebulaeRotation = state.backgroundRotation / nebula.distanceFactor

    ctx.rotate(nebulaeRotation)
    ctx.translate(-holeX, -holeY)

    const distanceFactor = nebula.distanceFactor

    const localScaleAmplitude = 0.015
    const localScrollAmplitude = 8

    const localScale =
      1 +
      (Math.abs(state.mouseX) + Math.abs(state.mouseY)) * 0.5 * (localScaleAmplitude / distanceFactor) +
      state.scrollY * (localScaleAmplitude / distanceFactor)

    const localTranslateAmplitude = 4

    const localOffsetX = state.mouseX * (localTranslateAmplitude / distanceFactor)
    const localOffsetY =
      state.mouseY * (localTranslateAmplitude / distanceFactor) +
      state.scrollY * (localScrollAmplitude / distanceFactor)

    const nx = nebula.x + localOffsetX
    const ny = nebula.y + localOffsetY

    // The pre-rendered nebula canvas is drawn centered on its target coordinates.
    ctx.drawImage(
      nebula.canvas,
      nx - nebula.size,
      ny - nebula.size,
      nebula.size * 2 * localScale,
      nebula.size * 2 * localScale
    )

    ctx.restore()
  }
}

export const drawStarsToContext = (
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  state: {
    backgroundRotation: number
    height: number
    width: number
  }
) => {
  const holeX = state.width / 2
  const holeY = state.height / 2

  for (const star of stars) {
    ctx.save()
    ctx.translate(holeX, holeY)

    const starRotation = state.backgroundRotation / star.distanceFactor

    ctx.rotate(starRotation)
    ctx.translate(-holeX, -holeY)

    const twinkle = 0.7 + 0.3 * Math.sin(star.phase + Date.now() * 0.0003) * star.brightness

    ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * twinkle})`

    ctx.fillRect(star.x, star.y, 1, 1)

    star.phase += 0.001

    ctx.restore()
  }
}
