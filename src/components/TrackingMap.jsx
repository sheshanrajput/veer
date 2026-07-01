"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Compass, ShieldAlert } from 'lucide-react';

export default function TrackingMap({ shipmentData }) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (shipmentData?.coordinates) {
      setCoords(shipmentData.coordinates);
    }
  }, [shipmentData]);

  if (!coords) {
    return (
      <div className="w-full h-80 rounded-2xl bg-dark-light border border-white/5 flex items-center justify-center">
        <div className="text-center text-white/50">
          <ShieldAlert className="w-8 h-8 text-accent mx-auto mb-2" />
          <p className="text-sm">Coordinates unavailable for this parcel type.</p>
        </div>
      </div>
    );
  }

  // Simulated GPS route mapping using vector geometry
  const originStr = shipmentData.origin || "Ahmedabad, IN";
  const destStr = shipmentData.destination || "United States";
  const currentLoc = shipmentData.currentLocation || "In Transit";

  return (
    <div className="w-full bg-dark-light rounded-[24px] border border-white/5 overflow-hidden p-6 shadow-premium relative">
      {/* Map Stats Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Compass className="w-5 h-5 text-secondary animate-spin" />
          </div>
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Live Position System</span>
            <p className="text-sm font-heading font-bold text-white mt-0.5">GPS Tracking Activated</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Current Lat/Long</span>
          <p className="text-xs font-numbers font-medium text-secondary mt-0.5">
            {coords.current[0].toFixed(4)}° N, {coords.current[1].toFixed(4)}° E
          </p>
        </div>
      </div>

      {/* Simulated Vector Route Plotter */}
      <div className="relative w-full h-64 bg-dark rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
        {/* Radar grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Origin Node */}
        <div className="absolute left-10 md:left-20 flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary text-primary">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-heading font-bold text-white/80">{originStr.split(',')[0]}</span>
        </div>

        {/* Route Line Connector with pulsing dashes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 120 128 Q 250 80, 380 128"
            fill="none"
            stroke="#0057FF"
            strokeWidth="2"
            strokeDasharray="5 5"
            className="opacity-40"
          />
          {/* Active vehicle indicator */}
          <circle r="6" fill="#FF6B00" className="shadow-lg shadow-secondary/50">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M 120 128 Q 250 80, 380 128"
            />
          </circle>
        </svg>

        {/* Destination Node */}
        <div className="absolute right-10 md:right-20 flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent text-accent">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-heading font-bold text-white/80">{destStr.split(',')[0]}</span>
        </div>

        {/* Floating marker HUD representing current location */}
        <div className="absolute bottom-6 bg-dark/90 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-white">Current Node: {currentLoc}</span>
        </div>
      </div>

      {/* Map Footer status */}
      <p className="text-white/40 text-[10px] text-center mt-4">
        *Disclaimer: Live location feed updates based on international air-traffic transponder frequencies.
      </p>
    </div>
  );
}
