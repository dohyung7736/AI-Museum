/**
 * Uniform museum scroll — wheel and autoplay move the same vh everywhere
 * (hero, prologue, title gate, ecosystem, terminal).
 */

/** One mouse wheel notch ≈ this many viewport-heights of document scroll */
export const UNIFORM_VH_PER_WHEEL_NOTCH = 35

/** Autoplay at 1× — document vh per second (all zones) */
export const UNIFORM_VH_PER_SECOND_AT_1X = 20

/** Burst cap for wheel + autoplay at max speed multiplier */
export const MAX_VH_PER_SECOND = UNIFORM_VH_PER_SECOND_AT_1X * 5
