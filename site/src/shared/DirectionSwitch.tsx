import { publicUrl } from './media'

const DIRS = [
  { id: 'a', label: 'A', name: 'Hi-Vis' },
  { id: 'b', label: 'B', name: 'Clean Slate' },
  { id: 'c', label: 'C', name: 'Truck Side' },
] as const

/**
 * Small floating pill for the review stage: jump between the three directions.
 * Neutral styling on purpose so it never competes with a direction's design.
 * Remove before launch.
 */
export function DirectionSwitch({ current }: { current: 'a' | 'b' | 'c' }) {
  const keep = location.search
  return (
    <nav
      aria-label="Design directions"
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        zIndex: 90,
        display: 'flex',
        gap: 4,
        padding: 4,
        borderRadius: 999,
        background: 'rgba(20,20,20,.86)',
        boxShadow: '0 8px 30px rgba(0,0,0,.3)',
        font: '600 12px/1 system-ui, sans-serif',
      }}
    >
      {DIRS.map((d) => (
        <a
          key={d.id}
          href={publicUrl(`${d.id}/${keep}`)}
          title={`Direction ${d.label}: ${d.name}`}
          aria-current={d.id === current ? 'page' : undefined}
          style={{
            padding: '8px 11px',
            borderRadius: 999,
            color: d.id === current ? '#111' : '#bbb',
            background: d.id === current ? '#fff' : 'transparent',
            textDecoration: 'none',
          }}
        >
          {d.label}
        </a>
      ))}
    </nav>
  )
}
