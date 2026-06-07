import { ScrollTrigger, registerGSAP } from '@/animations/registerGSAP'
import { PROLOGUE_TRACK_SCROLL_TRIGGER_ID } from '@/lib/prologueTimeline'
import { useNarrativeStore } from '@/stores/narrativeStore'
import { useEffect, useRef } from 'react'

export function initPrologueTimeline(container: HTMLElement) {
  registerGSAP()

  const setPrologueProgress = useNarrativeStore.getState().setPrologueProgress

  const trigger = ScrollTrigger.create({
    id: PROLOGUE_TRACK_SCROLL_TRIGGER_ID,
    trigger: container,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.12,
    onUpdate: (self) => {
      setPrologueProgress(self.progress)
    },
  })

  return () => trigger.kill()
}

export function usePrologueTrackRef() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const cleanup = initPrologueTimeline(ref.current)
    const refresh = () => ScrollTrigger.refresh()
    refresh()
    window.addEventListener('resize', refresh)
    return () => {
      window.removeEventListener('resize', refresh)
      cleanup()
    }
  }, [])

  return ref
}
