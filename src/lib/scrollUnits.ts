import { getViewportHeight } from '@/lib/scrollJourney'

export function vhToPixels(vh: number, viewportHeight = getViewportHeight()): number {
  return (vh / 100) * viewportHeight
}

export function pixelsToVh(pixels: number, viewportHeight = getViewportHeight()): number {
  if (viewportHeight <= 0) return 0
  return (pixels / viewportHeight) * 100
}
