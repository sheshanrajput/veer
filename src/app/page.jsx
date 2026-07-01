"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Search, Phone, ArrowUpRight, CheckCircle, 
  MapPin, Shield, Star, Clock, Calendar, MessageSquare
} from 'lucide-react';
import { 
  BRAND_NAME, BRAND_TAGLINE, BRAND_DESCRIPTION, 
  SERVICES, WHY_CHOOSE_US, SHIPPING_PROCESS, TESTIMONIALS, BLOGS, CONTACT_INFO 
} from '@/constants';
import StatCounters from '@/components/StatCounters';
import TrustedBrands from '@/components/TrustedBrands';
import WorldMap from '@/components/WorldMap';
import FAQAccordion from '@/components/FAQAccordion';

export default function HomePage() {
  const [trackNum, setTrackNum] = useState('');
  const [activeProcess, setActiveProcess] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const router = useRouter();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackNum.trim()) {
      router.push(`/tracking?num=${trackNum.trim()}`);
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-background">
      
      {/* WRAPPER FOR HERO & STATS TO SHARE THE SAME DARK TEXTURED BACKGROUND */}
      <div className="relative bg-dark text-white overflow-hidden">
        {/* Animated Background Flight Routes */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
        
        {/* World Map Overlay behind Hero */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('/images/cargo-flight.svg')] bg-cover bg-center" />

        {/* 1. HERO SECTION */}
        <section className="relative min-h-0 lg:min-h-screen flex items-center pt-28 pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full">
            {/* Left Column: Heading & Text */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 bg-white/5 self-start text-[10px] sm:text-xs font-semibold tracking-wider text-secondary uppercase"
              >
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Ahmedabad's Premium Logistics Partner
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-white"
              >
                {/* Mobile version (inline flow with reduced space) */}
                <span className="block sm:hidden leading-[1.1] text-3xl">
                  Fast. Secure. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Worldwide Delivery.</span>
                </span>
                {/* Desktop version (stacked layout) */}
                <span className="hidden sm:block">
                  {BRAND_TAGLINE.split('. ').map((part, i) => (
                    <span key={i} className="block">
                      {part === "Worldwide Delivery." ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                          {part}
                        </span>
                      ) : part}
                    </span>
                  ))}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed"
              >
                {BRAND_DESCRIPTION}
              </motion.p>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 mt-2 w-full sm:w-auto"
              >
                <Link href="/inquiry" className="btn-primary w-full sm:w-auto text-center">
                  Book Pickup
                </Link>
                <Link href="/services" className="btn-outline-white w-full sm:w-auto text-center">
                  Our Services
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Tracking Widget & Graphics */}
            <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="glass-card-dark p-6 sm:p-8 rounded-[20px] sm:rounded-[28px] border border-white/10 relative overflow-hidden"
              >
                {/* Form header */}
                <div className="mb-6">
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Courier Console</span>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mt-1">Track Shipment</h3>
                  <p className="text-white/50 text-xs mt-2 leading-relaxed">
                    Enter your tracking number starting with <code className="text-secondary font-mono">VR</code> (e.g., <span className="font-mono text-white/80">VR777888999IN</span>) to retrieve your real-time status.
                  </p>
                </div>

                {/* Form Input */}
                <form onSubmit={handleTrackSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Tracking ID (e.g. VR777888999IN)"
                      value={trackNum}
                      onChange={(e) => setTrackNum(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors font-mono"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-2.5 p-2 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white"
                      aria-label="Submit search"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-90 text-white font-semibold rounded-xl py-3.5 transition-all duration-300 shadow-md shadow-primary/20"
                  >
                    Locate Shipment
                  </button>
                </form>

                {/* Status details bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/5 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Customs Assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>24/7 Hotline Support</span>
                  </div>
                </div>
              </motion.div>

              {/* Simulated Live delivery widget card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-success animate-ping shrink-0" />
                  <div>
                    <p className="text-xs text-white/50">Next Flight departure</p>
                    <p className="text-sm font-bold text-white font-heading mt-0.5">Ahmedabad to Frankfurt (Cargo)</p>
                  </div>
                </div>
                <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 rounded-md px-2 py-0.5 font-bold self-start sm:self-auto">
                  ON TIME
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. STATS SECTION */}
        <section className="pb-24 pt-8 lg:pt-0 relative z-10 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <StatCounters />
          </div>
        </section>
      </div>

      {/* 3. TRUSTED BRANDS MARQUEE */}
      <section className="bg-background">
        <TrustedBrands />
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-12 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
          <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/5 px-3.5 py-1.5 rounded-full">
            Uncompromised Logistics
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-4">
            Why Shippers Select VEER
          </h2>
          <p className="text-dark/60 text-base mt-4">
            Setting the standard for premium cargo distribution with tailormade solutions and end-to-end security.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {WHY_CHOOSE_US.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className={`glass-card p-4 sm:p-6 rounded-2xl sm:rounded-[24px] flex flex-col justify-between ${
                  idx === 4 ? '' : ''
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4 sm:mb-6">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-lg text-dark mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-dark/60 text-[10px] sm:text-xs leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. SERVICES PREVIEW */}
      <section className="py-12 bg-dark-light/5 border-y border-black/[0.02] px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-6">
            <div className="max-w-xl text-left">
              <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/5 px-3.5 py-1.5 rounded-full">
                Global Operations
              </span>
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-4">
                Designed to Handle Any Shipment
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-bold text-sm transition-colors duration-300"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-4 md:pb-0 px-6 -mx-6 md:px-0 md:mx-0 scrollbar-none snap-x snap-mandatory">
            {SERVICES.slice(0, 6).map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-[24px] border border-black/[0.04] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 w-[280px] sm:w-[320px] md:w-auto shrink-0 snap-align-start"
                >
                  {/* Service Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                    
                    {/* Floating Icon */}
                    <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg text-primary">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-dark mb-2">{service.title}</h3>
                    <p className="text-dark/60 text-sm leading-relaxed mb-6 h-12 overflow-hidden">
                      {service.description}
                    </p>
                    <ul className="flex flex-col gap-2 mb-6">
                      {service.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-dark/70">
                          <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/services"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-black/10 hover:bg-black/[0.02] text-sm font-semibold text-dark transition-all duration-300"
                    >
                      Learn More
                      <ArrowUpRight className="w-4 h-4 text-dark/40" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SHIPPING PROCESS TIMELINE */}
      <section className="py-12 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
          <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/5 px-3.5 py-1.5 rounded-full">
            Streamlined Journey
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-4">
            How Your Parcel Travels
          </h2>
          <p className="text-dark/60 text-base mt-4">
            A secure step-by-step transportation framework that handles logistics from pickup in Ahmedabad to recipient signing.
          </p>
        </div>

        {/* Process Steps Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch bg-white rounded-3xl border border-black/[0.04] p-4 sm:p-8 shadow-premium">
          <div className="lg:col-span-5 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory w-full">
            {SHIPPING_PROCESS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveProcess(idx)}
                className={`whitespace-nowrap flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl text-left transition-all duration-300 focus:outline-none shrink-0 snap-align-start ${
                  activeProcess === idx
                    ? 'bg-primary/5 border border-primary/20 text-primary font-bold'
                    : 'bg-black/[0.01] border border-transparent text-dark/70'
                }`}
              >
                <span className="font-numbers font-black text-sm lg:text-lg">{idx + 1}</span>
                <span className="font-heading font-bold text-xs lg:text-base">{step.title}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 bg-dark text-white rounded-2xl p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest font-heading">
                Step {activeProcess + 1} details
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl mt-1 text-white">{SHIPPING_PROCESS[activeProcess].title}</h3>
              <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed mt-4 max-w-md">
                {SHIPPING_PROCESS[activeProcess].description}. We employ state-of-the-art checkpoints to ensure your items are categorized, routed, and delivered strictly on schedule.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-secondary mt-8 pt-4 border-t border-white/5">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Full cargo insurance coverage applicable at this stage.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GLOBAL COVERAGE */}
      <section className="py-12 bg-dark text-white px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
              Global Network Map
            </span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mt-4">
              Real-time Global Connectivity
            </h2>
            <p className="text-white/60 text-base mt-4">
              Connecting local businesses in Gujarat directly with the global markets. Our active flights handle freight transits round the clock.
            </p>
          </div>

          <WorldMap />
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-12 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
          <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/5 px-3.5 py-1.5 rounded-full">
            Client Endorsements
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-4">
            What Our Shippers Say
          </h2>
        </div>

        <div 
          className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-6 md:pb-0 px-6 -mx-6 md:px-0 md:mx-0 scrollbar-none snap-x snap-mandatory"
          onScroll={(e) => {
            const scrollLeft = e.target.scrollLeft;
            const cardWidth = 290 + 24; // card width + gap
            const activeIdx = Math.min(
              TESTIMONIALS.length - 1,
              Math.max(0, Math.round(scrollLeft / cardWidth))
            );
            setActiveTestimonial(activeIdx);
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-[24px] flex flex-col justify-between w-[290px] sm:w-[320px] md:w-auto shrink-0 snap-align-start"
            >
              <div>
                <div className="flex gap-1 mb-4 text-accent">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-dark/80 text-sm leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-black/[0.04]">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-black/10"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-dark">{t.name}</h4>
                  <p className="text-dark/40 text-[10px]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots for Mobile */}
        <div className="flex md:hidden justify-center gap-1.5 mt-6">
          {TESTIMONIALS.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeTestimonial === idx ? 'w-5 bg-primary' : 'w-1.5 bg-black/10'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 9. LATEST LOGISTICS NEWS */}
      <section className="py-12 bg-dark-light/5 border-y border-black/[0.02] px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/5 px-3.5 py-1.5 rounded-full">
              Industry Knowledge
            </span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-4">
              Latest Insights & Logistics News
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOGS.map((blog, idx) => (
              <article
                key={idx}
                className="bg-white rounded-[24px] border border-black/[0.04] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-dark/40 mb-3 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {blog.date}
                    </span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-dark mb-2 leading-snug hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-dark/60 text-sm leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQS */}
      <section className="py-12 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
          <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/5 px-3.5 py-1.5 rounded-full">
            Help Desk
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-4">
            Frequently Asked Questions
          </h2>
        </div>

        <FAQAccordion />
      </section>

      {/* 11. CALL TO ACTION */}
      <section className="py-20 bg-primary text-white relative overflow-hidden mx-6 md:mx-8 rounded-[32px] mb-24 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-secondary/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-6">
          <h2 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Need to Ship Internationally?
          </h2>
          <p className="text-white/80 text-base md:text-lg max-w-lg leading-relaxed">
            Get instant competitive pricing, door pickup collection, and secure document clearance packages today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <Link
              href="/inquiry"
              className="bg-white text-primary font-bold rounded-xl py-3.5 px-8 transition-colors duration-300 hover:bg-slate-100 shadow-lg shadow-black/10"
            >
              Book Your Shipment Now
            </Link>
            <Link
              href="/contact"
              className="border border-white/20 hover:bg-white/5 text-white font-bold rounded-xl py-3.5 px-8 transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
