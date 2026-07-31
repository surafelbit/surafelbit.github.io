import React, { useEffect, useRef } from 'react'

/**
 * PageTurnTransition — canvas page-curl, fully opaque throughout.
 *
 * Two-phase handshake (eliminates the flash of the main page):
 *
 *  Phase 1 — curl finishes, canvas still FULLY OPAQUE:
 *    → calls onMounted()  so the parent can mount the detail page behind us
 *
 *  Phase 2 — two rAFs later (detail page has painted), canvas fades:
 *    → canvas CSS-transitions to opacity:0
 *    → calls onComplete() so the parent reveals the detail and removes us
 *
 * Result: at no point is the main portfolio page ever uncovered.
 */
export default function PageTurnTransition({ isAnimating, onMounted, onComplete }) {
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
    canvas.style.transition = ''
    canvas.style.opacity    = '1'

    const ctx = canvas.getContext('2d')

    const DURATION = 820
    let startTime  = null
    let completed  = false

    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    function getFoldPts(t) {
      if (t <= 0.5) {
        const p = t / 0.5
        return [
          [W * (1 - p), H],
          [W,  H * (1 - p)],
        ]
      }
      const p = (t - 0.5) / 0.5
      return [
        [0,  H * (1 - p)],
        [W * (1 - p), 0],
      ]
    }

    function frame(ts) {
      if (completed) return
      if (!startTime) startTime = ts

      const raw = Math.min((ts - startTime) / DURATION, 1)
      const t   = ease(raw)

      ctx.clearRect(0, 0, W, H)

      // Back-of-page colour (turned region)
      ctx.fillStyle = '#0d0d12'
      ctx.fillRect(0, 0, W, H)

      const [[p1x, p1y], [p2x, p2y]] = getFoldPts(t)

      const midX = (p1x + p2x) / 2
      const midY = (p1y + p2y) / 2
      const fDx  = p2x - p1x
      const fDy  = p2y - p1y
      const fLen = Math.hypot(fDx, fDy)

      const perpX    = -fDy / (fLen || 1)
      const perpY    =  fDx / (fLen || 1)
      const curveAmt = fLen * 0.22 * Math.sin(Math.PI * t)
      const ctrlX    = midX + perpX * curveAmt
      const ctrlY    = midY + perpY * curveAmt

      // Unturned region (page front)
      ctx.save()
      ctx.beginPath()
      if (t <= 0.5) {
        ctx.moveTo(0, 0)
        ctx.lineTo(W, 0)
        ctx.lineTo(p2x, p2y)
        ctx.quadraticCurveTo(ctrlX, ctrlY, p1x, p1y)
        ctx.lineTo(0, H)
        ctx.closePath()
      } else {
        ctx.moveTo(0, 0)
        ctx.lineTo(p2x, p2y)
        ctx.quadraticCurveTo(ctrlX, ctrlY, p1x, p1y)
        ctx.closePath()
      }
      ctx.fillStyle = '#080808'
      ctx.fill()
      ctx.restore()

      if (fLen > 2) {
        // Shadow gradient
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

        // Wide crease shadow
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

        // Paper-edge highlight
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(p1x, p1y)
        ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y)
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth   = 2.5
        ctx.lineCap     = 'round'
        ctx.stroke()
        ctx.restore()

        // Orange glow
        if (t > 0.03 && t < 0.97) {
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(p1x, p1y)
          ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y)
          ctx.strokeStyle = 'rgba(255,107,43,0.58)'
          ctx.lineWidth   = 8
          ctx.lineCap     = 'round'
          ctx.stroke()
          ctx.strokeStyle = 'rgba(255,107,43,0.18)'
          ctx.lineWidth   = 26
          ctx.stroke()
          ctx.strokeStyle = 'rgba(255,160,43,0.07)'
          ctx.lineWidth   = 50
          ctx.stroke()
          ctx.restore()
        }
      }

      if (raw >= 1) {
        if (!completed) {
          completed = true

          // Solid fill — entire canvas is now "turned"
          ctx.fillStyle = '#080808'
          ctx.fillRect(0, 0, W, H)

          // ── PHASE 1 ── tell parent to mount the detail page NOW.
          // Canvas is 100 % opaque here — it acts as an opaque cover
          // while React renders the detail component beneath us.
          onMounted?.()

          // ── PHASE 2 ── wait two paint frames so the browser has had
          // time to actually draw the detail page, THEN fade the canvas
          // away and signal the parent to make the detail the active layer.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              canvas.style.transition = 'opacity 0.22s ease-out'
              canvas.style.opacity    = '0'
              setTimeout(() => onComplete?.(), 240)
            })
          })
        }
        return
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
