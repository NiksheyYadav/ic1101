"use client";
import { useEffect, useRef } from "react";

export function InteractiveMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.95 + 0.65;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        
        // Calculate distance to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distanceMouse = Math.sqrt(dx * dx + dy * dy);
        
        // Swell up and brighten near mouse
        let renderSize = this.size;
        if (distanceMouse < 150) {
          const factor = (150 - distanceMouse) / 150;
          renderSize = this.size + factor * 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + factor * 0.4})`;
          ctx.lineWidth = 0.5 + factor * 0.5;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + factor * 0.5})`;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Faint glass interior
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"; // Frosted glass edge
        }

        ctx.arc(this.x, this.y, renderSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw radial gradient under mouse
      if (mouse.x !== -1000 && mouse.y !== -1000) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.06)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Distance to mouse
        const dxMouse = mouse.x - particles[i].x;
        const dyMouse = mouse.y - particles[i].y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distanceMouse < 200) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - distanceMouse / 200)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          // Magnetic dodge effect
          const forceDirectionX = dxMouse / distanceMouse;
          const forceDirectionY = dyMouse / distanceMouse;
          const force = (200 - distanceMouse) / 200;
          particles[i].x -= forceDirectionX * force * 1.5;
          particles[i].y -= forceDirectionY * force * 1.5;
        }

        // Distance to other particles
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 120)})`; 
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
