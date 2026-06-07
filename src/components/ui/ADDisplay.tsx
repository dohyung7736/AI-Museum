import { RollingNumber } from '@/components/ui/RollingNumber'
import { cn } from '@/lib/utils'

interface ADDisplayProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'plain' | 'hud'
}

const sizeClass = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
} as const

/** Calendar year counter — plain styling for prologue */
export function ADDisplay({
  value,
  size = 'md',
  className,
  variant = 'plain',
}: ADDisplayProps) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-1.5 tabular-nums',
        sizeClass[size],
        variant === 'plain'
          ? 'font-mono text-[var(--year-display-text)]'
          : 'text-aa-counter',
        className,
      )}
    >
      <span
        className={cn(
          'text-[10px] tracking-[0.14em] uppercase',
          variant === 'plain'
            ? 'text-[var(--year-display-prefix)]'
            : 'text-aa-prefix',
        )}
      >
        AD
      </span>
      <RollingNumber value={Math.round(value)} />
    </span>
  )
}
