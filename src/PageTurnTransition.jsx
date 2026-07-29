import React, { useEffect, useRef } from 'react'

/**
 * PageTurnTransition — realistic canvas page-curl
 *
 * The bottom-right corner of the page peels upward and sweeps
 * diagonally toward top-left. The fold line is a quadratic Bézier
 * curve that bows toward the unturned region, mimicking how paper
 * flexes around a cylindrical bend. A shadow is cast on the
 * unturned side and a bright highlight marks the paper edge.
 */
export default function PageTurnTransition({ isAnimating, onComplete, accentColor = '#00ff88' }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  useEffect(() => {
    if (!isAnimating) {
      cancelAnimationFrame(animRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width  = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    const DURATION = 820   // ms total
    let   startTime = null
    let   done      = false

    // ── easing ─────────────────────────────────────────────────────────
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    // ── build the "turned" region path ──────────────────────────────────
    //  fB = point on bottom edge (moving left)
    //  fR = point on right edge  (moving up)
    //  The fold line from fB→fR is a quadratic Bézier curving toward TL
    function buildTurnedPath(ctx, fBx, fBy, fRx, fRy, ctrlX, ctrlY) {
      ctx.beginPath()
      ctx.moveTo(fBx, fBy)
      ctx.lineTo(W, H)                               // bottom-right corner
      ctx.lineTo(fRx, fRy)
      ctx.quadraticCurveTo(ctrlX, ctrlY, fBx, fBy)  // curved fold back
      ctx.closePath()
    }

    // ── main draw loop ──────────────────────────────────────────────────
    function frame(ts) {
      if (done) return
      if (startTime === null) startTime = ts

      const raw = Math.min((ts - startTime) / DURATION, 1)
      const t   = easeInOutCubic(raw)

      ctx.clearRect(0, 0, W, H)

      // ── fold endpoints ────────────────────────────────────────────────
      // fB moves from (W, H) → (0, H) along the bottom edge
      // fR moves from (W, H) → (W, 0) along the right edge
      const fBx = W * (1 - t)
      const fBy = H
      const fRx = W
      const fRy = H * (1 - t)

      // ── fold line direction & perpendicular ───────────────────────────
      const fldx   = fRx - fBx          //  W*t
      const fldy   = fRy - fBy          // -H*t
      const fldLen = Math.hypot(fldx, fldy)

      // guard: nothing to draw yet (t ≈ 0)
      if (fldLen < 1) {
        ctx.fillStyle = '#080808'
        ctx.fillRect(0, 0, W, H)
        if (raw >= 1) { done = true; onComplete?.(); return }
        animRef.current = requestAnimationFrame(frame)
        return
      }

      // 90° clockwise perpendicular → points toward TL (unturned region)
      const perpX = fldy / fldLen       // negative
      const perpY = -fldx / fldLen      // negative

      // ── Bézier control point ──────────────────────────────────────────
      // Peaks mid-animation using sin(π·t), gives paper-flex curvature
      const midX     = (fBx + fRx) / 2
      const midY     = (fBy + fRy) / 2
      const curveAmt = fldLen * 0.22 * Math.sin(Math.PI * t)
      const ctrlX    = midX + perpX * curveAmt
      const ctrlY    = midY + perpY * curveAmt

      // ══════════════════════════════════════════════════════════════════
      // 1. Fill the entire canvas dark → covers the main portfolio page
      // ══════════════════════════════════════════════════════════════════
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, W, H)

      // ══════════════════════════════════════════════════════════════════
      // 2. Clear the "turned" triangle → reveals the detail page below
      // ══════════════════════════════════════════════════════════════════
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      buildTurnedPath(ctx, fBx, fBy, fRx, fRy, ctrlX, ctrlY)
      ctx.fill()
      ctx.restore()

      // ══════════════════════════════════════════════════════════════════
      // 3. Shadow gradient on the unturned (dark) side of the fold
      //    source-atop → only paints over existing opaque dark pixels
      // ══════════════════════════════════════════════════════════════════
      const shadowLen = Math.min(fldLen * 0.18, 90)
      const sgx0 = midX,                     sgy0 = midY
      const sgx1 = midX + perpX * shadowLen, sgy1 = midY + perpY * shadowLen

      // Only draw gradient if coordinates are finite
      if (isFinite(sgx0) && isFinite(sgy0) && isFinite(sgx1) && isFinite(sgy1) &&
          (Math.abs(sgx1 - sgx0) > 0.1 || Math.abs(sgy1 - sgy0) > 0.1)) {
        const shadowGrad = ctx.createLinearGradient(sgx0, sgy0, sgx1, sgy1)
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.65)')
        shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)')
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.save()
        ctx.globalCompositeOperation = 'source-atop'
        ctx.fillStyle = shadowGrad
        ctx.fillRect(0, 0, W, H)
        ctx.restore()
      }

      // ══════════════════════════════════════════════════════════════════
      // 4. Wide dark stroke = depth/shadow cast at the fold crease
      // ══════════════════════════════════════════════════════════════════
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      ctx.moveTo(fBx, fBy)
      ctx.quadraticCurveTo(ctrlX, ctrlY, fRx, fRy)
      ctx.strokeStyle = 'rgba(0,0,0,0.72)'
      ctx.lineWidth   = 28
      ctx.lineCap     = 'round'
      ctx.stroke()
      ctx.restore()

      // ══════════════════════════════════════════════════════════════════
      // 5. Medium dark stroke = softer edge of shadow
      // ══════════════════════════════════════════════════════════════════
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(fBx, fBy)
      ctx.quadraticCurveTo(ctrlX, ctrlY, fRx, fRy)
      ctx.strokeStyle = 'rgba(0,0,0,0.45)'
      ctx.lineWidth   = 14
      ctx.lineCap     = 'round'
      ctx.stroke()
      ctx.restore()

      // ══════════════════════════════════════════════════════════════════
      // 6. Thin white highlight = the lit paper edge (the "spine")
      // ══════════════════════════════════════════════════════════════════
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(fBx, fBy)
      ctx.quadraticCurveTo(ctrlX, ctrlY, fRx, fRy)
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'
      ctx.lineWidth   = 2.5
      ctx.lineCap     = 'round'
      ctx.stroke()
      ctx.restore()

      // ══════════════════════════════════════════════════════════════════
      // 7. Accent colour glow on the fold edge
      // ══════════════════════════════════════════════════════════════════
      if (t > 0.04) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(fBx, fBy)
        ctx.quadraticCurveTo(ctrlX, ctrlY, fRx, fRy)
        ctx.strokeStyle = accentColor + '55'
        ctx.lineWidth   = 9
        ctx.lineCap     = 'round'
        ctx.stroke()

        // outer bloom
        ctx.strokeStyle = accentColor + '1a'
        ctx.lineWidth   = 22
        ctx.stroke()
        ctx.restore()
      }

      // ── done? ──────────────────────────────────────────────────────────
      if (raw >= 1) {
        done = true
        onComplete?.()
        return
      }

      animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(animRef.current)
  }, [isAnimating, onComplete, accentColor])

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
