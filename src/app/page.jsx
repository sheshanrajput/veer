"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Phone, ArrowUpRight, CheckCircle, 
  MapPin, Shield, Star, Clock, Calendar, MessageSquare, Ship
} from 'lucide-react';
import { 
  BRAND_NAME, BRAND_TAGLINE, BRAND_DESCRIPTION, 
  SERVICES, WHY_CHOOSE_US, SHIPPING_PROCESS, TESTIMONIALS, BLOGS, CONTACT_INFO 
} from '@/constants';
import StatCounters from '@/components/StatCounters';
import TrustedBrands from '@/components/TrustedBrands';
import WorldMap from '@/components/WorldMap';
import FAQAccordion from '@/components/FAQAccordion';
import GallerySection from '@/components/GallerySection';
import HeroSection from '@/components/HeroSection';

export default function HomePage() {
  const [activeProcess, setActiveProcess] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);
  const [dynamicFAQs, setDynamicFAQs] = useState([]);
  const [dynamicSlides, setDynamicSlides] = useState([]);
  const [dynamicServices, setDynamicServices] = useState(SERVICES);

  // Fetch testimonials, FAQs, Hero Slides, and Services from API, fallback to constants if empty/fails
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials?all=true');
        const data = await res.json();
        if (res.ok && data.success && data.testimonials && data.testimonials.length > 0) {
          setDynamicTestimonials(data.testimonials);
        } else {
          setDynamicTestimonials(TESTIMONIALS);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials, falling back to static constants:', error);
        setDynamicTestimonials(TESTIMONIALS);
      }
    };

    const fetchFAQs = async () => {
      try {
        const res = await fetch('/api/faqs?all=true');
        const data = await res.json();
        if (res.ok && data.success && data.faqs && data.faqs.length > 0) {
          setDynamicFAQs(data.faqs);
        } else {
          setDynamicFAQs(FAQS);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs, falling back to static constants:', error);
        setDynamicFAQs(FAQS);
      }
    };

    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/hero-slides?all=true');
        const data = await res.json();
        if (res.ok && data.success && data.slides && data.slides.length > 0) {
          setDynamicSlides(data.slides);
        }
      } catch (error) {
        console.error('Failed to fetch hero slides, falling back to static constants:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services?status=active&limit=6');
        const data = await res.json();
        if (data.success && data.services && data.services.length > 0) {
          const mapped = data.services.map((s) => {
            const staticMatch = SERVICES.find(
              (staticSrv) => staticSrv.id === s.slug || staticSrv.title.toLowerCase() === s.title.toLowerCase()
            );
            return {
              id: s.slug,
              title: s.title,
              description: s.shortDescription,
              image: s.image || '/images/international-courier.svg',
              benefits: staticMatch?.benefits || [
                "Customs clearance assistance",
                "End-to-end real-time tracking",
                "Express delivery guarantees",
                "Secure tamper-proof packaging"
              ],
              icon: staticMatch?.icon || Ship,
            };
          });
          setDynamicServices(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch services, falling back to static constants:', error);
      }
    };

    fetchTestimonials();
    fetchFAQs();
    fetchSlides();
    fetchServices();
  }, []);

  // Auto-play the Shipping Process steps every 4 seconds and auto-scroll active button into view (container-only)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProcess((prev) => (prev + 1) % SHIPPING_PROCESS.length);
    }, 4000);

    const activeBtn = document.getElementById(`step-btn-${activeProcess}`);
    if (activeBtn) {
      const container = activeBtn.parentElement;
      if (container) {
        const containerWidth = container.offsetWidth;
        const btnOffsetLeft = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;
        container.scrollTo({
          left: btnOffsetLeft - containerWidth / 2 + btnWidth / 2,
          behavior: 'smooth'
        });
      }
    }

    return () => clearInterval(interval);
  }, [activeProcess]);

  return (
    <div className="relative overflow-x-hidden bg-background">
      
      {/* 1. HERO SECTION */}
      <HeroSection slides={dynamicSlides} />

      {/* 2. STATS SECTION */}
      <section className="py-2 sm:py-16 relative z-10 px-6 md:px-8 bg-slate-50/20 border-b border-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <StatCounters />
        </div>
      </section>

      {/* 3. TRUSTED BRANDS MARQUEE */}
      <section className="bg-background">
        <TrustedBrands />
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-6 sm:py-8 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-dark mt-4">
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
              <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-dark mt-4">
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
            {dynamicServices.slice(0, 6).map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-[20px] sm:rounded-[24px] border border-black/[0.04] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 w-[230px] sm:w-[300px] md:w-auto shrink-0 snap-align-start"
                >
                  {/* Service Image */}
                  <div className="h-32 sm:h-44 overflow-hidden relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                    
                    {/* Floating Icon */}
                    <div className="absolute bottom-3 left-4 w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-lg text-primary">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="font-heading font-bold text-base sm:text-xl text-dark mb-1 sm:mb-2">{service.title}</h3>
                    <p className="text-dark/60 text-[11px] sm:text-sm leading-relaxed mb-4 h-12 overflow-hidden">
                      {service.description}
                    </p>
                    <ul className="flex flex-col gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                      {service.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-dark/70 truncate">
                          <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success shrink-0" />
                          <span className="truncate">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/services/${service.id}`}
                      className="btn-outline w-full flex items-center justify-center gap-2 text-xs sm:text-sm py-2 sm:py-3"
                    >
                      View Details
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
      <section className="py-6 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
          
          <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-dark mt-4">
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
                id={`step-btn-${idx}`}
                onClick={() => setActiveProcess(idx)}
                className={`whitespace-nowrap flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl text-left transition-all duration-300 focus:outline-none shrink-0 snap-align-start border ${
                  activeProcess === idx
                    ? 'bg-primary/5 border-primary/30 text-primary font-bold shadow-sm'
                    : 'bg-transparent border-transparent text-dark/65 hover:bg-slate-50 hover:text-dark'
                }`}
              >
                <span className={`font-numbers font-black text-sm lg:text-lg transition-colors mr-1 ${
                  activeProcess === idx ? 'text-primary' : 'text-dark/30'
                }`}>{idx + 1}</span>
                <span className="font-heading font-bold text-xs lg:text-base">{step.title}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 bg-dark text-white rounded-2xl p-6 sm:p-8 min-h-[250px] sm:min-h-[300px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProcess}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex-1 flex flex-col justify-between h-full"
              >
                <div>
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-widest font-heading">
                    Step {activeProcess + 1} details
                  </span>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl mt-1 text-white">
                    {SHIPPING_PROCESS[activeProcess].title}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed mt-4 max-w-md">
                    {SHIPPING_PROCESS[activeProcess].description}. We employ state-of-the-art checkpoints to ensure your items are categorized, routed, and delivered strictly on schedule.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-secondary mt-8 pt-4 border-t border-white/5 w-full">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Full cargo insurance coverage applicable at this stage.</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 7. GLOBAL COVERAGE */}
      <section className="py-12 bg-dark text-white px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
          
            <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-white mt-4">
              Real-time Global Connectivity
            </h2>
            <p className="text-white/60 text-base mt-4">
              Connecting local businesses in Gujarat directly with the global markets. Our active flights handle freight transits round the clock.
            </p>
          </div>

          <WorldMap />
        </div>
      </section>

      {/* GALLERY SECTION */}
      <GallerySection />

      {/* 8. TESTIMONIALS */}
      <section className="py-6 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
      
          <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-dark mt-4">
            What Our Shippers Say
          </h2>
        </div>

        <div 
          className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-6 md:pb-0 px-6 -mx-6 md:px-0 md:mx-0 scrollbar-none snap-x snap-mandatory"
          onScroll={(e) => {
            const scrollLeft = e.target.scrollLeft;
            const cardWidth = 290 + 24; // card width + gap
            const activeIdx = Math.min(
              dynamicTestimonials.length - 1,
              Math.max(0, Math.round(scrollLeft / cardWidth))
            );
            setActiveTestimonial(activeIdx);
          }}
        >
          {dynamicTestimonials.map((t, idx) => (
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
                  src={t.image || '/images/user-avatar.svg'}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-black/10 bg-slate-100"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/images/user-avatar.svg'; }}
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
          {dynamicTestimonials.map((_, idx) => (
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
            
            <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-dark mt-4">
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
      <section className="py-6 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
         
          <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-dark mt-4">
            Frequently Asked Questions
          </h2>
        </div>

        <FAQAccordion faqs={dynamicFAQs} />
      </section>

      {/* 11. CALL TO ACTION */}
      <section className="relative mx-4 sm:mx-8 mb-6 sm:mb-10 overflow-hidden rounded-[32px] bg-dark text-white border border-white/5 shadow-2xl py-6 sm:py-6">
        {/* Glow Spheres */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[80px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/15 rounded-full blur-[80px] pointer-events-none"
        />

        {/* Diagonal Tech Grid Lines */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Floating Cargo Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute left-10 top-12 text-white/5 hidden md:block"
        >
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          className="absolute right-12 bottom-12 text-white/5 hidden md:block"
        >
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-6">
          
          
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-2xl">
            Ready to Route Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Worldwide Delivery?</span>
          </h2>
          
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed">
            Get instant competitive pricing, door pickup collection, and secure document clearance packages today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 w-full sm:w-auto px-4 sm:px-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/contact"
                className="btn-secondary w-full text-center block shadow-lg shadow-secondary/20"
              >
                Book Your Shipment Now
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/contact"
                className="btn-outline-white w-full text-center block"
              >
                Contact Support
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
