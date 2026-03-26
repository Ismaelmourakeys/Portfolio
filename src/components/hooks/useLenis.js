import { useEffect } from "react";
import Lenis from "lenis";

export function useLenis({ duration = 1.6, enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [duration, enabled]);
}
