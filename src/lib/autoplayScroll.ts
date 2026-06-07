import { UNIFORM_VH_PER_SECOND_AT_1X } from '@/constants/scrollPacing'
import { PROLOGUE_SCROLL_VH } from '@/constants/prologue'
import { SCROLL_HEIGHT_VH } from '@/constants/timeline'
import { TOTAL_JOURNEY_VH } from '@/lib/scrollJourney'
import {
  getPrologueScrollTrigger,
  resolvePrologueScrollY,
} from '@/lib/prologueTimeline'
import { clamp } from '@/lib/utils'
import type { LenisInstance } from '@/lib/lenis'
import { ScrollTrigger } from '@/animations/registerGSAP'

export const MUSEUM_TRACK_SCROLL_TRIGGER_ID = 'museum-track'

export { UNIFORM_VH_PER_SECOND_AT_1X as AUTOPLAY_VH_PER_SECOND_AT_1X }

let autoplayDriving = false

export function isAutoplayDriving(): boolean {
  return autoplayDriving
}

export function getMuseumTrackScrollTrigger(): ScrollTrigger | undefined {
  return ScrollTrigger.getById(MUSEUM_TRACK_SCROLL_TRIGGER_ID)
}

export function resolveScrollY(progress: number): number | null {
  const st = getMuseumTrackScrollTrigger()
  if (st) {
    const p = clamp(progress, 0, 1)
    return st.start + (st.end - st.start) * p
  }

  const track = document.querySelector<HTMLElement>('[data-museum-scroll-track]')
  if (!track) return null

  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  return clamp(progress, 0, 1) * max
}

export type AutoplayZone = 'prologue' | 'ecosystem'

export function getAutoplayZone(lenis: LenisInstance | null): AutoplayZone {
  const scrollY = lenis?.scroll ?? window.scrollY
  const prologueSt = getPrologueScrollTrigger()
  const ecosystemSt = getMuseumTrackScrollTrigger()

  if (prologueSt && scrollY < prologueSt.end - 2) {
    return 'prologue'
  }

  if (ecosystemSt && scrollY >= ecosystemSt.start - 2) {
    return 'ecosystem'
  }

  if (prologueSt && scrollY < (ecosystemSt?.start ?? Infinity)) {
    return 'prologue'
  }

  return 'ecosystem'
}

export function scrollToY(y: number, lenis: LenisInstance | null, immediate = true): void {
  autoplayDriving = true

  if (lenis) {
    lenis.scrollTo(clamp(y, 0, lenis.limit), { immediate, force: true, programmatic: true })
  } else {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    window.scrollTo(0, clamp(y, 0, max))
  }

  ScrollTrigger.update()
  if (immediate) {
    requestAnimationFrame(() => {
      autoplayDriving = false
    })
  }
}

/** Smooth lenis chase for autoplay — lerp only, no duration easing restarts */
export function driveAutoplayToY(y: number, lenis: LenisInstance | null): void {
  if (!lenis) return

  autoplayDriving = true
  const target = clamp(y, 0, lenis.limit)

  lenis.scrollTo(target, {
    immediate: false,
    force: true,
    lerp: 0.14,
    duration: undefined,
    easing: undefined,
    programmatic: false,
  })

  ScrollTrigger.update()
}

export function endAutoplayDrive(): void {
  autoplayDriving = false
}

export function scrollToADYear(ad: number, lenis: LenisInstance | null): void {
  const y = resolvePrologueScrollY(ad)
  if (y === null) return
  scrollToY(y, lenis)
}

export function scrollToProgress(progress: number, lenis: LenisInstance | null): void {
  const y = resolveScrollY(progress)
  if (y === null) return
  scrollToY(y, lenis)
}

export function scrollToEnd(lenis: LenisInstance | null): void {
  scrollToProgress(1, lenis)
}

export function scrollToStart(lenis: LenisInstance | null): void {
  scrollToY(0, lenis)
}

/** Progress units per second at 1× — derived from uniform vh pacing */
export function getProgressPerSecond(_progress: number): number {
  const vhPerSec = UNIFORM_VH_PER_SECOND_AT_1X
  return vhPerSec / SCROLL_HEIGHT_VH
}

export function getPrologueProgressPerSecond(_progress: number): number {
  const vhPerSec = UNIFORM_VH_PER_SECOND_AT_1X
  return vhPerSec / PROLOGUE_SCROLL_VH
}

export function getJourneyProgressPerSecond(): number {
  return UNIFORM_VH_PER_SECOND_AT_1X / TOTAL_JOURNEY_VH
}
