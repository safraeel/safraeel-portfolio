"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className }: GlitchTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [glitchText, setGlitchText] = useState(text);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    if (!isHovered) {
      setGlitchText(text);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setGlitchText((prev) =>
        prev
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <span className="relative z-10">{glitchText}</span>
      {/* Glitch layers on hover */}
      {isHovered && (
        <>
          <span className="absolute left-[2px] top-0 -z-10 text-red-500 opacity-70 animate-glitch mix-blend-screen">
            {text}
          </span>
          <span className="absolute -left-[2px] top-0 -z-10 text-blue-500 opacity-70 animate-glitch mix-blend-screen" style={{ animationDelay: '0.1s' }}>
            {text}
          </span>
        </>
      )}
    </motion.span>
  );
}