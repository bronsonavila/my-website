'use client'

import { debounce } from '@/lib/debounce'
import { useEffect, useRef } from 'react'

interface Nebula {
  baseHue: number
  distanceFactor?: number
  size: number
  x: number
  y: number
}

interface Star {
  brightness: number
  distanceFactor?: number
  phase: number
  x: number
  y: number
}

const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, parallaxAmount: number) => {
  const holeX = width / 2
  const holeY = height / 2

  const bgGradient = ctx.createRadialGradient(holeX, holeY, 0, holeX, holeY, Math.max(width, height))

  bgGradient.addColorStop(0, 'rgb(38,26,60)')
  bgGradient.addColorStop(0.25, 'rgb(28,20,44)')
  bgGradient.addColorStop(0.5, 'rgb(22,16,34)')
  bgGradient.addColorStop(0.75, 'rgb(16,12,24)')
  bgGradient.addColorStop(0.9, 'rgb(12,12,18)')
  bgGradient.addColorStop(1, 'rgb(10,10,14)')

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

    const nebulaeRotation = state.backgroundRotation / (nebula.distanceFactor ?? 1.0)

    ctx.rotate(nebulaeRotation)
    ctx.translate(-holeX, -holeY)

    const distanceFactor = nebula.distanceFactor ?? 1.0

    const localScaleAmplitude = 0.02
    const localScrollAmplitude = 8
    const localScale =
      1 +
      (Math.abs(state.mouseX) + Math.abs(state.mouseY)) * 0.5 * (localScaleAmplitude / distanceFactor) +
      state.scrollY * (localScaleAmplitude / distanceFactor)

    const localTranslateAmplitude = 6

    const localOffsetX = state.mouseX * (localTranslateAmplitude / distanceFactor)
    const localOffsetY =
      state.mouseY * (localTranslateAmplitude / distanceFactor) +
      state.scrollY * (localScrollAmplitude / distanceFactor)

    const nr = nebula.size * localScale
    const nx = nebula.x + localOffsetX
    const ny = nebula.y + localOffsetY

    const nebulaGradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr)

    nebulaGradient.addColorStop(0, `hsla(${nebula.baseHue}, 70%, 24%, 0.028)`)
    nebulaGradient.addColorStop(0.25, `hsla(${nebula.baseHue + 8}, 75%, 28%, 0.034)`)
    nebulaGradient.addColorStop(0.55, `hsla(${nebula.baseHue + 14}, 78%, 30%, 0.041)`)
    nebulaGradient.addColorStop(0.85, `hsla(${nebula.baseHue + 24}, 65%, 24%, 0.018)`)
    nebulaGradient.addColorStop(1, `hsla(${nebula.baseHue + 30}, 60%, 20%, 0)`)

    ctx.fillStyle = nebulaGradient

    ctx.beginPath()
    ctx.arc(nx, ny, nr, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

const drawStarsToContext = (
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  state: {
    backgroundRotation: number
    width: number
    height: number
  }
) => {
  const holeX = state.width / 2
  const holeY = state.height / 2

  for (const star of stars) {
    ctx.save()
    ctx.translate(holeX, holeY)

    const starRotation = state.backgroundRotation / (star.distanceFactor ?? 1.0)

    ctx.rotate(starRotation)
    ctx.translate(-holeX, -holeY)

    const twinkle = 0.7 + 0.3 * Math.sin(star.phase + Date.now() * 0.0003) * star.brightness

    ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * twinkle})`

    ctx.fillRect(star.x, star.y, 1, 1)

    star.phase += 0.001

    ctx.restore()
  }
}

const generateNebulae = (width: number, height: number, count: number): Nebula[] => {
  const holeX = width / 2
  const holeY = height / 2
  const nebulae: Nebula[] = []

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = width * 0.2 + Math.random() * (width * 0.4)
    const distanceFactor = 0.5 + 0.5 * (distance / (width * 0.6))
    const size = width * (0.15 + Math.random() * 0.25)
    const x = holeX + Math.cos(angle) * distance
    const y = holeY + Math.sin(angle) * distance

    const baseHue =
      Math.random() < 0.7
        ? 220 + Math.random() * 60 // Blues and purples
        : Math.random() * 60 // Occasional reds/oranges/yellows

    nebulae.push({ x, y, size, baseHue, distanceFactor })
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

const SpaceBackground = ({ onReady }: { onReady?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const animationState = useRef({
    backgroundRotation: 0,
    mouseX: 0,
    mouseY: 0,
    nebulae: [] as Nebula[],
    scrollY: 0,
    stars: [] as Star[],
    targetMouseX: 0,
    targetMouseY: 0,
    targetScrollY: 0
  })

  const lastViewport = useRef({
    height: 0,
    isPortrait: true,
    width: 0
  })

  // Stable max scroll used to normalize parallax so small visual viewport
  // changes (mobile browser chrome show/hide) do not shift the background.
  const stableMaxScroll = useRef(1)

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
      animationState.current.nebulae = generateNebulae(width, height, 6)
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
      animationState.current.targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2
      animationState.current.targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const onScroll = () => {
      const maxScroll = stableMaxScroll.current

      animationState.current.targetScrollY = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll)

    const draw = () => {
      if (!ctx) return

      const state = animationState.current

      state.mouseX += (state.targetMouseX - state.mouseX) * 0.01
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.01
      state.scrollY += (state.targetScrollY - state.scrollY) * 0.01

      const parallaxAmount = 15 // Max pixel offset

      const offsetX = -state.mouseX * parallaxAmount
      const offsetY = -state.mouseY * parallaxAmount + state.scrollY * parallaxAmount

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.translate(offsetX, offsetY)

      drawBackground(ctx, canvas.width, canvas.height, parallaxAmount)

      drawNebulaeToContext(ctx, state.nebulae, {
        backgroundRotation: state.backgroundRotation,
        height: canvas.height,
        mouseX: state.mouseX,
        mouseY: state.mouseY,
        scrollY: state.scrollY,
        width: canvas.width
      })

      state.backgroundRotation -= 0.00004

      drawStarsToContext(ctx, state.stars, {
        backgroundRotation: state.backgroundRotation,
        height: canvas.height,
        width: canvas.width
      })

      ctx.restore()

      animationFrameRef = requestAnimationFrame(draw)
    }

    draw()

    if (onReady) onReady()

    const onResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      const newIsPortrait = newHeight >= newWidth

      const heightDelta = Math.abs(newHeight - lastViewport.current.height)
      const orientationChanged = newIsPortrait !== lastViewport.current.isPortrait
      const widthChanged = newWidth !== lastViewport.current.width

      // Small height-only resizes typically happen when mobile browser chrome shows/hides.
      // Avoid reinitializing starfields for those to prevent visual popping.
      const HEIGHT_NOISE_THRESHOLD = 180

      if (orientationChanged || widthChanged || heightDelta > HEIGHT_NOISE_THRESHOLD) {
        resizeCanvas()

        init()

        lastViewport.current = { width: newWidth, height: newHeight, isPortrait: newIsPortrait }

        stableMaxScroll.current = Math.max(1, document.documentElement.scrollHeight - newHeight)
      } else {
        // Track latest height to prevent accumulation while still ignoring noise.
        lastViewport.current.height = newHeight
      }
    }

    const debouncedOnResize = debounce(onResize, 500)

    window.addEventListener('resize', debouncedOnResize)

    return () => {
      window.removeEventListener('resize', debouncedOnResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)

      if (animationFrameRef) cancelAnimationFrame(animationFrameRef)
    }
  }, [onReady])

  return (
    <canvas
      ref={canvasRef}
      style={{
        background: 'rgb(5, 5, 10)',
        height: '100lvh',
        left: 0,
        opacity: 0.55,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: -1
      }}
    />
  )
}

export default SpaceBackground
