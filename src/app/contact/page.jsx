"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, 
  Send, CheckCircle, ShieldAlert, Globe 
} from 'lucide-react';
import { CONTACT_INFO, COUNTRIES } from '@/constants';

const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(2, "Select destination country"),
  service: z.string().min(2, "Please select service type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate form submission API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-background pb-24">
      {/* 1. HERO SECTION */}
      <section className="bg-dark text-white pt-36 pb-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
            Contact Channels
          </span>
          <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Let's Ship Worldwide
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            Reach out to our Ahmedabad team directly for customs advisories, bulky air cargo bookings, or custom business contracts.
          </p>
        </div>
      </section>

      {/* 2. CONTACT OPTIONS & MAP */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form & Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-white rounded-3xl border border-black/[0.04] p-8 shadow-premium">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">Send Us a Message</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-success/5 border border-success/20 rounded-xl text-success text-sm flex gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>Thank you! Your message has been sent successfully. Our team will contact you.</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-xl text-error text-sm flex gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.name && <span className="text-xs text-error">{errors.name.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  {...register("phone")}
                  className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.phone && <span className="text-xs text-error">{errors.phone.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.email && <span className="text-xs text-error">{errors.email.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Target Country</label>
                <select
                  {...register("country")}
                  className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {errors.country && <span className="text-xs text-error">{errors.country.message}</span>}
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Required Service</label>
                <select
                  {...register("service")}
                  className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select service mode...</option>
                  <option value="international">International Courier</option>
                  <option value="air-cargo">Air Cargo</option>
                  <option value="medicine">Medicine Courier</option>
                  <option value="student">Student Cargo</option>
                  <option value="commercial">Commercial/B2B Cargo</option>
                </select>
                {errors.service && <span className="text-xs text-error">{errors.service.message}</span>}
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-dark/70 uppercase tracking-wider">Message Description</label>
                <textarea
                  rows="4"
                  placeholder="Detail your dimensions, cargo type or specific pick-up guidelines..."
                  {...register("message")}
                  className="w-full bg-black/[0.02] border border-black/5 rounded-xl py-3.5 px-4 text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary transition-colors resize-none"
                />
                {errors.message && <span className="text-xs text-error">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                className="btn-primary md:col-span-2 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4 text-secondary" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Cards & Google Map */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Contacts info cards */}
          <div className="grid grid-cols-1 gap-4">
            
            <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Call Hotline</span>
                <p className="text-sm font-bold text-dark mt-0.5">{CONTACT_INFO.phone}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">WhatsApp support</span>
                <p className="text-sm font-bold text-dark mt-0.5">{CONTACT_INFO.whatsapp}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Email Inquiry</span>
                <p className="text-sm font-bold text-dark mt-0.5">{CONTACT_INFO.email}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Office Headquarters</span>
                <p className="text-xs font-bold text-dark leading-relaxed mt-0.5">{CONTACT_INFO.address}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-dark/40 uppercase font-bold tracking-wider">Business Scopes</span>
                <p className="text-xs font-bold text-dark leading-relaxed mt-0.5">{CONTACT_INFO.hours}</p>
              </div>
            </div>

          </div>

          {/* Large Map Frame */}
          <div className="w-full h-80 rounded-[28px] overflow-hidden border border-black/[0.04] shadow-premium">
            <iframe
              src={CONTACT_INFO.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="VEER Headquarters Google Map"
            />
          </div>

        </div>

      </section>
    </div>
  );
}
