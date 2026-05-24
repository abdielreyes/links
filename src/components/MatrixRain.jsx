import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ>_{}[]<>/\\|';
    const fontSize = 13;
    let cols, drops;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1);
    }

    function draw() {
      ctx.fillStyle = 'rgba(8,8,8,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() > 0.95 ? 1 : 0.15 + Math.random() * 0.25;
        ctx.fillStyle = `rgba(180,180,180,${alpha})`;
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    resize();
    window.addEventListener('resize', resize);
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.35,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
