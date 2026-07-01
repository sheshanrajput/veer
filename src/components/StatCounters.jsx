"use client";
import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

function CountUpNumber({ value, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    // Parse the target numeric value out of strings like "220+", "1.2M+", "99.8%"
    const cleanVal = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(cleanVal)) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const end = cleanVal;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const current = start + easedProgress * (end - start);

      if (value.includes('M')) {
        setDisplayValue(current.toFixed(1));
      } else if (value.includes('.')) {
        setDisplayValue(current.toFixed(1));
      } else {
        setDisplayValue(Math.floor(current));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-numbers font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
      {displayValue}
      {suffix}
    </span>
  );
}

export default function StatCounters() {
  const STATS_DATA = [
    { value: "220", suffix: "+", label: "Countries Served" },
    { value: "1.2", suffix: "M+", label: "Parcels Delivered" },
    { value: "99.8", suffix: "%", label: "Delivery Success Rate" },
    { value: "15", suffix: "k+", label: "Happy Customers" },
    { value: "10", suffix: "+", label: "Years Experience" },
    { value: "24/7", suffix: "", label: "Support Desk" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-12 px-6 md:px-10 rounded-[32px] bg-gradient-to-tr from-dark to-dark-light border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-secondary/10 rounded-full blur-[80px]" />

      {STATS_DATA.map((stat, idx) => (
        <div key={idx} className="flex flex-col items-center text-center relative z-10">
          <CountUpNumber value={stat.value} suffix={stat.suffix} />
          <span className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider mt-2.5">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
