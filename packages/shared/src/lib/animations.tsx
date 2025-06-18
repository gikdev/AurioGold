import type { Variants } from "motion/react"

export const motionPresets = {
  // 1. Fade
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // 2. Slide In from Left
  slideLeft: {
    initial: { x: -40, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  },

  // 3. Slide In from Right
  slideRight: {
    initial: { x: 40, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 40, opacity: 0 },
  },

  // 4. Slide Up
  slideUp: {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 40, opacity: 0 },
  },

  // 5. Slide Down
  slideDown: {
    initial: { y: -40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -40, opacity: 0 },
  },

  // 6. Scale In
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },

  // 7. Pop In (bounce effect)
  pop: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1.05, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },

  // 8. Drop In (like a dialog or modal)
  dropIn: {
    initial: { y: -100, opacity: 0, scale: 0.95 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -100, opacity: 0, scale: 0.95 },
  },

  // 9. Behind Slide (slide under neighbor)
  slideBehind: {
    initial: { x: -20, scale: 0.96, opacity: 0, zIndex: 0 },
    animate: { x: 0, scale: 1, opacity: 1, zIndex: 10 },
    exit: { x: -20, scale: 0.96, opacity: 0, zIndex: 0 },
  },

  // 10. Page Fade (for full-page transitions)
  pageFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  openCloseHeight: {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  },
} satisfies Record<string, Variants>
