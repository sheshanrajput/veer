"use client";
import { motion } from 'framer-motion';
import { Shield, Eye, Flame, Award, Globe, Navigation, AwardIcon } from 'lucide-react';
import Link from 'next/link';

const TIMELINE_EVENTS = [
  { year: "2016", title: "Inception in Ahmedabad", desc: "Started as a domestic agent with a team of 4, securing cargo networks across Gujarat." },
  { year: "2018", title: "Global Expansion Contracts", desc: "Partnered with global logistics giants (DHL, FedEx, UPS) to initiate international shipping services." },
  { year: "2020", title: "Customs Clearance Authorization", desc: "Authorized as a direct customs agent at Ahmedabad Air Cargo, reducing delivery turn-around times by 24h." },
  { year: "2023", title: "Express Pharma Line Launch", desc: "Launched cold-chain medicine shipping to USA, UK, and Europe, meeting strict FDA criteria." },
  { year: "2026", title: "Digital Integration", desc: "Integrated digital live transponder systems and APIs for automated B2B customer bookings." }
];

export default function AboutPage() {
  return (
    <div className="bg-background pb-24">
      {/* 1. HERO SECTION */}
      <section className="bg-dark text-white pt-36 pb-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
            Our Legacy
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Delivering Trust Worldwide
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            VEER International is Gujarat's premier logistics firm. We bridge geography to deliver your packets with speed and integrity.
          </p>
        </div>
      </section>

      {/* 2. COMPANY STORY & FOUNDER STATEMENT */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/5 px-3.5 py-1.5 rounded-full self-start">
            Our Journey
          </span>
          <h2 className="font-heading font-bold text-xl sm:text-3xl md:text-4xl text-dark">
            From Ahmedabad to the World Stage
          </h2>
          <p className="text-dark/70 text-sm md:text-base leading-relaxed">
            Founded with the vision of offering hassle-free international courier services in Gujarat, VEER International has grown into a highly trusted logistics powerhouse. Operating from our central headquarters in Ahmedabad, we consolidate parcels, manage custom operations, and dispatch goods globally with zero complexity.
          </p>
          <p className="text-dark/70 text-sm md:text-base leading-relaxed">
            Whether it's student luggage traveling to Canada, crucial documents to London, or bulk air cargo containers destined for New York, we handle every parcel with absolute precision.
          </p>
          
          <div className="border-l-4 border-primary pl-4 py-2 italic text-dark/80 bg-primary/5 rounded-r-xl">
            "We do not just ship containers and boxes. We ship hope, support, and critical timelines that our clients trust us with daily."
            <span className="block text-xs font-bold font-heading text-dark/60 mt-2 not-italic">— Veer Patel, Founder & Managing Director</span>
          </div>
        </div>

        {/* Story Illustration Grid */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <img
            src="/images/parcel-packing.svg"
            alt="Logistics Warehouse Operations"
            className="rounded-2xl h-60 w-full object-cover shadow-lg"
          />
          <img
            src="/images/air-cargo.svg"
            alt="Cargo Aircraft Loader"
            className="rounded-2xl h-60 w-full object-cover shadow-lg mt-8"
          />
        </div>
      </section>

      {/* 3. MISSION, VISION & VALUES */}
      <section className="bg-dark-light/5 py-20 border-y border-black/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mission */}
            <div className="bg-white rounded-[24px] border border-black/[0.04] p-8 shadow-premium flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark">Our Mission</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                To simplify international shipping for businesses and individuals by delivering time-definite logistics services with premium support.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-[24px] border border-black/[0.04] p-8 shadow-premium flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark">Our Vision</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                To become the most reliable and technology-advanced logistics partner in India, known globally for integrity, speed, and premium service.
              </p>
            </div>

            {/* Core Values */}
            <div className="bg-white rounded-[24px] border border-black/[0.04] p-8 shadow-premium flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent-dark flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark">Core Values</h3>
              <p className="text-dark/70 text-sm leading-relaxed">
                Honesty, customer priority, transparent communication, environmental consciousness, and absolute security for every package.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CHRONOLOGICAL TIMELINE */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <h2 className="font-heading font-bold text-xl sm:text-3xl text-center text-dark mb-16">Milestones of Progress</h2>
        <div className="relative border-l-2 border-black/10 pl-6 md:pl-10 ml-4 flex flex-col gap-12">
          {TIMELINE_EVENTS.map((event, idx) => (
            <div key={idx} className="relative">
              {/* Pulsing indicator */}
              <span className="absolute -left-[35px] md:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-sm flex items-center justify-center" />
              
              <div>
                <span className="font-numbers font-black text-xl text-primary">{event.year}</span>
                <h3 className="font-heading font-bold text-lg text-dark mt-1">{event.title}</h3>
                <p className="text-dark/60 text-sm mt-1 leading-relaxed">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MEET OUR LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 border-t border-black/[0.04]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-xl sm:text-3xl md:text-4xl text-dark">Logistics Experts</h2>
          <p className="text-dark/60 text-sm mt-3">
            Our expert team in Ahmedabad manages airline partnerships, custom guidelines, and B2B shipments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card rounded-[24px] p-6 text-center">
            <img
              src="/images/user-avatar.svg"
              alt="Veer Patel"
              className="w-24 h-24 rounded-full object-cover mx-auto border border-black/10 mb-4"
            />
            <h3 className="font-heading font-bold text-lg text-dark">Veer Patel</h3>
            <p className="text-xs text-primary font-semibold">Founder & MD</p>
            <p className="text-dark/60 text-xs mt-3 leading-relaxed">
              Logistics specialist with 15+ years managing customs clearing hubs.
            </p>
          </div>

          <div className="glass-card rounded-[24px] p-6 text-center">
            <img
              src="/images/user-avatar.svg"
              alt="Meera Shah"
              className="w-24 h-24 rounded-full object-cover mx-auto border border-black/10 mb-4"
            />
            <h3 className="font-heading font-bold text-lg text-dark">Meera Shah</h3>
            <p className="text-xs text-primary font-semibold">Head of Customs Operations</p>
            <p className="text-dark/60 text-xs mt-3 leading-relaxed">
              Handles direct clearances at domestic air terminals and FDA document submissions.
            </p>
          </div>

          <div className="glass-card rounded-[24px] p-6 text-center">
            <img
              src="/images/user-avatar.svg"
              alt="Rajesh Varma"
              className="w-24 h-24 rounded-full object-cover mx-auto border border-black/10 mb-4"
            />
            <h3 className="font-heading font-bold text-lg text-dark">Rajesh Varma</h3>
            <p className="text-xs text-primary font-semibold">Global Network Director</p>
            <p className="text-dark/60 text-xs mt-3 leading-relaxed">
              Maintains relationships with air cargo channels in US, UK, and European zones.
            </p>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="relative mx-4 sm:mx-8 mb-16 sm:mb-24 overflow-hidden rounded-[32px] bg-dark text-white border border-white/5 shadow-2xl py-16 sm:py-24">
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
            Get an instant custom quote including taxes and customs advice. Free door pickup collection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 w-full sm:w-auto px-4 sm:px-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/contact"
                className="btn-secondary w-full text-center block shadow-lg shadow-secondary/20"
              >
                Calculate Freight Cost
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/contact"
                className="btn-outline-white w-full text-center block"
              >
                Talk to Our Team
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
