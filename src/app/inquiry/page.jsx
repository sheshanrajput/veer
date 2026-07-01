"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Send, MapPin, Package, Calendar, 
  Check, Info, Sparkles, HelpCircle 
} from 'lucide-react';
import { COUNTRIES, SERVICES } from '@/constants';
import { apiService } from '@/services/api';
import SuccessAnimation from '@/components/SuccessAnimation';

// Multi-step validation schemas using Zod
const senderSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address details are required"),
  country: z.string().min(2, "Please select sender country"),
});

const receiverSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address details are required"),
  country: z.string().min(2, "Please select receiver country"),
});

const shipmentSchema = z.object({
  weight: z.coerce.number().min(0.1, "Weight must be greater than 0"),
  parcelType: z.string().min(2, "Please select package type"),
  pickupDate: z.string().min(2, "Select a valid pickup date"),
  length: z.coerce.number().min(1, "Length required"),
  width: z.coerce.number().min(1, "Width required"),
  height: z.coerce.number().min(1, "Height required"),
});

export default function InquiryPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Initialize react-hook-form with resolvers for individual steps
  const { register: registerSender, handleSubmit: handleSubmitSender, formState: { errors: senderErrors }, getValues: getSenderValues } = useForm({
    resolver: zodResolver(senderSchema),
    defaultValues: { country: "India" }
  });

  const { register: registerReceiver, handleSubmit: handleSubmitReceiver, formState: { errors: receiverErrors }, getValues: getReceiverValues } = useForm({
    resolver: zodResolver(receiverSchema)
  });

  const { register: registerShipment, handleSubmit: handleSubmitShipment, formState: { errors: shipmentErrors }, getValues: getShipmentValues } = useForm({
    resolver: zodResolver(shipmentSchema),
    defaultValues: { parcelType: "parcel", length: 10, width: 10, height: 10 }
  });

  const handleNextStep = () => {
    if (step === 1) {
      handleSubmitSender(() => setStep(2))();
    } else if (step === 2) {
      handleSubmitReceiver(() => setStep(3))();
    } else if (step === 3) {
      handleSubmitShipment(() => setStep(4))();
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      sender: getSenderValues(),
      receiver: getReceiverValues(),
      shipment: getShipmentValues()
    };

    const { data, error: apiError } = await apiService.submitInquiry(payload);

    if (apiError) {
      setError(apiError);
    } else {
      setSubmissionResult(data);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep(1);
    setSubmissionResult(null);
    setError(null);
  };

  // Local billing calculation helper
  const billingInfo = step === 4 
    ? apiService.calculateEstimatePricing(
        getReceiverValues().country,
        getShipmentValues().weight,
        getShipmentValues().parcelType
      )
    : null;

  return (
    <div className="bg-background pb-24">
      
      {/* 1. HERO SECTION */}
      <section className="bg-dark text-white pt-36 pb-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
            Quotation System
          </span>
          <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Request Shipment Quote
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            Fill out sender, receiver and cargo parameters to generate an instant billing calculation and request parcel pickup.
          </p>
        </div>
      </section>

      {/* Stepper Status Indicators */}
      {!submissionResult && (
        <section className="max-w-3xl mx-auto px-6 mt-12">
          <div className="flex justify-between items-center relative">
            {/* Step progress lines */}
            <div className="absolute top-[22px] left-[5%] right-[5%] h-1 bg-black/[0.06] z-0">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>

            {[
              { num: 1, label: "Sender" },
              { num: 2, label: "Receiver" },
              { num: 3, label: "Shipment" },
              { num: 4, label: "Review" }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center z-10 relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-sm border-4 transition-all duration-300 ${
                    step === s.num
                      ? "bg-primary border-primary text-white animate-pulse"
                      : step > s.num
                      ? "bg-success border-success text-white"
                      : "bg-white border-black/10 text-dark/40"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 ${
                  step === s.num ? "text-primary" : "text-dark/40"
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. FORM BODY */}
      <section className="max-w-3xl mx-auto px-6 mt-12">
        {submissionResult ? (
          <SuccessAnimation referenceNumber={submissionResult.referenceNumber} onReset={handleReset} />
        ) : (
          <div className="bg-white rounded-3xl border border-black/[0.04] p-8 shadow-premium relative">
            {error && (
              <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-xl text-error text-sm flex gap-2">
                <Info className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: SENDER DETAILS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="border-b border-black/[0.04] pb-4">
                    <h2 className="font-heading font-bold text-xl text-dark flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Sender Details
                    </h2>
                    <p className="text-xs text-dark/40 mt-1">Specify sender identity and address within Ahmedabad / India.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Sender Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...registerSender("name")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                      />
                      {senderErrors.name && <span className="text-xs text-error">{senderErrors.name.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Sender Phone</label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        {...registerSender("phone")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                      />
                      {senderErrors.phone && <span className="text-xs text-error">{senderErrors.phone.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Sender Email</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        {...registerSender("email")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                      />
                      {senderErrors.email && <span className="text-xs text-error">{senderErrors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Origin Country</label>
                      <input
                        type="text"
                        readOnly
                        {...registerSender("country")}
                        className="w-full bg-black/[0.04] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark/60 cursor-not-allowed outline-none"
                      />
                      {senderErrors.country && <span className="text-xs text-error">{senderErrors.country.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Complete Pickup Address</label>
                      <textarea
                        rows="3"
                        placeholder="Flat/Office No., Street Address, Area, Landmark, Ahmedabad"
                        {...registerSender("address")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                      {senderErrors.address && <span className="text-xs text-error">{senderErrors.address.message}</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: RECEIVER DETAILS */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="border-b border-black/[0.04] pb-4">
                    <h2 className="font-heading font-bold text-xl text-dark flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      Receiver Details
                    </h2>
                    <p className="text-xs text-dark/40 mt-1">Specify destination recipient and country criteria.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Receiver Name</label>
                      <input
                        type="text"
                        placeholder="Jane Miller"
                        {...registerReceiver("name")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                      />
                      {receiverErrors.name && <span className="text-xs text-error">{receiverErrors.name.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Receiver Phone</label>
                      <input
                        type="tel"
                        placeholder="International number"
                        {...registerReceiver("phone")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                      />
                      {receiverErrors.phone && <span className="text-xs text-error">{receiverErrors.phone.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Receiver Email</label>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        {...registerReceiver("email")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                      />
                      {receiverErrors.email && <span className="text-xs text-error">{receiverErrors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Destination Country</label>
                      <select
                        {...registerReceiver("country")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">Select country...</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      {receiverErrors.country && <span className="text-xs text-error">{receiverErrors.country.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Complete Delivery Address</label>
                      <textarea
                        rows="3"
                        placeholder="Street Name, State/Province, Zip Code, Country"
                        {...registerReceiver("address")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                      {receiverErrors.address && <span className="text-xs text-error">{receiverErrors.address.message}</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SHIPMENT DETAILS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="border-b border-black/[0.04] pb-4">
                    <h2 className="font-heading font-bold text-xl text-dark flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Shipment Details
                    </h2>
                    <p className="text-xs text-dark/40 mt-1">Define consignment weight, category and dimensions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Parcel Type</label>
                      <select
                        {...registerShipment("parcelType")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="document">Document (Confidential/Paper)</option>
                        <option value="parcel">Standard Parcel (Garments, Food, etc.)</option>
                        <option value="cargo">Commercial Cargo (B2B Bulk)</option>
                        <option value="medicine">Medicines (FDA priority)</option>
                      </select>
                      {shipmentErrors.parcelType && <span className="text-xs text-error">{shipmentErrors.parcelType.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Est. Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.5"
                        {...registerShipment("weight")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                      />
                      {shipmentErrors.weight && <span className="text-xs text-error">{shipmentErrors.weight.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Scheduled Pickup Date</label>
                      <input
                        type="date"
                        {...registerShipment("pickupDate")}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
                      />
                      {shipmentErrors.pickupDate && <span className="text-xs text-error">{shipmentErrors.pickupDate.message}</span>}
                    </div>

                    {/* Dimensions Row */}
                    <div className="grid grid-cols-3 gap-2 md:col-span-1">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-dark/60 uppercase tracking-wider">Length (cm)</label>
                        <input
                          type="number"
                          {...registerShipment("length")}
                          className="w-full bg-black/[0.02] border border-black/5 rounded-lg py-2 px-2 text-xs text-dark focus:outline-none focus:border-primary"
                        />
                        {shipmentErrors.length && <span className="text-[10px] text-error">{shipmentErrors.length.message}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-dark/60 uppercase tracking-wider">Width (cm)</label>
                        <input
                          type="number"
                          {...registerShipment("width")}
                          className="w-full bg-black/[0.02] border border-black/5 rounded-lg py-2 px-2 text-xs text-dark focus:outline-none focus:border-primary"
                        />
                        {shipmentErrors.width && <span className="text-[10px] text-error">{shipmentErrors.width.message}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-dark/60 uppercase tracking-wider">Height (cm)</label>
                        <input
                          type="number"
                          {...registerShipment("height")}
                          className="w-full bg-black/[0.02] border border-black/5 rounded-lg py-2 px-2 text-xs text-dark focus:outline-none focus:border-primary"
                        />
                        {shipmentErrors.height && <span className="text-[10px] text-error">{shipmentErrors.height.message}</span>}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* STEP 4: REVIEW & PRICING ESTIMATE */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="border-b border-black/[0.04] pb-4">
                    <h2 className="font-heading font-bold text-xl text-dark flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent-dark" />
                      Summary & Pricing Estimate
                    </h2>
                    <p className="text-xs text-dark/40 mt-1">Review coordinates and view instant estimated freight charges.</p>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/[0.01] p-5 rounded-2xl border border-black/[0.03]">
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Shipper Location</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">{getSenderValues().name}</p>
                      <p className="text-xs text-dark/50 leading-relaxed mt-0.5">{getSenderValues().address}, {getSenderValues().country}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Recipient Node</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">{getReceiverValues().name}</p>
                      <p className="text-xs text-dark/50 leading-relaxed mt-0.5">{getReceiverValues().address}, {getReceiverValues().country}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Cargo Parameters</span>
                      <p className="text-sm font-semibold text-dark mt-0.5 capitalize">{getShipmentValues().parcelType} Mode</p>
                      <p className="text-xs text-dark/50 leading-relaxed mt-0.5">
                        Weight: {getShipmentValues().weight} kg | Dims: {getShipmentValues().length}x{getShipmentValues().width}x{getShipmentValues().height} cm
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Transit Target Calendar</span>
                      <p className="text-sm font-semibold text-dark mt-0.5">Pickup: {getShipmentValues().pickupDate}</p>
                    </div>
                  </div>

                  {/* Price Estimate Card */}
                  {billingInfo && (
                    <div className="bg-dark text-white rounded-2xl p-6 relative overflow-hidden border border-white/5 shadow-xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                      
                      <span className="text-[10px] text-secondary font-bold uppercase tracking-widest font-heading">
                        Estimated Quotation
                      </span>
                      <h3 className="font-heading font-black text-3xl mt-1 text-white flex items-baseline gap-1">
                        <span className="text-xs font-normal text-white/50">INR</span>
                        {billingInfo.totalAmount.toLocaleString('en-IN')}
                      </h3>
                      
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5 text-xs text-white/60">
                        <div className="flex justify-between">
                          <span>Freight Charge</span>
                          <span className="font-mono text-white/80">₹{billingInfo.freightCharges}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fuel Surcharge (18%)</span>
                          <span className="font-mono text-white/80">₹{billingInfo.fuelSurcharge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Doc & Custom clearing fee</span>
                          <span className="font-mono text-white/80">₹{billingInfo.documentationFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (18%)</span>
                          <span className="font-mono text-white/80">₹{billingInfo.tax}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-white/5 font-semibold text-secondary">
                          <span>Est. Transit Time</span>
                          <span>{billingInfo.transitDays}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2 bg-primary/5 rounded-xl p-4 border border-primary/10 text-xs text-dark/70">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      *Note: This is an estimated price based on general cargo dimensions. Final pricing is verified by the pickup agent upon physical volume weighing in Ahmedabad.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Steps Actions Footer */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-black/[0.04]">
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="btn-outline flex items-center gap-2 py-3 px-5 text-sm"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="btn-primary flex items-center gap-2 py-3 px-6 text-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  className="btn-primary bg-success hover:bg-success/90 shadow-success/10 flex items-center gap-2 py-3 px-8 text-sm"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Submit Quote Inquiry"}
                  <Send className="w-4 h-4 text-secondary" />
                </button>
              )}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
