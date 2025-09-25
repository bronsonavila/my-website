'use client'

import { debounce } from '@/lib/debounce'
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// Configuration

const CONFIG = {
  background: {
    gradientStops: [
      { stop: 0, color: 'rgb(38,26,60)' },
      { stop: 0.25, color: 'rgb(28,20,44)' },
      { stop: 0.5, color: 'rgb(22,16,34)' },
      { stop: 0.75, color: 'rgb(16,12,24)' },
      { stop: 0.9, color: 'rgb(12,12,18)' },
      { stop: 1, color: 'rgb(10,10,14)' }
    ]
  },
  nebulae: {
    baseHue: {
      primary: { min: 220, range: 60 },
      secondary: { min: 0, range: 60 },
      secondaryChance: 0.3
    },
    count: 6,
    gradientStops: [
      { stop: 0, hsla: (hue: number) => `hsla(${hue}, 70%, 24%, 0.028)` },
      { stop: 0.25, hsla: (hue: number) => `hsla(${hue + 8}, 75%, 28%, 0.034)` },
      { stop: 0.55, hsla: (hue: number) => `hsla(${hue + 14}, 78%, 30%, 0.041)` },
      { stop: 0.85, hsla: (hue: number) => `hsla(${hue + 24}, 65%, 24%, 0.018)` },
      { stop: 1, hsla: (hue: number) => `hsla(${hue + 30}, 60%, 20%, 0)` }
    ]
  },
  parallax: { mouse: 7, scroll: 15 },
  performance: {
    debounceResize: 500,
    heightNoiseThreshold: 180,
    lerpAmount: { mouse: 0.006, scroll: 0.01 }
  },
  rotationSpeed: -0.00004
}

// Types

interface Nebula {
  baseHue: number
  canvas: HTMLCanvasElement
  distanceFactor: number
  size: number
  x: number
  y: number
}

interface SpaceAnimationState {
  backgroundRotation: number
  mouseX: number
  mouseY: number
  nebulae: Nebula[]
  prefersReducedMotion: boolean
  scrollY: number
  stars: Star[]
  targetMouseX: number
  targetMouseY: number
  targetScrollY: number
}

interface Star {
  brightness: number
  distanceFactor: number
  phase: number
  x: number
  y: number
}

interface ViewportSnapshot {
  height: number
  isPortrait: boolean
  width: number
}

// Data Generation

const generateNebulae = (width: number, height: number): Nebula[] => {
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

const generateStars = (width: number, height: number): Star[] => {
  const holeX = width / 2
  const holeY = height / 2
  const starDensity = getStarDensity(width)
  const starCount = Math.floor((width * height) / starDensity)
  const stars: Star[] = []

  for (let i = 0; i < starCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const baseBrightness = 0.3 + Math.random() * 0.4
    const distance = width * 0.1 + Math.random() * width * 0.6
    const distanceFactor = 0.6 + 0.6 * (distance / (width * 0.7))
    const normalizedDistance = (distance - width * 0.1) / (width * 0.6)
    const x = holeX + Math.cos(angle) * distance
    const y = holeY + Math.sin(angle) * distance

    stars.push({
      brightness: baseBrightness + normalizedDistance * 0.2,
      distanceFactor,
      phase: Math.random() * Math.PI * 2,
      x,
      y
    })
  }

  return stars
}

const getStarDensity = (width: number) => {
  if (width >= 1280) return 6000

  if (width >= 768) return 8000

  return 12000
}

// Canvas Rendering

const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, parallaxAmount: number) => {
  const holeX = width / 2
  const holeY = height / 2
  const bgGradient = ctx.createRadialGradient(holeX, holeY, 0, holeX, holeY, Math.max(width, height))

  CONFIG.background.gradientStops.forEach(({ stop, color }) => {
    bgGradient.addColorStop(stop, color)
  })

  ctx.fillStyle = bgGradient

  ctx.fillRect(-parallaxAmount, -parallaxAmount, width + parallaxAmount * 2, height + parallaxAmount * 2)
}

const drawNebulaeToContext = (
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

const drawStarsToContext = (
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

// Component

const SpaceBackground = ({ onReady }: { onReady?: () => void }) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const animationState = useRef<SpaceAnimationState>({
    backgroundRotation: 0,
    mouseX: 0,
    mouseY: 0,
    nebulae: [],
    prefersReducedMotion: false,
    scrollY: 0,
    stars: [],
    targetMouseX: 0,
    targetMouseY: 0,
    targetScrollY: 0
  })

  const lastViewport = useRef<ViewportSnapshot>({ height: 0, isPortrait: true, width: 0 })

  // Stable max scroll used to normalize parallax so small visual viewport
  // changes (mobile browser navbar show/hide) do not shift the background.
  const stableMaxScroll = useRef(1)

  useEffect(() => {
    animationState.current.prefersReducedMotion = prefersReducedMotion
  }, [prefersReducedMotion])

  useEffect(() => {
    let animationFrameRef: number | undefined

    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const init = () => {
      const { width, height } = canvas

      animationState.current.stars = generateStars(width, height)
      animationState.current.nebulae = generateNebulae(width, height)
      animationState.current.backgroundRotation = 0
    }

    resizeCanvas()

    init()

    // Seed last viewport after first init.
    lastViewport.current = {
      height: window.innerHeight,
      isPortrait: window.innerHeight >= window.innerWidth,
      width: window.innerWidth
    }

    stableMaxScroll.current = Math.max(1, document.documentElement.scrollHeight - lastViewport.current.height)

    const onMouseMove = (event: MouseEvent) => {
      if (animationState.current.prefersReducedMotion) return

      animationState.current.targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2
      animationState.current.targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const onScroll = () => {
      if (animationState.current.prefersReducedMotion) return

      const maxScroll = stableMaxScroll.current

      animationState.current.targetScrollY = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll)

    const draw = () => {
      if (!ctx) return

      const state = animationState.current

      const { lerpAmount } = CONFIG.performance

      state.mouseX += (state.targetMouseX - state.mouseX) * lerpAmount.mouse
      state.mouseY += (state.targetMouseY - state.mouseY) * lerpAmount.mouse
      state.scrollY += (state.targetScrollY - state.scrollY) * lerpAmount.scroll

      const backgroundParallaxAmount = Math.max(CONFIG.parallax.mouse, CONFIG.parallax.scroll)

      const offsetX = -state.mouseX * CONFIG.parallax.mouse
      const offsetY = -state.mouseY * CONFIG.parallax.mouse + state.scrollY * CONFIG.parallax.scroll

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.translate(offsetX, offsetY)

      drawBackground(ctx, canvas.width, canvas.height, backgroundParallaxAmount)

      drawNebulaeToContext(ctx, state.nebulae, {
        backgroundRotation: state.backgroundRotation,
        height: canvas.height,
        mouseX: state.mouseX,
        mouseY: state.mouseY,
        scrollY: state.scrollY,
        width: canvas.width
      })

      if (!state.prefersReducedMotion) state.backgroundRotation += CONFIG.rotationSpeed

      drawStarsToContext(ctx, state.stars, {
        backgroundRotation: state.backgroundRotation,
        height: canvas.height,
        width: canvas.width
      })

      ctx.restore()

      animationFrameRef = requestAnimationFrame(draw)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameRef) {
          cancelAnimationFrame(animationFrameRef)

          animationFrameRef = undefined
        }
      } else if (!animationFrameRef) {
        draw()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    draw()

    if (onReady) onReady()

    const onResize = () => {
      const newHeight = window.innerHeight
      const newWidth = window.innerWidth
      const newIsPortrait = newHeight >= newWidth

      const heightDelta = Math.abs(newHeight - lastViewport.current.height)
      const orientationChanged = newIsPortrait !== lastViewport.current.isPortrait
      const widthChanged = newWidth !== lastViewport.current.width

      // Small height-only resizes typically happen when mobile browser chrome shows/hides.
      // Avoid reinitializing starfields for those to prevent visual popping.
      if (orientationChanged || widthChanged || heightDelta > CONFIG.performance.heightNoiseThreshold) {
        resizeCanvas()

        init()

        lastViewport.current = { width: newWidth, height: newHeight, isPortrait: newIsPortrait }

        stableMaxScroll.current = Math.max(1, document.documentElement.scrollHeight - newHeight)
      } else {
        // Track latest height to prevent accumulation while still ignoring noise.
        lastViewport.current.height = newHeight
      }
    }

    const debouncedOnResize = debounce(onResize, CONFIG.performance.debounceResize)

    window.addEventListener('resize', debouncedOnResize)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', debouncedOnResize)
      window.removeEventListener('scroll', onScroll)

      if (animationFrameRef) cancelAnimationFrame(animationFrameRef)
    }
  }, [onReady])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-10 opacity-60 sm:opacity-[.5875] md:opacity-[.575] lg:opacity-[.5625] xl:opacity-55"
      style={{ background: 'rgb(5, 5, 10)', height: '100lvh', width: '100lvw' }}
    />
  )
}

export default SpaceBackground
