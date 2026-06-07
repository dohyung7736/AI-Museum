/** Shared timeline constants — no circular imports */
export const ECOSYSTEM_AA_MAX = 100
export const MACHINE_AA_SPAN = 20
export const AA_ANCHOR_AD = 2022

export const VH_PER_AA_YEAR = 10
export const ECOSYSTEM_SCROLL_VH = ECOSYSTEM_AA_MAX * VH_PER_AA_YEAR

/** Fixed in-flow terminal height — access-denied reveal zone */
export const TERMINAL_SECTION_VH = 90

/** Museum ends at terminal floor — no tail scroll beyond */
export const MACHINE_TAIL_VH = 0

export const SCROLL_HEIGHT_VH = ECOSYSTEM_SCROLL_VH + TERMINAL_SECTION_VH

/** @deprecated */
export const TERMINAL_BUFFER_VH = 0

/** @deprecated alias */
export const TERMINAL_FOOTER_VH = TERMINAL_SECTION_VH

export const ECOSYSTEM_ZONE_END = ECOSYSTEM_SCROLL_VH / SCROLL_HEIGHT_VH
export const TERMINAL_ZONE_START = ECOSYSTEM_ZONE_END
export const BUFFER_ZONE_START = ECOSYSTEM_ZONE_END
export const BUFFER_ZONE_END = TERMINAL_ZONE_START
export const MACHINE_ZONE_START = TERMINAL_ZONE_START
export const MACHINE_HANDOFF_START = ECOSYSTEM_ZONE_END * 0.92

/** @deprecated Use UNIFORM_VH_PER_SECOND_AT_1X in scrollPacing.ts */
export const AUTOPLAY_AA_YEARS_PER_SECOND = 0.875

export const AA_EPOCH = {
  min: 0,
  max: ECOSYSTEM_AA_MAX + MACHINE_AA_SPAN,
  ecosystemMax: ECOSYSTEM_AA_MAX,
  anchorAD: AA_ANCHOR_AD,
  span: ECOSYSTEM_AA_MAX + MACHINE_AA_SPAN,
} as const
