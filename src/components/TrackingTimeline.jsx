"use client";
import { Check, Clock, ShieldAlert } from 'lucide-react';

const TIMELINE_STEPS = [
  "Booked",
  "Picked Up",
  "Warehouse",
  "Airport",
  "Destination Country",
  "Custom Clearance",
  "Out For Delivery",
  "Delivered"
];

export default function TrackingTimeline({ currentStatus }) {
  // Normalize tracking status to step indexes
  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
        return 0;
      case "picked up":
        return 1;
      case "warehouse":
      case "warehouse sorting":
        return 2;
      case "airport":
      case "flight dispatch":
      case "airport landing":
        return 3;
      case "destination country":
      case "port landing":
        return 4;
      case "custom clearance":
        return 5;
      case "out for delivery":
        return 6;
      case "delivered":
        return 7;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full py-8">
      <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4">
        {/* Horizontal Connector Line (Desktop) */}
        <div className="absolute top-[22px] left-[5%] right-[5%] h-1 bg-black/[0.06] hidden md:block z-0">
          <div
            className="h-full bg-success transition-all duration-700"
            style={{ width: `${(Math.min(currentIndex, 7) / 7) * 100}%` }}
          />
        </div>

        {/* Vertical Connector Line (Mobile) */}
        <div className="absolute left-[29px] top-6 bottom-6 w-1 bg-black/[0.06] md:hidden z-0">
          <div
            className="w-full bg-success transition-all duration-700"
            style={{ height: `${(Math.min(currentIndex, 7) / 7) * 100}%` }}
          />
        </div>

        {TIMELINE_STEPS.map((step, idx) => {
          // Status evaluation
          let statusClass = "gray"; // pending
          if (idx < currentIndex) statusClass = "green"; // completed
          else if (idx === currentIndex) statusClass = "blue"; // current

          return (
            <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 z-10 w-full md:w-auto relative">
              {/* Step indicator node */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-sm ${
                  statusClass === "green"
                    ? "bg-success border-success text-white"
                    : statusClass === "blue"
                    ? "bg-primary border-primary text-white animate-pulse"
                    : "bg-white border-black/10 text-dark/40"
                }`}
              >
                {statusClass === "green" ? (
                  <Check className="w-5 h-5" />
                ) : statusClass === "blue" ? (
                  <Clock className="w-5 h-5 text-white" />
                ) : (
                  <span className="font-numbers font-bold text-sm">{idx + 1}</span>
                )}
              </div>

              {/* Step label text */}
              <div className="flex flex-col md:items-center text-left md:text-center">
                <span
                  className={`font-heading font-bold text-sm md:text-xs uppercase tracking-wider ${
                    statusClass === "green"
                      ? "text-success"
                      : statusClass === "blue"
                      ? "text-primary"
                      : "text-dark/40"
                  }`}
                >
                  {step}
                </span>
                <span className="text-[10px] text-dark/50 mt-0.5 md:hidden lg:inline-block">
                  {statusClass === "green"
                    ? "Completed"
                    : statusClass === "blue"
                    ? "In Progress"
                    : "Scheduled"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
