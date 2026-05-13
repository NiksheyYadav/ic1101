"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Determine if device is touch-capable (don't show custom cursor on mobile)
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicking ? 0.5 : (isHovering ? 0 : 1),
          opacity: (isHovering && !isClicking) ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          backgroundColor: "#00D4FF",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          boxShadow: "0 0 10px #00D4FF",
        }}
      />
      <motion.div
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isClicking ? 0.8 : (isHovering ? 1.5 : 1),
          backgroundColor: isClicking ? "rgba(0, 212, 255, 0.3)" : (isHovering ? "rgba(0, 212, 255, 0.1)" : "transparent"),
          borderColor: isClicking ? "rgba(0, 212, 255, 1)" : (isHovering ? "rgba(0, 212, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"),
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          border: "1px solid",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
        }}
      />
    </>
  );
}
