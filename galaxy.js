(() => {
  const reduceMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (reduceMotionQuery?.matches) return;

  const rootStyle = document.documentElement.style;

  const state = {
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    raf: 0,
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;

  const updateTargetFromPointer = (clientX, clientY) => {
    const width = Math.max(1, window.innerWidth || 1);
    const height = Math.max(1, window.innerHeight || 1);

    // Normalize to [-1..1]
    const x = (clientX / width - 0.5) * 2;
    const y = (clientY / height - 0.5) * 2;

    state.targetX = clamp(x, -1, 1);
    state.targetY = clamp(y, -1, 1);

    if (!state.raf) state.raf = requestAnimationFrame(tick);
  };

  const tick = () => {
    state.raf = 0;

    // Smooth toward the target so it feels "floaty" instead of twitchy.
    state.currentX = lerp(state.currentX, state.targetX, 0.08);
    state.currentY = lerp(state.currentY, state.targetY, 0.08);

    rootStyle.setProperty("--galaxy-x", state.currentX.toFixed(4));
    rootStyle.setProperty("--galaxy-y", state.currentY.toFixed(4));

    // Keep animating until we're close to the target.
    const dx = Math.abs(state.currentX - state.targetX);
    const dy = Math.abs(state.currentY - state.targetY);
    if (dx + dy > 0.0005) state.raf = requestAnimationFrame(tick);
  };

  const reset = () => {
    state.targetX = 0;
    state.targetY = 0;
    if (!state.raf) state.raf = requestAnimationFrame(tick);
  };

  const onPointerMove = (event) => {
    updateTargetFromPointer(event.clientX, event.clientY);
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });

  window.addEventListener("pointerleave", reset, { passive: true });
  window.addEventListener("blur", reset, { passive: true });

  // If the user toggles reduce motion while the page is open, stop reacting.
  reduceMotionQuery?.addEventListener?.("change", (event) => {
    if (event.matches) {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = 0;
      rootStyle.setProperty("--galaxy-x", "0");
      rootStyle.setProperty("--galaxy-y", "0");
    }
  });
})();
