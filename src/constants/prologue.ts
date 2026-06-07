/** Prologue scroll = AD calendar years (pre-AA era) */
export const PROLOGUE_AD_MIN = 1936
export const PROLOGUE_AD_MAX = 2017
export const PROLOGUE_AD_SPAN = PROLOGUE_AD_MAX - PROLOGUE_AD_MIN

/** Uniform vh per intro event beat */
export const PROLOGUE_BEAT_VH = 12

/** Total intro events across all chapters — keep in sync with introTimeline */
export const PROLOGUE_EVENT_COUNT = 12

export const PROLOGUE_SCROLL_VH = PROLOGUE_EVENT_COUNT * PROLOGUE_BEAT_VH

/** ~10vh scroll per wheel notch — see scrollPacing.ts (uniform all zones) */
export const WHEEL_PROLOGUE_PROGRESS_PER_NOTCH = 10 / PROLOGUE_SCROLL_VH

/** @deprecated Use UNIFORM_VH_PER_SECOND_AT_1X in scrollPacing.ts */
export const AUTOPLAY_PROLOGUE_PROGRESS_PER_SECOND = 3 / 114

/** Legacy alias — year wheel in ecosystem only */
export const AUTOPLAY_AD_YEARS_PER_SECOND = 0.5

export const PROLOGUE_EPOCH = {
  min: PROLOGUE_AD_MIN,
  max: PROLOGUE_AD_MAX,
  span: PROLOGUE_AD_SPAN,
} as const
