import { useMemo } from 'react'
import { useNarrativeStore } from '@/stores/narrativeStore'
import { clamp } from '@/lib/utils'

/** Handoff flash, sweep, bloom — prologue → neon-blue ecosystem */
export function MuseumHandoffTransition() {
  const museumZone = useNarrativeStore((s) => s.museumZone)
  const handoffProgress = useNarrativeStore((s) => s.handoffProgress)

  const ecoReveal = useMemo(
    () =>
      museumZone === 'ecosystem'
        ? 1
        : clamp((handoffProgress - 0.78) / 0.22, 0, 1),
    [museumZone, handoffProgress],
  )

  const inHandoff =
    museumZone === 'prologue' && handoffProgress > 0.06 && handoffProgress < 0.94

  const showBloom = ecoReveal > 0.04

  if (!inHandoff && !showBloom) return null

  const p = handoffProgress
  const flash = inHandoff ? Math.sin(p * Math.PI) * 0.72 : 0
  const sweep = inHandoff ? Math.min(1, Math.max(0, (p - 0.12) / 0.76)) : 1
  const labelOpacity = inHandoff ? Math.sin(p * Math.PI) * 0.95 : 0

  const bloomScale = 0.35 + ecoReveal * 3.2
  const bloomOpacity =
    ecoReveal >= 0.98
      ? Math.max(0, 0.5 * (1 - (ecoReveal - 0.98) / 0.02))
      : Math.sin(Math.min(1, ecoReveal / 0.92) * Math.PI * 0.55) * 0.88

  return (
    <div className="museum-handoff" aria-hidden>
      {inHandoff && (
        <>
          <div className="museum-handoff__flash" style={{ opacity: flash }} />
          <div
            className="museum-handoff__sweep"
            style={{ transform: `scaleX(${sweep})` }}
          />
          <p className="museum-handoff__label" style={{ opacity: labelOpacity }}>
            Entering the AA ecosystem
          </p>
        </>
      )}
      {showBloom && bloomOpacity > 0.01 && (
        <div
          className="museum-handoff__bloom"
          style={{
            opacity: bloomOpacity,
            transform: `translate(-50%, -50%) scale(${bloomScale})`,
          }}
        />
      )}
    </div>
  )
}
