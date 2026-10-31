"use client"

// Halftone Wordmark Footer — a site footer whose wordmark is set enormous and
// cropped by the bottom edge, printed as a field of halftone dots. Each dot is
// sized by how much of the letter covers its cell, so the type keeps its edges
// at any scale. Move across it and the dots part around the pointer on springs,
// warming in colour as they are pushed off their place; click and a shock ring
// runs through the word. Above it sit the studio line, tracked link columns and
// a back-to-top, separated by a hairline, all over a fine print grain.
//
// One file, React only. A 2D canvas for the dots and the grain, real anchors
// for the links. Every rule in the scoped <style> is .hwf- prefixed and nothing
// is fetched: the faces come from the host page or the fallback stacks.

import * as React from "react"

export interface HalftonePalette {
  /** The footer background. */
  background: string
  /** The dots at rest, and the text. */
  ink: string
  /** The colour a dot warms toward as it is pushed off its place. */
  warm: string
}

export type HalftonePreset = "night" | "paper" | "ember" | "cobalt"

export interface FooterLink {
  label: string
  href?: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface HalftoneWordmarkFooterProps {
  /** The giant word printed in dots. Lowercase reads best. */
  wordmark?: string
  /** Optional logo image asset path to render alongside the wordmark in halftone. */
  logoSrc?: string
  /** Complete transparent SVG lockup; sampled as one image with its exact proportions. */
  lockupSrc?: string
  /** Top-left studio line. */
  label?: string
  /** The muted line under it. */
  meta?: string
  /** Link columns along the top. */
  columns?: FooterColumn[]
  /** Show the back-to-top link. It scrolls the window to 0. Defaults to true. */
  backToTop?: boolean
  /** Starting colours. Defaults to "night". */
  preset?: HalftonePreset
  /** Colour overrides, merged over the preset. */
  palette?: { background?: string; ink?: string; warm?: string }
  /** Distance between dot centres, in CSS px. Defaults to 6. */
  dotGap?: number
  /** How far the pointer pushes, in CSS px. Defaults to 80. */
  radius?: number
  /** How much of the word's cap height hangs below the bottom edge, 0–0.6. Defaults to 0.2. */
  crop?: number
  /** Print grain over everything, 0–1. Defaults to 0.5. */
  grain?: number
  /** Pointer and click response. Defaults to true. */
  interactive?: boolean
  /** Face for the wordmark. Heavy grotesks print best. */
  fontFamily?: string
  /** Weight of the wordmark. Defaults to 800. */
  fontWeight?: number
  /** Face for the small type. */
  monoFamily?: string
  /** Height of the dedicated halftone wordmark strip. Accepts CSS lengths and clamp(). */
  height?: string
  /** Root element tag. Defaults to "footer". Use "div" when wrapped inside another footer landmark. */
  as?: "footer" | "div"
  /** Extra root class names. */
  className?: string
}

const PRESETS: { [K in HalftonePreset]: HalftonePalette } = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Work", links: [{ label: "Index" }, { label: "Archive" }, { label: "Journal" }] },
  { title: "Studio", links: [{ label: "About" }, { label: "Process" }, { label: "Careers" }] },
  { title: "Contact", links: [{ label: "hello@halden.co" }, { label: "+47 22 00 41 00" }] },
]

const SANS_STACK = '"DM Sans", "Helvetica Neue", Arial, system-ui, sans-serif'
const MONO_STACK = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace'

// #region halftone
// Pure helpers, lifted out and executed by tests/halftone-wordmark-footer.test.mjs.

/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
export function hwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/** Dot radius for a cell coverage in [0, 1]: area-true, so tone stays even. */
export function hwfRadius(coverage: number, gap: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage
  return Math.sqrt(c) * gap * 0.56
}

/** Exact round dot size for the official SVG lockup: no tiny partial edge speckles. */
export function hwfOfficialDotRadius(alpha: number, gap: number) {
  return alpha >= 0.6 ? Math.max(0, gap) * 0.405 : 0
}

/**
 * One step of a dot's spring back to home, plus the push from a pointer at
 * (px, py) within radius r. Returns [x, y, vx, vy]. Away from the pointer a
 * displaced dot always heads home and comes to rest.
 */
export function hwfStep(
  x: number, y: number, vx: number, vy: number,
  hx: number, hy: number, px: number, py: number, r: number,
) {
  const dx = x - px
  const dy = y - py
  const d2 = dx * dx + dy * dy
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001
    const f = (1 - d / r) * 2.6
    vx += (dx / d) * f
    vy += (dy / d) * f
  }
  vx = (vx + (hx - x) * 0.05) * 0.84
  vy = (vy + (hy - y) * 0.05) * 0.84
  return [x + vx, y + vy, vx, vy]
}

/** How warm a dot is drawn: 0 at home, 1 once it is `span` px or more away. */
export function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number) {
  const d = Math.hypot(x - hx, y - hy)
  return span > 0 ? Math.min(1, d / span) : 0
}

/** Font size that sets `measured` (width at 100px) to fill `width` exactly. */
export function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0
}
// #endregion

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; min-width: 0; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
}
/* The artwork gets its own space after the links and back-to-top control.
   Do not paint it behind interactive footer content. */
.hwf-art { position: relative; width: 100%; height: var(--hwf-art-height); overflow: hidden; isolation: isolate; }
.hwf-art canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; pointer-events: none; -webkit-mask-image: linear-gradient(to bottom, #000 84%, transparent 100%); mask-image: linear-gradient(to bottom, #000 84%, transparent 100%); }
/* Official lockup should remain equally clear from top to bottom, with no fade. */
.hwf-official-lockup .hwf-art canvas { -webkit-mask-image: none; mask-image: none; }
.hwf-top {
  position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.25fr) repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2.3vw, 24px); padding: clamp(18px, 2.7vw, 30px) clamp(20px, 3.4vw, 44px) clamp(18px, 2.6vw, 30px);
  font-family: var(--hwf-mono); font-size: clamp(11px, .85vw, 12px); letter-spacing: .10em; text-transform: uppercase; line-height: 1.7;
}
.hwf-brand strong { display: block; font-weight: 500; }
.hwf-brand span { opacity: .55; }
.hwf-col { min-width: 0; }
.hwf-col h3 { margin: 0; font: inherit; opacity: .45; font-weight: 600; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; }
.hwf-col a, .hwf-up {
  overflow-wrap: anywhere;
  color: inherit; text-decoration: none; opacity: .82; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, background-size .35s cubic-bezier(.2,.7,.1,1);
}
.hwf-col a:hover, .hwf-up:hover { opacity: 1; background-size: 100% 1px; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 1; display: flex; justify-content: flex-end; align-items: center; gap: 16px;
  margin: 0 clamp(20px, 3.4vw, 44px); padding: 12px 0 14px;
  border-top: 0.5px solid color-mix(in srgb, var(--hwf-ink) 16%, transparent);
  font-family: var(--hwf-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
}
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 920px) {
  .hwf-top { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 24px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .hwf-top { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 12px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`

export default function HalftoneWordmarkFooter({
  wordmark = "leqad",
  logoSrc = "/assets/brand/leqad-official-symbol-dark-v1.svg",
  lockupSrc,
  label = "Halden Studio",
  meta = "©2026 · Oslo / Lisbon",
  columns = DEFAULT_COLUMNS,
  backToTop = true,
  preset = "night",
  palette,
  dotGap = 6,
  radius = 80,
  crop = 0.2,
  grain = 0.5,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 800,
  monoFamily = MONO_STACK,
  height = "380px",
  as = "footer",
  className = "",
}: HalftoneWordmarkFooterProps) {
  const colors = { ...(PRESETS[preset] || PRESETS.night), ...(palette || {}) }
  const artRef = React.useRef(null as HTMLDivElement | null)
  const canvasRef = React.useRef(null as HTMLCanvasElement | null)
  const opts = React.useRef({ colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark, logoSrc, lockupSrc })
  opts.current = { colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark, logoSrc, lockupSrc }
  const key = [wordmark, logoSrc, lockupSrc, dotGap, crop, grain, fontFamily, fontWeight, colors.background, colors.ink, colors.warm].join("|")

  React.useEffect(() => {
    const art = artRef.current
    const canvas = canvasRef.current
    if (!art || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let alive = true
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)")
    let reduced = motionMedia.matches
    let w = 0
    let h = 0
    let dpr = 1
    let px = -1e5
    let py = -1e5
    let raf = 0
    let intersecting = true
    let visible = !document.hidden
    let awake = true
    let ring = { x: 0, y: 0, t: -1 }
    // Flat arrays: x, y, vx, vy, hx, hy, r, isAccent per dot.
    let dots = new Float32Array(0)
    let count = 0
    let grainTile = null as HTMLCanvasElement | null
    const ink = hwfHex(opts.current.colors.ink) || [245, 239, 231]
    const warm = hwfHex(opts.current.colors.warm) || [121, 51, 39]

    let logoImg: HTMLImageElement | null = null
    if (opts.current.lockupSrc || opts.current.logoSrc) {
      logoImg = new Image()
      logoImg.src = opts.current.lockupSrc || opts.current.logoSrc
      if (!logoImg.complete) {
        logoImg.onload = () => {
          if (alive) {
            layout()
            wake()
          }
        }
      }
    }

    const layout = () => {
      const o = opts.current
      const rect = art.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      // Supersample the *unchanged* official vector before reducing it to
      // halftone coverage. A 1x mask drops thin details in the emblem center.
      // Other wordmark modes keep their original sampling behavior.
      const maskScale = o.lockupSrc ? 2 : 1
      const mask = document.createElement("canvas")
      mask.width = w * maskScale
      mask.height = h * maskScale
      const m = mask.getContext("2d", { willReadFrequently: true })
      if (!m) return
      m.scale(maskScale, maskScale)

      const word = o.wordmark || ""
      const hasLogo = Boolean(logoImg && logoImg.complete && logoImg.naturalWidth > 0)
      const isMobile = w < 580
      const c = Math.max(0, Math.min(0.6, o.crop))

      if (o.lockupSrc && hasLogo) {
        // The entire official symbol + wordmark share one source and one scale.
        const ratio = 1625 / 470 // Exact viewBox of the official horizontal lockup.
        const inset = isMobile ? 18 : Math.max(32, Math.round(w * 0.05))
        const availableHeight = Math.max(50, h - (isMobile ? 24 : 32))
        const drawW = Math.min(w - inset * 2, availableHeight * ratio)
        const drawH = drawW / ratio
        const drawX = Math.round((w - drawW) / 2)
        const drawY = Math.round((h - drawH) / 2)
        m.drawImage(logoImg!, drawX, drawY, drawW, drawH)
        const source = m.getImageData(0, 0, mask.width, mask.height)
        for (let i = 0; i < source.data.length; i += 4) {
          const r = source.data[i], g = source.data[i + 1], b = source.data[i + 2]
          const accent = r > g * 1.5 && r < 180 && b < 100
          source.data[i] = accent ? 255 : 0
          source.data[i + 1] = 0
          source.data[i + 2] = 0
          // Keep original alpha: transparent counters and ivory strokes are geometry.
        }
        m.putImageData(source, 0, 0)
      } else if (!hasLogo) {
        // Fallback when no logo is available: fit wordmark only
        const face = o.fontWeight + " 100px " + o.fontFamily
        m.font = face
        let fit = Math.min(hwfFitSize(m.measureText(word).width, w * 0.95), h * 1.12)
        m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
        const measured = m.measureText(word)
        const measuredHeight = measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent
        if (measuredHeight > 0) fit *= Math.min(1, (h * 0.90) / measuredHeight)
        m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
        const box = m.measureText(word)
        const cap = box.actualBoundingBoxAscent || fit * 0.72
        const descent = box.actualBoundingBoxDescent || fit * 0.20
        m.fillStyle = "#000"
        m.textBaseline = "alphabetic"
        m.fillText(word, (w - box.width) / 2, (h + cap - descent) / 2 + (cap + descent) * c)
      } else if (!isMobile) {
        // Desktop & Tablet: unified side-by-side composition
        // Starting target proportions: logo ~25%, gap ~5%, wordmark ~70%
        const margin = Math.max(16, Math.round(w * 0.04))
        const availW = w - 2 * margin
        const maxArtworkH = Math.max(80, h - 36)
        const logoD = Math.min(Math.round(availW * 0.23), maxArtworkH)
        const gap = Math.max(16, Math.round(availW * 0.05))
        const wordmarkTargetW = Math.max(100, availW - logoD - gap)

        m.font = o.fontWeight + " 100px " + o.fontFamily
        const m100 = m.measureText(word)
        let fit = hwfFitSize(m100.width, wordmarkTargetW)
        m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
        let box = m.measureText(word)
        let mH = (box.actualBoundingBoxAscent || fit * 0.72) + (box.actualBoundingBoxDescent || fit * 0.20)
        if (mH > maxArtworkH) {
          fit *= (maxArtworkH / mH)
          m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
          box = m.measureText(word)
        }
        const cap = box.actualBoundingBoxAscent || fit * 0.72
        const descent = box.actualBoundingBoxDescent || fit * 0.20
        const totalW = logoD + gap + box.width
        const startX = Math.round((w - totalW) / 2)
        const logoX = startX
        const logoY = Math.round((h - logoD) / 2 + logoD * c)
        const wmX = logoX + logoD + gap
        const textY = Math.round((h + cap - descent) / 2 + (cap + descent) * c)

        // Convert logo into isolated mask preserving internal negative space
        const logoCanvas = document.createElement("canvas")
        logoCanvas.width = logoD
        logoCanvas.height = logoD
        const lctx = logoCanvas.getContext("2d", { willReadFrequently: true })
        if (lctx) {
          lctx.drawImage(logoImg!, 0, 0, logoD, logoD)
          const id = lctx.getImageData(0, 0, logoD, logoD)
          const d = id.data
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3]
            let alpha = 0
            let isAccent = 0
            if (a > 15) {
              const diff = Math.sqrt((r - 254)**2 + (g - 254)**2 + (b - 248)**2)
              if (diff > 20) {
                alpha = a < 250 ? a : Math.min(255, Math.max(0, Math.round(((diff - 16) / 28) * 255)))
                isAccent = ((r > 90 && r > b * 1.4 && r > g * 1.2) || (diff > 30 && r > 140 && b < 95)) ? 255 : 0
              }
            }
            d[i] = isAccent
            d[i+1] = 0
            d[i+2] = 0
            d[i+3] = alpha
          }
          lctx.putImageData(id, 0, 0)
          m.drawImage(logoCanvas, logoX, logoY)
        }

        // Draw wordmark onto shared mask
        m.fillStyle = "#000"
        m.textBaseline = "alphabetic"
        m.fillText(word, wmX, textY)
      } else {
        // Mobile: stacked within the same artwork region
        const maxLogoH = Math.min(Math.round(w * 0.28), Math.floor(h * 0.36), 80)
        const logoD = Math.max(56, maxLogoH)
        const logoX = Math.round((w - logoD) / 2)
        const targetWmW = Math.round(w * 0.86)
        const maxWmH = Math.floor(h * 0.38)

        m.font = o.fontWeight + " 100px " + o.fontFamily
        const m100 = m.measureText(word)
        let fit = Math.min(hwfFitSize(m100.width, targetWmW), maxWmH * 1.25)
        m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
        let box = m.measureText(word)
        let wmH = (box.actualBoundingBoxAscent || fit * 0.72) + (box.actualBoundingBoxDescent || fit * 0.20)
        if (wmH > maxWmH) {
          fit *= (maxWmH / wmH)
          m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
          box = m.measureText(word)
          wmH = (box.actualBoundingBoxAscent || fit * 0.72) + (box.actualBoundingBoxDescent || fit * 0.20)
        }
        const cap = box.actualBoundingBoxAscent || fit * 0.72
        const descent = box.actualBoundingBoxDescent || fit * 0.20
        const gapY = Math.max(8, Math.round((h - logoD - wmH) * 0.24))
        const totalStackH = logoD + gapY + wmH
        const startY = Math.max(14, Math.round((h - totalStackH) / 2 + totalStackH * c))
        const logoY = startY
        const wmX = Math.round((w - box.width) / 2)
        const textY = Math.round(startY + logoD + gapY + cap)

        const logoCanvas = document.createElement("canvas")
        logoCanvas.width = logoD
        logoCanvas.height = logoD
        const lctx = logoCanvas.getContext("2d", { willReadFrequently: true })
        if (lctx) {
          lctx.drawImage(logoImg!, 0, 0, logoD, logoD)
          const id = lctx.getImageData(0, 0, logoD, logoD)
          const d = id.data
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3]
            let alpha = 0
            let isAccent = 0
            if (a > 15) {
              const diff = Math.sqrt((r - 254)**2 + (g - 254)**2 + (b - 248)**2)
              if (diff > 20) {
                alpha = a < 250 ? a : Math.min(255, Math.max(0, Math.round(((diff - 16) / 28) * 255)))
                isAccent = ((r > 90 && r > b * 1.4 && r > g * 1.2) || (diff > 30 && r > 140 && b < 95)) ? 255 : 0
              }
            }
            d[i] = isAccent
            d[i+1] = 0
            d[i+2] = 0
            d[i+3] = alpha
          }
          lctx.putImageData(id, 0, 0)
          m.drawImage(logoCanvas, logoX, logoY)
        }

        m.fillStyle = "#000"
        m.textBaseline = "alphabetic"
        m.fillText(word, wmX, textY)
      }

      const img = m.getImageData(0, 0, mask.width, mask.height).data
      const gap = o.lockupSrc && isMobile ? 3 : Math.max(3, o.dotGap)
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      const tmp = []
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const hx = gx * gap + gap / 2
          const hy = gy * gap + gap / 2
          if (o.lockupSrc) {
            // Multi-sample the cell to determine accurate area coverage.
            // This eliminates point-sampling aliasing, staircases, and notch artifacts
            // on curved outlines (the circular emblem, chevron diagonals, and letter contours)
            // while preserving strictly uniform dot sizes across all units.
            let sumAlpha = 0
            let sumRed = 0
            const samples = 4
            for (let sy = 0; sy < samples; sy++) {
              for (let sx = 0; sx < samples; sx++) {
                const sampleX = gx * gap + ((sx + 0.5) * gap) / samples
                const sampleY = gy * gap + ((sy + 0.5) * gap) / samples
                const mx = Math.min(mask.width - 1, Math.floor(sampleX * maskScale))
                const my = Math.min(mask.height - 1, Math.floor(sampleY * maskScale))
                const idx = (my * mask.width + mx) * 4
                sumAlpha += img[idx + 3]
                sumRed += img[idx]
              }
            }
            const avgAlpha = sumAlpha / (samples * samples * 255)
            const baseDotR = hwfOfficialDotRadius(avgAlpha, gap)
            if (baseDotR === 0) continue
            const dotR = baseDotR * 1.15
            const isAccent = sumAlpha > 0 && (sumRed / sumAlpha) >= 0.35 ? 1 : 0
            tmp.push(hx, hy, 0, 0, hx, hy, dotR, isAccent)
            continue
          }
          let sumAlpha = 0
          let sumRed = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(mask.width - 1, Math.floor((gx * gap + ((sx + 0.5) * gap) / 3) * maskScale))
              const y = Math.min(mask.height - 1, Math.floor((gy * gap + ((sy + 0.5) * gap) / 3) * maskScale))
              const idx = (y * mask.width + x) * 4
              sumAlpha += img[idx + 3]
              sumRed += img[idx]
            }
          }
          const cov = sumAlpha / (9 * 255)
          if (cov < 0.06) continue
          const isAccent = (sumRed / (9 * 255)) > 0.30 ? 1 : 0
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap), isAccent)
        }
      }
      dots = new Float32Array(tmp)
      count = tmp.length / 8

      // A fixed tile of print grain, drawn once and laid over every frame.
      grainTile = document.createElement("canvas")
      grainTile.width = 256
      grainTile.height = 256
      const g = grainTile.getContext("2d")
      if (g) {
        const id = g.createImageData(256, 256)
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        g.putImageData(id, 0, 0)
      }
      awake = true
    }

    const draw = (now: number) => {
      const o = opts.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = o.colors.background
      ctx.fillRect(0, 0, w, h)

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t
      const ringR = ringAge * 0.9
      let moving = false
      for (let i = 0; i < count; i++) {
        const j = i * 8
        let x = dots[j]
        let y = dots[j + 1]
        let vx = dots[j + 2]
        let vy = dots[j + 3]
        const hx = dots[j + 4]
        const hy = dots[j + 5]
        const dotR = dots[j + 6]
        const isAccent = dots[j + 7] > 0.5

        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x
            const dy = hy - ring.y
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26)
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900)
              vx += (dx / d) * f
              vy += (dy / d) * f
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r)
          x = s[0]
          y = s[1]
          vx = s[2]
          vy = s[3]
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true
          else {
            x = hx
            y = hy
            vx = 0
            vy = 0
          }
          dots[j] = x
          dots[j + 1] = y
          dots[j + 2] = vx
          dots[j + 3] = vy
        }

        const k = hwfWarmth(x, y, hx, hy, 28)
        if (isAccent) {
          ctx.fillStyle = o.colors.warm
        } else if (k > 0.02) {
          ctx.fillStyle =
            "rgb(" +
            Math.round(ink[0] + (warm[0] - ink[0]) * k) + "," +
            Math.round(ink[1] + (warm[1] - ink[1]) * k) + "," +
            Math.round(ink[2] + (warm[2] - ink[2]) * k) + ")"
        } else {
          ctx.fillStyle = o.colors.ink
        }
        ctx.beginPath()
        ctx.arc(x, y, dotR, 0, 6.2832)
        ctx.fill()
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.09
        ctx.globalCompositeOperation = "overlay"
        const pattern = ctx.createPattern(grainTile, "repeat")
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, w, h)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"
      }
      // Sleep once everything is home and nothing is pushing.
      // Stop requesting frames once pointer-driven dots settle; the next
      // pointer move, tap, or observer callback wakes the animation again.
      awake = !reduced && (moving || ringAge < 900)
    }

    const loop = (now: number) => {
      raf = 0
      if (!visible) return
      draw(now)
      if (awake) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      awake = true
      if (!raf && visible) raf = requestAnimationFrame(loop)
    }

    const toLocal = (e: PointerEv) => {
      const b = canvas.getBoundingClientRect()
      return [e.clientX - b.left, e.clientY - b.top]
    }
    const onMove = (e: PointerEv) => {
      if (!opts.current.interactive || reduced) return
      const p = toLocal(e)
      px = p[0]
      py = p[1]
      wake()
    }
    const onLeave = () => {
      px = -1e5
      py = -1e5
      wake()
    }
    const onDown = (e: PointerEv) => {
      if (!opts.current.interactive || reduced) return
      if ((e.target as HTMLElement).closest("a,button")) return
      const p = toLocal(e)
      ring = { x: p[0], y: p[1], t: performance.now() }
      wake()
    }

    const onMotionChange = () => {
      reduced = motionMedia.matches
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      px = -1e5
      py = -1e5
      ring = { x: 0, y: 0, t: -1 }
      layout()
      draw(performance.now())
      if (!reduced) wake()
    }
    motionMedia.addEventListener("change", onMotionChange)
    layout()
    draw(performance.now())
    wake()

    art.addEventListener("pointermove", onMove)
    art.addEventListener("pointerleave", onLeave)
    art.addEventListener("pointerdown", onDown)
    const ro = new ResizeObserver(() => {
      layout()
      wake()
    })
    ro.observe(art)
    const io = new IntersectionObserver((entries) => {
      intersecting = entries[0] ? entries[0].isIntersecting : true
      visible = intersecting && !document.hidden
      if (visible) wake()
    })
    io.observe(art)

    const onVisibilityChange = () => {
      if (document.hidden) {
        visible = false
        if (raf) cancelAnimationFrame(raf)
        raf = 0
      } else {
        visible = intersecting
        if (visible) wake()
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    // A web font that lands late re-sets the word in its real face.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return
        layout()
        wake()
      })
    }

    return () => {
      alive = false
      motionMedia.removeEventListener("change", onMotionChange)
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      art.removeEventListener("pointermove", onMove)
      art.removeEventListener("pointerleave", onLeave)
      art.removeEventListener("pointerdown", onDown)
    }
  }, [key])

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const RootTag = as === "div" ? "div" : "footer"

  return (
    <RootTag
      className={"hwf-root " + (lockupSrc ? "hwf-official-lockup " : "") + className}
      style={
        {
          "--hwf-art-height": height,
          "--hwf-bg": colors.background,
          "--hwf-ink": colors.ink,
          "--hwf-mono": monoFamily,
        } as React.CSSProperties
      }
    >
      <style>{HWF_CSS}</style>
      <span className="hwf-sr">{wordmark}</span>
      {(label || meta || columns.length > 0) && <div className="hwf-top">
        <div className="hwf-brand">
          <strong>{label}</strong>
          <span>{meta}</span>
        </div>
        {columns.map((col) => (
          <nav className="hwf-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href || "#"}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>}
      {backToTop && <div className="hwf-rule">
        {backToTop ? (
          <button type="button" className="hwf-up" onClick={toTop}>
            Back to top ↑
          </button>
        ) : null}
      </div>}
      <div className="hwf-art" ref={artRef} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
    </RootTag>
  )
}

type PointerEv = PointerEvent
