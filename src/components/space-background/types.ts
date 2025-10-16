export interface Nebula {
  baseHue: number
  canvas: HTMLCanvasElement
  distanceFactor: number
  size: number
  x: number
  y: number
}

export interface SpaceAnimationState {
  backgroundRotation: number
  isAnimationDisabled: boolean
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

export interface Star {
  brightness: number
  color: string
  distanceFactor: number
  isFast: boolean
  phase: number
  size: number
  x: number
  y: number
}

export interface ViewportSnapshot {
  height: number
  isPortrait: boolean
  width: number
}
