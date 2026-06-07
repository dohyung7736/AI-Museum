import {
  MAX_VH_PER_SECOND,
  UNIFORM_VH_PER_WHEEL_NOTCH,
} from '@/constants/scrollPacing'
import type { LenisInstance } from '@/lib/lenis'
import { vhToPixels } from '@/lib/scrollUnits'
import { clamp } from '@/lib/utils'

const wheelBudget = {
  lastTime: 0,
  remainingVh: MAX_VH_PER_SECOND,
}

function wheelDeltaToNotch(deltaY: number): number {
  const sign = Math.sign(deltaY)
  if (sign === 0) return 0
  const abs = Math.abs(deltaY)
  if (abs >= 48) return sign
  return sign * clamp(abs / 48, 0.08, 1)
}

function consumeVhBudget(vh: number, now: number): number {
  const dt = wheelBudget.lastTime ? Math.min((now - wheelBudget.lastTime) / 1000, 0.05) : 0.016
  wheelBudget.lastTime = now
  wheelBudget.remainingVh = Math.min(
    MAX_VH_PER_SECOND,
    wheelBudget.remainingVh + MAX_VH_PER_SECOND * dt,
  )

  const allowed = Math.min(Math.abs(vh), wheelBudget.remainingVh)
  wheelBudget.remainingVh -= allowed
  return Math.sign(vh) * allowed
}

/** Convert wheel delta to document scroll delta — uniform vh in every zone */
export function resolveWheelScrollDelta(
  deltaY: number,
  _lenis: LenisInstance | null,
): number {
  const notch = wheelDeltaToNotch(deltaY)
  const rawVh = notch * UNIFORM_VH_PER_WHEEL_NOTCH
  const vh = consumeVhBudget(rawVh, performance.now())
  return vhToPixels(vh)
}

/** Cap autoplay vh rate at max speed multiplier */
export function capAutoplayVhPerSecond(baseVhPerSecond: number, speedMultiplier: number): number {
  return Math.min(baseVhPerSecond * speedMultiplier, MAX_VH_PER_SECOND)
}
