'use client'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { debounce } from '@/lib/debounce'
import { throttle } from '@/lib/throttle'
import { useEffect, useRef } from 'react'
import { CONFIG } from './config'
import { generateNebulae, generateStars } from './generator'
import { drawBackground, drawNebulaeToContext, drawStarsToContext } from './renderer'
import type { SpaceAnimationState, ViewportSnapshot } from './types'

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

    // Functions

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

    const init = () => {
      const { width, height } = canvas

      animationState.current.stars = generateStars(width, height)
      animationState.current.nebulae = generateNebulae(width, height)
      animationState.current.backgroundRotation = 0
    }

    const onMouseMove = (event: MouseEvent) => {
      if (animationState.current.prefersReducedMotion) return

      animationState.current.targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2
      animationState.current.targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const onResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
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

    const onScroll = () => {
      if (animationState.current.prefersReducedMotion) return

      const maxScroll = stableMaxScroll.current

      animationState.current.targetScrollY = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initialization

    resizeCanvas()

    init()

    // Seed last viewport after first init.
    lastViewport.current = {
      height: window.innerHeight,
      isPortrait: window.innerHeight >= window.innerWidth,
      width: window.innerWidth
    }

    stableMaxScroll.current = Math.max(1, document.documentElement.scrollHeight - lastViewport.current.height)

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const throttledOnMouseMove = throttle(onMouseMove, 16)

    window.addEventListener('mousemove', throttledOnMouseMove)
    window.addEventListener('scroll', onScroll)

    draw()

    onReady?.()

    const debouncedOnResize = debounce(onResize, CONFIG.performance.debounceResize)

    window.addEventListener('resize', debouncedOnResize)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      window.removeEventListener('mousemove', throttledOnMouseMove)
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
