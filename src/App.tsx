import { registerGSAP } from '@/animations/registerGSAP'
import { ScrollTrigger } from '@/animations/registerGSAP'
import { NarrativeProvider } from '@/app/providers/NarrativeProvider'
import { SmoothScrollProvider, useLenis } from '@/app/providers/SmoothScrollProvider'
import { AudioProvider } from '@/app/providers/AudioProvider'
import { BackgroundScene } from '@/components/canvas/BackgroundScene'
import { LaneParticleScene } from '@/components/canvas/LaneParticleScene'
import { Scanlines } from '@/components/effects/Scanlines'
import { MuseumShell } from '@/components/shell/MuseumShell'
import { MuseumAutoplayDock } from '@/components/shell/MuseumAutoplayDock'
import { ThemeProvider } from '@/components/shell/ThemeProvider'
import { MuseumLoading } from '@/components/layout/MuseumLoading'
import { MachineModeStyles } from '@/components/layout/MachineModeStyles'
import { PanelDetailDrawer } from '@/components/narrative/PanelDetailDrawer'
import { IntroHeroSection } from '@/components/sections/IntroHeroSection'
import { MuseumTitleGateSection } from '@/components/sections/MuseumTitleGateSection'
import { ScrollContainer } from '@/components/layout/ScrollContainer'
import { PrologueScrollTrack } from '@/components/scroll/PrologueScrollTrack'
import { MuseumScrollTrack } from '@/components/scroll/MuseumScrollTrack'
import { SpecimenOcean } from '@/components/specimens/SpecimenOcean'
import { useMousePosition } from '@/hooks/useMousePosition'
import { resolveWheelScrollDelta } from '@/lib/yearWheelScroll'
import { syncNarrativeFromScroll } from '@/lib/syncNarrativeFromScroll'
import { useEffect, useState } from 'react'

function GlobalWheelScrollDampener() {
  const lenis = useLenis()

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('[data-lenis-prevent]')) return

      event.preventDefault()

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const delta = resolveWheelScrollDelta(event.deltaY, lenis)

      if (lenis) {
        const next = Math.max(0, Math.min(lenis.scroll + delta, maxScroll))
        lenis.scrollTo(next, { programmatic: false })
        syncNarrativeFromScroll(lenis, next)
      } else {
        const next = Math.max(0, Math.min(window.scrollY + delta, maxScroll))
        window.scrollTo({ top: next, behavior: 'auto' })
        syncNarrativeFromScroll(null, next)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [lenis])

  return null
}

function MuseumExperience() {
  useMousePosition()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    registerGSAP()
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    fontsReady.then(() => {
      setReady(true)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
  }, [])

  if (!ready) {
    return <MuseumLoading />
  }

  return (
    <>
      <ThemeProvider />
      <MachineModeStyles />

      <div className="layer-effects fixed inset-0 z-[5] pointer-events-none opacity-40" aria-hidden>
        <Scanlines />
      </div>

      <PanelDetailDrawer />

      <MuseumShell
        background={<BackgroundScene />}
        particles={<LaneParticleScene />}
        specimens={<SpecimenOcean />}
        autoplay={<MuseumAutoplayDock />}
      >
        <div className="museum-scroll-ghost" aria-hidden>
          <IntroHeroSection />
          <PrologueScrollTrack />
          <MuseumTitleGateSection />
          <ScrollContainer id="ecosystem-scroll-root">
            <MuseumScrollTrack />
          </ScrollContainer>
        </div>
        <div className="museum-scroll-spacer" aria-hidden />
      </MuseumShell>
    </>
  )
}

export default function App() {
  return (
    <NarrativeProvider>
      <SmoothScrollProvider>
        <GlobalWheelScrollDampener />
        <AudioProvider>
          <MuseumExperience />
        </AudioProvider>
      </SmoothScrollProvider>
    </NarrativeProvider>
  )
}
