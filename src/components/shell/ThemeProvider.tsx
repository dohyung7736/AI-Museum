import { useEffect } from 'react'
import { useNarrativeStore } from '@/stores/narrativeStore'
import { useThemeStore } from '@/stores/themeStore'
import { clamp } from '@/lib/utils'

/** Sync display theme + museum zone + ecosystem reveal blend to documentElement */
export function ThemeProvider() {
  const displayTheme = useThemeStore((s) => s.displayTheme)
  const museumZone = useNarrativeStore((s) => s.museumZone)
  const handoffProgress = useNarrativeStore((s) => s.handoffProgress)

  const ecoReveal =
    museumZone === 'ecosystem'
      ? 1
      : clamp((handoffProgress - 0.78) / 0.22, 0, 1)

  const ecoRevealing = ecoReveal > 0.02 && ecoReveal < 0.98

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-display-theme', displayTheme)
    root.setAttribute('data-museum-zone', museumZone)
    root.style.setProperty('--eco-reveal', String(ecoReveal))

    if (ecoRevealing) {
      root.setAttribute('data-eco-revealing', 'true')
    } else {
      root.removeAttribute('data-eco-revealing')
    }
  }, [displayTheme, museumZone, ecoReveal, ecoRevealing])

  return null
}
