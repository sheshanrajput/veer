"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, ShieldAlert, ArrowLeft, Package, MapPin, Calendar, 
  Weight, Ruler, Tag, FileText, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { apiService } from '@/services/api';
import TrackingTimeline from '@/components/TrackingTimeline';
import TrackingMap from '@/components/TrackingMap';

function TrackingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const numParam = searchParams.get('num') || '';

  const [trackingNumber, setTrackingNumber] = useState(numParam);
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState(null);

  const fetchTracking = async (number) => {
    if (!number.trim()) return;
    setLoading(true);
    setError(null);
    setShipment(null);
    
    // 1. Check Backend API Orders First (Billing ID or Local Tracking ID)
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const parsedOrders = await res.json();
        const searchParam = String(number).trim().replace(/^#/, '').toLowerCase();
        
        // Fallback: If the searchParam is found anywhere in the order object
        const localMatch = parsedOrders.find(o => {
            if (!o) return false;
            
            // Format ID for direct comparison
            const bIdStr = String(o.billingId || "").replace(/^#/, '').trim().toLowerCase();
            const bIdNum = String(Number(bIdStr));
            const sIdNum = String(Number(searchParam));
            
            // Check direct exact matches on ID
            if (bIdStr === searchParam || (bIdNum !== "nan" && bIdNum === sIdNum)) return true;
            if (String(o.trackingId || "").trim().toLowerCase() === searchParam) return true;
            
            // Brutal fallback: stringify the whole object
            const jsonStr = JSON.stringify(o).toLowerCase();
            return jsonStr.includes(`:"${searchParam}"`) || jsonStr.includes(`:"#${searchParam}"`);
          });
          
          if (localMatch) {
            setShipment({
              trackingNumber: localMatch.trackingId || `BILL-${localMatch.billingId}`,
              status: localMatch.status,
              currentLocation: "Origin Facility",
              estimatedDelivery: "TBD",
              origin: "Admin Portal",
              receiver: localMatch.orderName,
              destination: localMatch.mobile,
              bookedDate: localMatch.createdAt,
              shipmentType: "Admin Order",
              weight: "Standard",
              dimensions: "N/A",
              history: [
                {
                  date: localMatch.createdAt || "Unknown",
                  time: "10:00",
                  location: "System",
                  status: localMatch.status || "Pending",
                  remarks: localMatch.description || "Order processed via Admin Dashboard"
                }
              ]
            });
            setLoading(false);
            return;
          } else {
            // DEBUG OVERLAY: If we reached here, localMatch was falsy
            // Let's force render the first order to see what's actually inside parsedOrders
            if (parsedOrders && parsedOrders.length > 0) {
              const debugOrder = parsedOrders[0];
              setShipment({
                trackingNumber: `DEBUG-SEARCH-FAIL`,
                status: `bId='${debugOrder.billingId}' search='${searchParam}'`,
                currentLocation: JSON.stringify(debugOrder).substring(0, 80) + '...',
                estimatedDelivery: "DEBUG",
                origin: "DEBUG",
                receiver: "DEBUG",
                destination: "DEBUG",
                bookedDate: "DEBUG",
                shipmentType: "DEBUG",
                weight: "DEBUG",
                dimensions: "DEBUG",
                history: [
                  {
                    date: "DEBUG",
                    time: "00:00",
                    location: "DEBUG",
                    status: "DEBUG",
                    remarks: "DEBUG"
                  }
                ]
              });
              setLoading(false);
              return;
            }
          }
      }
    } catch (e) {
      console.error("Error fetching orders from API for tracking", e);
    }
    
    // 2. Fallback to External API
    const { data, error: apiError } = await apiService.getTrackingDetails(number);
    
    // Inject debug info into the error message
    if (apiError) {
      setError(apiError + " | API STORAGE: Could not find " + number);
    } else {
      setShipment(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (numParam) {
      setTrackingNumber(numParam);
      fetchTracking(numParam);
    }
  }, [numParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      if (trackingNumber.trim() === numParam) {
        fetchTracking(trackingNumber.trim());
      } else {
        router.push(`/tracking?num=${trackingNumber.trim()}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* 1. PREMIUM HERO */}
      <section className="bg-dark text-white pt-36 pb-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
            Real-Time Tracking Console
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            Monitor the exact location, dispatch flight routes, and customs checkpoints of your global parcels.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-8" suppressHydrationWarning>
            <div className="relative flex items-center bg-white/10 border border-white/10 rounded-2xl p-2 backdrop-blur-md">
              <Search className="w-5 h-5 text-white/40 ml-3" />
              <input
                type="text"
                placeholder="Enter Tracking ID or Billing ID (e.g. 001)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-white placeholder-white/40 px-3 py-3 font-mono text-sm"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="btn-primary py-2.5 px-6 shrink-0 rounded-xl"
                suppressHydrationWarning
              >
                Track Now
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. MAIN LOGISTICS BOARD */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mt-12 relative z-20">
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto py-12">
            <div className="h-44 w-full bg-white rounded-3xl animate-pulse border border-black/[0.04]" />
            <div className="h-64 w-full bg-white rounded-3xl animate-pulse border border-black/[0.04]" />
          </div>
        )}

        {/* Not Found State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card max-w-2xl mx-auto p-10 text-center rounded-[32px] flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error border border-error/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl text-dark">Shipment Not Found</h2>
              <p className="text-dark/60 text-sm mt-2 max-w-md leading-relaxed">
                We couldn't retrieve records for <code className="font-mono text-primary font-bold">{trackingNumber}</code>. 
              </p>
              {typeof error === "string" && (
                <div className="text-error/80 text-xs mt-4 max-w-md leading-relaxed border border-error/20 bg-error/5 p-4 rounded-lg break-all">
                  <p className="font-bold mb-2 text-error">DEBUG INFO: {error}</p>
                  {error.includes("EMPTY/NULL") && (
                    <div className="mt-2 text-dark/70 bg-white/50 p-2 rounded">
                      <strong className="text-dark">Why is this happening?</strong><br/>
                      The browser's local database is completely empty on this tab. This happens if:
                      <ul className="list-disc pl-4 mt-1">
                        <li>You are testing the Admin panel in an <b>Incognito/Private window</b>, but tracking in a normal window (they do not share data).</li>
                        <li>You are using <b>127.0.0.1:3000</b> for Admin and <b>localhost:3000</b> for Tracking (these are treated as different websites).</li>
                        <li>Your browser's security settings are blocking cross-tab storage.</li>
                      </ul>
                      <br/>
                      <b>Quick Fix:</b> Open the Admin panel in a new tab <i>right next to this one</i> in the exact same browser window, create the order, and try again!
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Direct Support details */}
            <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-black/[0.04]">
              <div className="text-left">
                <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Ahmedabad Desk</span>
                <p className="text-sm font-semibold text-dark mt-0.5">+91 79 4005 1234</p>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Email Inquiry</span>
                <p className="text-sm font-semibold text-dark mt-0.5">info@veerlogistics.com</p>
              </div>
            </div>

            <button
              onClick={() => {
                setTrackingNumber('');
                router.push('/tracking');
                setError(null);
              }}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Reset Console & Try Again
            </button>
          </motion.div>
        )}

        {/* Found State details */}
        {shipment && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            
            {/* Status Summary Banner */}
            <div className="glass-card rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Consignment Number</span>
                  <h2 className="font-numbers font-black text-2xl text-dark leading-tight">{shipment.trackingNumber}</h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-8">
                <div>
                  <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Current Status</span>
                  <p className="text-base font-heading font-bold text-primary mt-0.5">{shipment.status}</p>
                </div>
                <div>
                  <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Last Scanned Node</span>
                  <p className="text-base font-heading font-bold text-dark mt-0.5">{shipment.currentLocation}</p>
                </div>
                <div>
                  <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Est. Delivery</span>
                  <p className="text-base font-heading font-bold text-success mt-0.5">{shipment.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Timeline component */}
            <div className="glass-card rounded-[28px] p-6 md:p-8">
              <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider mb-6 block">Transit Milestone Timeline</span>
              <TrackingTimeline currentStatus={shipment.status} />
            </div>

            {/* Two Column details: Metadata vs Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Shipment Specs */}
              <div className="lg:col-span-6 glass-card rounded-[28px] p-6 md:p-8">
                <h3 className="font-heading font-bold text-xl text-dark mb-6">Consignment Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Sender details */}
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Shipper Location</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">{shipment.origin}</p>
                    </div>
                  </div>

                  {/* Receiver details */}
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Recipient Name & Zone</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">{shipment.receiver}</p>
                      <p className="text-xs text-dark/50 mt-0.5">{shipment.destination}</p>
                    </div>
                  </div>

                  {/* Dates details */}
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-dark/60 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Booking Date</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">{shipment.bookedDate}</p>
                    </div>
                  </div>

                  {/* Type details */}
                  <div className="flex gap-3">
                    <Tag className="w-5 h-5 text-dark/60 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Shipment Mode</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">{shipment.shipmentType}</p>
                    </div>
                  </div>

                  {/* Weight details */}
                  <div className="flex gap-3">
                    <Weight className="w-5 h-5 text-dark/60 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Physical Weight</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">{shipment.weight}</p>
                    </div>
                  </div>

                  {/* Dimension details */}
                  <div className="flex gap-3">
                    <Ruler className="w-5 h-5 text-dark/60 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Dimensions (L x W x H)</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">{shipment.dimensions}</p>
                    </div>
                  </div>

                </div>

                <div className="bg-primary/5 rounded-xl p-4 flex gap-3 mt-8 border border-primary/10">
                  <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-dark/70 leading-relaxed">
                    Customs clearance documentation compiled and cataloged at Ahmedabad Airport cargo branch. No issues reported.
                  </p>
                </div>
              </div>

              {/* Right Column: Live Map */}
              <div className="lg:col-span-6">
                <TrackingMap shipmentData={shipment} />
              </div>

            </div>

            {/* Tracking Scan History Table */}
            <div className="glass-card rounded-[28px] overflow-hidden p-6 md:p-8">
              <h3 className="font-heading font-bold text-xl text-dark mb-6">Scan Operations History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/[0.04]">
                      <th className="py-4 text-xs font-bold uppercase tracking-wider text-dark/40">Timestamp</th>
                      <th className="py-4 text-xs font-bold uppercase tracking-wider text-dark/40">Node Location</th>
                      <th className="py-4 text-xs font-bold uppercase tracking-wider text-dark/40">Transit Milestone</th>
                      <th className="py-4 text-xs font-bold uppercase tracking-wider text-dark/40">Remarks / Scanned Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipment.history.map((row, index) => (
                      <tr key={index} className="border-b border-black/[0.02] last:border-0 hover:bg-black/[0.005] transition-colors">
                        <td className="py-4 text-sm font-medium text-dark font-numbers">
                          {row.date} <span className="text-xs text-dark/40 font-normal">{row.time}</span>
                        </td>
                        <td className="py-4 text-sm font-bold text-dark flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          {row.location}
                        </td>
                        <td className="py-4 text-sm">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                            row.status === "Delivered"
                              ? "bg-success/10 text-success"
                              : "bg-primary/10 text-primary"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-dark/60 leading-relaxed max-w-xs">{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

      </section>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Initializing tracking console...</p>
        </div>
      </div>
    }>
      <TrackingPageContent />
    </Suspense>
  );
}
