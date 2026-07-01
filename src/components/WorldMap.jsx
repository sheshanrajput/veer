"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Clock, Award } from 'lucide-react';

const MAP_HUBS = [
  { id: "AMD", name: "Ahmedabad (HQ)", x: 615, y: 220, isOrigin: true, details: "VEER Logistics Central Hub" },
  { id: "NYC", name: "New York (USA)", x: 260, y: 150, isOrigin: false, details: "Delivered in 3 Days" },
  { id: "LON", name: "London (UK)", x: 470, y: 110, isOrigin: false, details: "Delivered in 3 Days" },
  { id: "DXB", name: "Dubai (UAE)", x: 570, y: 200, isOrigin: false, details: "Delivered in 24 Hours" },
  { id: "SIN", name: "Singapore", x: 675, y: 260, isOrigin: false, details: "Delivered in 2 Days" },
  { id: "SYD", name: "Sydney (AUS)", x: 790, y: 340, isOrigin: false, details: "Delivered in 4 Days" }
];

export default function WorldMap() {
  const [activeHub, setActiveHub] = useState(null);

  // If activeHub is null, default active state to HQ (Ahmedabad)
  const currentActive = activeHub || MAP_HUBS.find(h => h.isOrigin);

  return (
    <div className="relative w-full flex flex-col md:block md:aspect-[2/1] bg-dark-light rounded-3xl border border-white/5 overflow-hidden p-5 md:p-10 shadow-premium gap-4 md:gap-0">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Mobile Hub Selector Row */}
      <div className="flex md:hidden overflow-x-auto gap-2 pb-1 scrollbar-none -mx-1 px-1 snap-x snap-mandatory relative z-20">
        {MAP_HUBS.map((hub) => {
          const isActive = currentActive.id === hub.id;
          return (
            <button
              key={hub.id}
              onClick={() => setActiveHub(hub)}
              className={`snap-align-start px-4 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all duration-300 border ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-md shadow-primary/20 scale-105'
                  : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {hub.name}
            </button>
          );
        })}
      </div>

      {/* Title / Status Board */}
      <div className="absolute top-6 left-6 z-10 hidden md:block max-w-xs bg-dark/70 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs uppercase font-bold tracking-widest text-white/90">Global Transit Status</span>
        </div>
        <p className="text-xs text-white/60">
          Hover over our global hubs to check estimated transit times and delivery performance.
        </p>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full aspect-[2/1] md:h-full select-none relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple Stylized Continents Outlines (Path shapes approximate) */}
        {/* North America */}
        <path d="M100 120 C 130 90, 200 100, 280 120 C 310 130, 310 180, 260 210 C 230 230, 200 210, 180 250 C 160 280, 140 310, 130 330 C 120 300, 100 240, 80 200 C 60 160, 70 140, 100 120 Z" fill="#ffffff" fillOpacity="0.02" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.5" />
        {/* South America */}
        <path d="M220 280 C 260 280, 310 320, 280 380 C 260 420, 240 460, 210 490 C 200 480, 190 440, 190 410 C 190 380, 180 340, 200 310 Z" fill="#ffffff" fillOpacity="0.02" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.5" />
        {/* Europe / Asia */}
        <path d="M420 80 C 500 50, 700 40, 900 80 C 950 100, 980 160, 920 210 C 880 240, 820 230, 780 260 C 720 290, 680 240, 630 260 C 580 280, 520 240, 480 200 C 440 160, 380 120, 420 80 Z" fill="#ffffff" fillOpacity="0.02" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.5" />
        {/* Africa */}
        <path d="M470 230 C 520 210, 580 230, 600 280 C 620 330, 600 380, 570 410 C 540 430, 520 400, 500 380 C 480 360, 450 280, 470 230 Z" fill="#ffffff" fillOpacity="0.02" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.5" />
        {/* Australia */}
        <path d="M740 330 C 780 310, 840 330, 860 370 C 840 410, 780 430, 750 400 C 730 380, 720 350, 740 330 Z" fill="#ffffff" fillOpacity="0.02" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.5" />

        {/* Transit Routes (Arcs) */}
        {MAP_HUBS.filter(h => !h.isOrigin).map((hub, idx) => {
          const origin = MAP_HUBS.find(h => h.isOrigin);
          const dx = hub.x - origin.x;
          const dy = hub.y - origin.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 1.2; // Curve depth
          
          const pathId = `route-${hub.id}`;
          const pathData = `M ${origin.x} ${origin.y} A ${dr} ${dr} 0 0,1 ${hub.x} ${hub.y}`;

          const durations = ["5s", "6.5s", "4.8s", "5.8s", "6.2s"];
          const durVal = durations[idx % durations.length];

          const isRouteActive = currentActive.id === hub.id;
          const isSomeRouteActive = !currentActive.isOrigin;
          
          const baseOpacity = isSomeRouteActive ? (isRouteActive ? 0.35 : 0.03) : 0.2;
          const activeOpacity = isSomeRouteActive ? (isRouteActive ? 1.0 : 0.05) : 0.6;
          const pulseOpacity = isSomeRouteActive ? (isRouteActive ? 1.0 : 0.0) : 1.0;

          return (
            <g key={hub.id}>
              {/* Glow background route path */}
              <path
                d={pathData}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="1.5"
                strokeOpacity={baseOpacity}
                className="transition-all duration-300"
              />
              {/* Dotted active connection */}
              <path
                id={pathId}
                d={pathData}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                strokeOpacity={activeOpacity}
                className="transition-all duration-300"
              />
              {/* Moving shipment pulse circle */}
              {pulseOpacity > 0 && (
                <circle r="4" fill="#FF6B00" className="shadow-lg animate-pulse" opacity={pulseOpacity}>
                  <animateMotion
                    dur={durVal}
                    repeatCount="indefinite"
                    path={pathData}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Linear Gradient for routes */}
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0057FF" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>

        {/* Hub Interactive Markers */}
        {MAP_HUBS.map((hub) => {
          const isActiveNode = currentActive.id === hub.id;
          return (
            <g
              key={hub.id}
              className="cursor-pointer group"
              onMouseEnter={() => setActiveHub(hub)}
              onMouseLeave={() => setActiveHub(null)}
              onClick={() => setActiveHub(hub)}
            >
              {/* Pulsing ring for active/hover node */}
              {isActiveNode && (
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={hub.isOrigin ? "14" : "10"}
                  fill={hub.isOrigin ? "#0057FF" : "#FF6B00"}
                  className="animate-ping opacity-25"
                />
              )}
              
              {/* Outer ring */}
              <circle
                cx={hub.x}
                cy={hub.y}
                r={hub.isOrigin ? "8" : "6"}
                fill={hub.isOrigin ? "#0057FF" : (isActiveNode ? "#FF6B00" : "#FFFFFF")}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className={`transition-all duration-300 group-hover:scale-125 ${isActiveNode ? 'scale-125' : ''}`}
              />

              {/* Hub Label */}
              <text
                x={hub.x}
                y={hub.y - 12}
                textAnchor="middle"
                fill={isActiveNode ? "#FF6B00" : "#FFFFFF"}
                className={`font-heading font-bold text-[10px] transition-all duration-300 ${
                  isActiveNode 
                    ? 'opacity-100 font-extrabold' 
                    : 'opacity-60 group-hover:opacity-100'
                }`}
              >
                {hub.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Info Overlay (Active Hub Panel) */}
      <div className="relative md:absolute md:bottom-6 md:right-6 z-10 w-full md:w-80">
        <div className="bg-dark/95 backdrop-blur-lg p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-2">
          {currentActive ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentActive.id}
            >
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                {currentActive.isOrigin ? "Origin Hub" : "Destination Node"}
              </span>
              <h4 className="font-heading font-bold text-white text-base mt-0.5">{currentActive.name}</h4>
              <p className="text-xs text-white/70 mt-1">{currentActive.details}</p>
            </motion.div>
          ) : (
            <div>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                HQ Location
              </span>
              <h4 className="font-heading font-bold text-white text-base mt-0.5">Ahmedabad, India</h4>
              <p className="text-xs text-white/70 mt-1">
                Connected to 220+ countries directly via express international airways.
              </p>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2.5 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[10px] text-white/50">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span>99.8% On-Time</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/50">
              <Award className="w-3.5 h-3.5 text-accent" />
              <span>Full Insurance</span>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
}
