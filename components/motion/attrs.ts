// Data-attribute hooks read by initMotion() / the CSS keyframes. Using attributes instead of
// wrapper components keeps the markup identical to the design (no extra grid children).

/** Fade-up. `now` = runs on first paint (CSS); otherwise on scroll (GSAP, `top 92%`). */
export const fade = (now = false) => (now ? { 'data-fade-now': '' } : { 'data-fade': '' });

/** Ink-in: text fills from grey to ink, character by character, as it scrolls up (scrubbed). */
export const ink = { 'data-ink': '' };
