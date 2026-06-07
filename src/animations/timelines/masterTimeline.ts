import { ScrollTrigger, registerGSAP } from '@/animations/registerGSAP'
import { MUSEUM_TRACK_SCROLL_TRIGGER_ID } from '@/lib/autoplayScroll'
import { useNarrativeStore } from '@/stores/narrativeStore'
import { useEffect, useRef } from 'react'

/** Single continuous scroll driver — AA year is derived from progress linearly */
export function initMasterTimeline(container: HTMLElement) {
  registerGSAP()

  const setScrollProgress = useNarrativeStore.getState().setScrollProgress
  const triggers: ScrollTrigger[] = []

  triggers.push(
    ScrollTrigger.create({
      id: MUSEUM_TRACK_SCROLL_TRIGGER_ID,
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.12,
      onUpdate: (self) => {
        setScrollProgress(self.progress)
      },
    }),
  )

  return () => triggers.forEach((st) => st.kill())
}

export function useScrollTrackRef() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const cleanup = initMasterTimeline(ref.current)
    const refresh = () => ScrollTrigger.refresh()
    refresh()
    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
      cleanup()
    }
  }, [])

  return ref
}
