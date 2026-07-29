import React, { useEffect, useState } from 'react'

/**
 * PageTurnTransition
 * 
 * Renders the "turning a page" animation that originates from the
 * bottom-right corner and sweeps to the top-left, revealing the
 * content underneath.
 * 
 * Props:
 *   isAnimating  — boolean, starts the animation when true
 *   onComplete   — callback fired when the flip finishes
 *   accentColor  — project's accent color for the page edge glow
 */
export default function PageTurnTransition({ isAnimating, onComplete, accentColor = '#00ff88' }) {
  const [phase, setPhase] = useState('idle') // idle | peeling | flipping | done

  useEffect(() => {
    if (!isAnimating) {
      setPhase('idle')
      return
    }

    // Phase 1: small peel from bottom-right corner
    setPhase('peeling')

    const t1 = setTimeout(() => {
      // Phase 2: full page sweep
      setPhase('flipping')
    }, 80)

    const t2 = setTimeout(() => {
      // Phase 3: done — notify parent
      setPhase('done')
      onComplete?.()
    }, 720)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isAnimating])

  if (phase === 'idle' || phase === 'done') return null

  return (
    <div className="page-turn-overlay" aria-hidden="true">
      {/* The "page" that flips — a solid panel that starts at bottom-right */}
      <div
        className={`page-turn-panel page-turn-panel--${phase}`}
        style={{
          '--accent': accentColor,
        }}
      >
        {/* Subtle diagonal gradient giving the page a lit edge effect */}
        <div className="page-turn-sheen" />

        {/* Right-edge glow (the "spine" of the turning page) */}
        <div className="page-turn-edge" style={{ background: `linear-gradient(to left, ${accentColor}55, transparent)` }} />
      </div>

      {/* Shadow that sweeps in from the right as the page lifts */}
      <div className={`page-turn-shadow page-turn-shadow--${phase}`} />
    </div>
  )
}
