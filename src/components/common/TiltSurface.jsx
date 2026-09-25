import React, { useEffect, useRef } from "react";

const MOTION_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function TiltSurface({ as: Surface = "div", className, children }) {
  const surfaceRef = useRef(null);
  const frameRef = useRef(null);
  const allowedRef = useRef(false);

  const reset = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    const surface = surfaceRef.current;
    if (!surface) return;
    surface.removeAttribute("data-tilting");
    ["--tilt-x", "--tilt-y", "--light-x", "--light-y"].forEach((name) => surface.style.removeProperty(name));
  };

  useEffect(() => {
    const preference = window.matchMedia(MOTION_QUERY);
    const sync = () => {
      allowedRef.current = preference.matches;
      if (!preference.matches) reset();
    };
    sync();
    preference.addEventListener("change", sync);
    window.addEventListener("blur", reset);
    return () => {
      cancelAnimationFrame(frameRef.current);
      preference.removeEventListener("change", sync);
      window.removeEventListener("blur", reset);
    };
  }, []);

  const move = (event) => {
    if (!allowedRef.current || event.pointerType === "touch") return;
    // Measure the stationary wrapper so tilting never feeds back into pointer coordinates.
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const surface = surfaceRef.current;
      if (!surface) return;
      surface.dataset.tilting = "true";
      surface.style.setProperty("--tilt-x", `${(0.5 - y) * 18}deg`);
      surface.style.setProperty("--tilt-y", `${(x - 0.5) * 18}deg`);
      surface.style.setProperty("--light-x", `${x * 100}%`);
      surface.style.setProperty("--light-y", `${y * 100}%`);
    });
  };

  return (
    <div className="repair-tilt" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <Surface ref={surfaceRef} className={`${className} repair-tilt__surface`}>
        {children}
      </Surface>
    </div>
  );
}
