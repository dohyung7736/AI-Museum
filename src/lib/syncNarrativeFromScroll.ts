import { ScrollTrigger } from '@/animations/registerGSAP'
import { getMuseumTrackScrollTrigger } from '@/lib/autoplayScroll'
import type { LenisInstance } from '@/lib/lenis'
import { getPrologueScrollTrigger } from '@/lib/prologueTimeline'
import { getTitleGateScrollTrigger } from '@/lib/titleGateHandoff'
import { clamp } from '@/lib/utils'
import { useNarrativeStore } from '@/stores/narrativeStore'

function getTriggerProgress(st: ScrollTrigger | undefined, scrollY: number): number {
  if (!st) return 0
  const range = st.end - st.start
  if (range <= 0) return 0
  return clamp((scrollY - st.start) / range, 0, 1)
}

/** Mirror scroll position into the narrative store */
export function syncNarrativeFromScroll(
  lenis: LenisInstance | null,
  scrollYOverride?: number,
): void {
  ScrollTrigger.update()

  const scrollY = scrollYOverride ?? lenis?.scroll ?? window.scrollY
  const prologueSt = getPrologueScrollTrigger()
  const ecosystemSt = getMuseumTrackScrollTrigger()
  const gateSt = getTitleGateScrollTrigger()
  const store = useNarrativeStore.getState()

  if (
    ecosystemSt &&
    scrollY >= ecosystemSt.start &&
    scrollY <= ecosystemSt.end + 2
  ) {
    store.syncEcosystemAutoplay(getTriggerProgress(ecosystemSt, scrollY))
    return
  }

  if (
    gateSt &&
    prologueSt &&
    scrollY > prologueSt.end &&
    scrollY < (ecosystemSt?.start ?? Infinity)
  ) {
    store.setHandoffProgress(getTriggerProgress(gateSt, scrollY))
    store.syncPrologueAutoplay(1)
    return
  }

  if (
    prologueSt &&
    scrollY >= prologueSt.start &&
    scrollY <= prologueSt.end + 2
  ) {
    store.syncPrologueAutoplay(getTriggerProgress(prologueSt, scrollY))
    return
  }

  if (prologueSt && scrollY < prologueSt.start) {
    const heroT = prologueSt.start > 0 ? clamp(scrollY / prologueSt.start, 0, 1) : 0
    store.setPrologueProgress(heroT * 0.04)
    return
  }

  store.setPrologueProgress(0)
}
