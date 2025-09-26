export const CONFIG = {
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
