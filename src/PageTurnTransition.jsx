import React, { useEffect, useRef } from 'react'

/**
 * PageTurnTransition — canvas page-curl, fully opaque throughout
 *
 * Strategy (no flash):
 *  1. Canvas is ALWAYS opaque during animation — no destination-out transparency.
 *     "Turned" region = slightly different dark shade; "unturned" = main dark.
 *  2. Fold endpoints use a two-phase parameterisation so the curl covers the
 *     ENTIRE screen (not just half) by the time the animation finishes.
 *  3. After the curl, canvas CSS-fades to opacity:0 over 250 ms, THEN calls
 *     onComplete. The detail page (initial opacity:1) is mounted at that moment,
 *     already fully opaque. No flash of the underlying portfolio page ever.
 */
export default function PageTurnTransition({ isAnimating, onComplete }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  useEffect(() => {
    if (!isAnimating) return

    const canvas = canvasRef.current
    if (!canvas) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width  = W
    canvas.height = H
    // Reset any previous CSS fade
    canvas.style.transition = ''
    canvas.style.opacity    = '1'

    const ctx = canvas.getContext('2d')

    const DURATION = 820   // animation ms
    let startTime  = null
    let completed  = false

    // ── easing ─────────────────────────────────────────────────────────
    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    /**
     * Fold-line endpoints covering the FULL screen:
     *   t = 0   → degenerate point at BR (0 px of page turned)
     *   t = 0.5 → fold goes BL→TR  (exactly the full diagonal)
     *   t = 1   → degenerate point at TL (entire page turned)
     *
     * Phase 1 (t ∈ [0, 0.5]): endpoints slide along bottom & right edges
     * Phase 2 (t ∈ [0.5, 1]): endpoints slide along left & top edges
     */
    function getFoldPts(t) {
      if (t <= 0.5) {
        const p = t / 0.5
        return [
          [W * (1 - p), H],   // bottom edge: x  W → 0
          [W,  H * (1 - p)],  // right edge:  y  H → 0
        ]
      }
      const p = (t - 0.5) / 0.5
      return [
        [0,  H * (1 - p)],   // left edge:   y  H → 0
        [W * (1 - p), 0],    // top edge:    x  W → 0
      ]
    }

    // ── main draw loop ──────────────────────────────────────────────────
    function frame(ts) {
      if (completed) return
      if (!startTime) startTime = ts

      const raw = Math.min((ts - startTime) / DURATION, 1)
      const t   = ease(raw)

      ctx.clearRect(0, 0, W, H)

      // ── 1. Base fill: "back of page" colour (turned region) ───────────
      ctx.fillStyle = '#0d0d12'
      ctx.fillRect(0, 0, W, H)

      const [[p1x, p1y], [p2x, p2y]] = getFoldPts(t)

      // ── Bézier control point (concave — bows toward BR) ───────────────
      const midX = (p1x + p2x) / 2
      const midY = (p1y + p2y) / 2
      const fDx  = p2x - p1x
      const fDy  = p2y - p1y
      const fLen = Math.hypot(fDx, fDy)

      // CCW perpendicular → points toward BR → concave fold
      const perpX = -fDy / (fLen || 1)
      const perpY =  fDx / (fLen || 1)
      const curveAmt = fLen * 0.22 * Math.sin(Math.PI * t)
      const ctrlX    = midX + perpX * curveAmt
      const ctrlY    = midY + perpY * curveAmt

      // ── 2. Draw the UNTURNED region (page front, pure dark) ───────────
      ctx.save()
      ctx.beginPath()
      if (t <= 0.5) {
        // Polygon: TL → TR → p2 → [curve] → p1 → BL → TL
        ctx.moveTo(0, 0)
        ctx.lineTo(W, 0)
        ctx.lineTo(p2x, p2y)
        ctx.quadraticCurveTo(ctrlX, ctrlY, p1x, p1y)
        ctx.lineTo(0, H)
        ctx.closePath()
      } else {
        // Shrinking triangle: TL → p2 → [curve] → p1 → TL
        ctx.moveTo(0, 0)
        ctx.lineTo(p2x, p2y)
        ctx.quadraticCurveTo(ctrlX, ctrlY, p1x, p1y)
        ctx.closePath()
      }
      ctx.fillStyle = '#080808'
      ctx.fill()
      ctx.restore()

      // ── 3. Shadow gradient on the unturned side of the fold ───────────
      if (fLen > 2) {
        const shadowLen = Math.min(fLen * 0.14, 80)
        const sgx0 = midX + perpX * 2, sgy0 = midY + perpY * 2
        const sgx1 = midX + perpX * shadowLen, sgy1 = midY + perpY * shadowLen

        if (isFinite(sgx0) && isFinite(sgx1) &&
            Math.hypot(sgx1 - sgx0, sgy1 - sgy0) > 0.5) {
          const sg = ctx.createLinearGradient(sgx0, sgy0, sgx1, sgy1)
          sg.addColorStop(0, 'rgba(0,0,0,0.55)')
          sg.addColorStop(1, 'rgba(0,0,0,0)')

          ctx.save()
          ctx.globalCompositeOperation = 'source-atop'
          ctx.fillStyle = sg
          ctx.fillRect(0, 0, W, H)
          ctx.restore()
        }

        // ── 4. Wide dark crease shadow ──────────────────────────────────
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(p1x, p1y)
        ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y)
        ctx.strokeStyle = 'rgba(0,0,0,0.78)'
        ctx.lineWidth   = 28
        ctx.lineCap     = 'round'
        ctx.stroke()

        ctx.strokeStyle = 'rgba(0,0,0,0.45)'
        ctx.lineWidth   = 14
        ctx.stroke()
        ctx.restore()

        // ── 5. Bright paper-edge highlight ─────────────────────────────
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(p1x, p1y)
        ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y)
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth   = 2.5
        ctx.lineCap     = 'round'
        ctx.stroke()
        ctx.restore()

        // ── 6. Orange glow (black & orange branding) ────────────────────
        if (t > 0.03 && t < 0.97) {
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(p1x, p1y)
          ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y)
          // inner orange core
          ctx.strokeStyle = 'rgba(255,107,43,0.58)'
          ctx.lineWidth   = 8
          ctx.lineCap     = 'round'
          ctx.stroke()
          // mid bloom
          ctx.strokeStyle = 'rgba(255,107,43,0.18)'
          ctx.lineWidth   = 26
          ctx.stroke()
          // outer warm halo
          ctx.strokeStyle = 'rgba(255,160,43,0.07)'
          ctx.lineWidth   = 50
          ctx.stroke()
          ctx.restore()
        }
      }

      // ── Animation finished? ────────────────────────────────────────────
      if (raw >= 1) {
        if (!completed) {
          completed = true

          // Fill solid black — the entire canvas is "turned"
          ctx.fillStyle = '#080808'
          ctx.fillRect(0, 0, W, H)

          // CSS fade-out FIRST, then notify parent
          // (detail page will mount at opacity:1 when onComplete fires,
          //  canvas is already invisible at that point → zero flash)
          canvas.style.transition = 'opacity 0.25s ease-out'
          canvas.style.opacity    = '0'
          setTimeout(() => onComplete?.(), 270)
        }
        return   // no more rAF
      }

      animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animRef.current)
  }, [isAnimating, onComplete])

  if (!isAnimating) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        200,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  )
}
