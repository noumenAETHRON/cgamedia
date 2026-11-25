const canvas = document.querySelector<HTMLCanvasElement>('#starfield');
const context = canvas?.getContext('2d');
if (canvas && context) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars: { x: number; y: number; r: number; a: number; s: number; gold: boolean }[] = [];
  let running = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = window.innerWidth < 720 ? 70 : 130;
    stars = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.15 + 0.25,
      a: Math.random() * 0.45 + 0.2,
      s: Math.random() * 0.2 + 0.03,
      gold: index % 17 === 0,
    }));
  };

  const draw = (time: number) => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const star of stars) {
      const alpha = reduce ? star.a : star.a * (0.7 + 0.3 * Math.sin(time * 0.001 * star.s * 24 + star.x));
      context.fillStyle = star.gold ? `rgba(228, 195, 122, ${alpha})` : `rgba(244, 240, 230, ${alpha})`;
      context.beginPath();
      context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      context.fill();
    }
  };

  const frame = (time: number) => {
    if (!running) return;
    draw(time);
    if (!reduce) requestAnimationFrame(frame);
  };

  resize();
  requestAnimationFrame(frame);
  window.addEventListener('resize', () => {
    resize();
    if (reduce) draw(0);
  });
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !reduce) requestAnimationFrame(frame);
  });
}
