import { useEffect, useRef } from 'react';

// Same pixel spacing, three states, and traveling wave as frigade.com.
const DITHER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const OPACITY = [0, .12, .4];

export function AnimatedDots({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let visible = false;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const paint = () => {
      context.clearRect(0, 0, width, height);
      const time = elapsed.current / 1000;
      for (let row = 0, y = 3; y < height; row++, y += 7) {
        for (let col = 0, x = 3; x < width; col++, x += 7) {
          const wave = Math.sin(x * .018 + y * .065 + time * .45
            + .65 * Math.sin(x * .007 - y * .023 + time * .15));
          const threshold = DITHER[(row % 4) * 4 + col % 4] / 16;
          const state = Math.max(0, Math.min(2, Math.floor(wave * .85 + .68 + threshold)));
          context.globalAlpha = OPACITY[state];
          context.fillRect(x, y, 1.5, 1.5);
        }
      }
    };
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = getComputedStyle(canvas).color;
      paint();
    };
    function tick(now: number) {
      if (last) elapsed.current += Math.min(now - last, 64);
      last = now;
      paint();
      frame = requestAnimationFrame(tick);
    }
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
      else paint();
    };

    resize();
    const sizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .08 });
    sizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} style={{ display: 'block', width: '100%', height: '100%' }} />;
}
