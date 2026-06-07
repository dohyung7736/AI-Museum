import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/animations/registerGSAP'
import { useLenis } from '@/app/providers/SmoothScrollProvider'
import { UNIFORM_VH_PER_SECOND_AT_1X } from '@/constants/scrollPacing'
import {
  driveAutoplayToY,
  endAutoplayDrive,
  isAutoplayDriving,
} from '@/lib/autoplayScroll'
import { capAutoplayVhPerSecond } from '@/lib/yearWheelScroll'
import { syncNarrativeFromScroll } from '@/lib/syncNarrativeFromScroll'
import { vhToPixels } from '@/lib/scrollUnits'

interface UseMuseumAutoplayOptions {
  playing: boolean
  speed: number
  onStop: () => void
}

/** Autoplay — constant document vh/s through every scroll section */
export function useMuseumAutoplay({ playing, speed, onStop }: UseMuseumAutoplayOptions) {
  const lenis = useLenis()
  const playingRef = useRef(playing)
  const speedRef = useRef(speed)
  const onStopRef = useRef(onStop)
  const lenisRef = useRef(lenis)

  playingRef.current = playing
  speedRef.current = speed
  onStopRef.current = onStop
  lenisRef.current = lenis

  useEffect(() => {
    if (!playing) {
      endAutoplayDrive()
      return
    }

    ScrollTrigger.refresh()

    let rafId = 0
    let lastTime = performance.now()

    const frame = (now: number) => {
      if (!playingRef.current) return

      const dt = Math.min((now - lastTime) / 1000, 0.032)
      lastTime = now
      const lenis = lenisRef.current

      const maxScroll = Math.max(
        0,
        lenis?.limit ??
          document.documentElement.scrollHeight - window.innerHeight,
      )
      const currentY = lenis?.scroll ?? window.scrollY

      if (currentY >= maxScroll - 1) {
        syncNarrativeFromScroll(lenis)
        endAutoplayDrive()
        onStopRef.current()
        return
      }

      const vhPerSecond = capAutoplayVhPerSecond(UNIFORM_VH_PER_SECOND_AT_1X, speedRef.current)
      const deltaPx = vhToPixels(vhPerSecond * dt)
      const nextY = Math.min(currentY + deltaPx, maxScroll)

      driveAutoplayToY(nextY, lenis)
      syncNarrativeFromScroll(lenis)

      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      endAutoplayDrive()
    }
  }, [playing])

  useEffect(() => {
    if (!playing) return

    const stopOnWheel = (e: WheelEvent) => {
      if (!playingRef.current || isAutoplayDriving()) return
      if (e.deltaY === 0 && e.deltaX === 0) return
      onStopRef.current()
    }

    const stopOnTouch = () => {
      if (!playingRef.current || isAutoplayDriving()) return
      onStopRef.current()
    }

    window.addEventListener('wheel', stopOnWheel, { passive: true })
    window.addEventListener('touchmove', stopOnTouch, { passive: true })

    return () => {
      window.removeEventListener('wheel', stopOnWheel)
      window.removeEventListener('touchmove', stopOnTouch)
    }
  }, [playing])
}
