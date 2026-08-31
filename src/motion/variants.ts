import type { Variants } from 'framer-motion'

// ──────────────────────────────────────────────────────────
// Shared easing — matches CSS --ease-out token
// ──────────────────────────────────────────────────────────
export const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

// ──────────────────────────────────────────────────────────
// Page-level transitions
// ──────────────────────────────────────────────────────────
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
}

// ──────────────────────────────────────────────────────────
// Staggered list container
// ──────────────────────────────────────────────────────────
export const listContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
}

// ──────────────────────────────────────────────────────────
// Card appear
// ──────────────────────────────────────────────────────────
export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
}

// ──────────────────────────────────────────────────────────
// Slide-in from left (sidebar items)
// ──────────────────────────────────────────────────────────
export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: EASE_OUT },
  },
}

// ──────────────────────────────────────────────────────────
// Hash badge flip (idle → verifying → verified)
// ──────────────────────────────────────────────────────────
export const badgeFlip: Variants = {
  initial: { rotateY: 0 },
  flip: {
    rotateY: [0, 90, 0],
    transition: { duration: 0.4, ease: EASE_OUT },
  },
}

// ──────────────────────────────────────────────────────────
// Modal overlay
// ──────────────────────────────────────────────────────────
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
}

// ──────────────────────────────────────────────────────────
// Chain link entrance (custody log)
// ──────────────────────────────────────────────────────────
export const chainLinkVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: EASE_OUT, delay: i * 0.04 },
  }),
}

// ──────────────────────────────────────────────────────────
// Progress fill
// ──────────────────────────────────────────────────────────
export const progressFill = (pct: number) => ({
  initial: { width: '0%' },
  animate: {
    width: `${pct}%`,
    transition: { duration: 0.8, ease: EASE_OUT, delay: 0.2 },
  },
})
