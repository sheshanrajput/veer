"use client";
import { motion } from 'framer-motion';
import { SERVICES, SHIPPING_PROCESS } from '@/constants';
import Link from 'next/link';
import { CheckCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="bg-background pb-24">
      {/* 1. HERO SECTION */}
      <section className="bg-dark text-white pt-36 pb-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
            Logistics Solutions
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Our Shipping Services
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            From critical business documents to heavy manufacturing machinery, we provide custom routes and timelines that match your budget.
          </p>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx % 3 * 0.1 }}
                className="group bg-white rounded-[24px] border border-black/[0.04] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Service Graphic Banner */}
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
                    
                    {/* Floating Icon Box */}
                    <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-white text-primary flex items-center justify-center shadow-lg">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Core Service specs */}
                  <div className="p-6">
                    <h2 className="font-heading font-bold text-xl text-dark mb-3">{service.title}</h2>
                    <p className="text-dark/60 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                    
                    {/* Benefits checklist */}
                    <ul className="flex flex-col gap-2.5">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-dark/70 leading-normal">
                          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/inquiry?service=${service.id}`}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Book This Shipment
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. STEP BY STEP TIMELINE */}
      <section className="bg-dark text-white py-12 px-6 md:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
              Work Process
            </span>
            <h2 className="font-heading font-bold text-xl sm:text-3xl md:text-4xl text-white mt-4">
              How VEER Handles Shipments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-8 items-start relative">
            {SHIPPING_PROCESS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative z-10 lg:col-span-1">
                <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary text-white flex items-center justify-center font-numbers font-black text-sm mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-white">{step.title}</h3>
                <p className="text-[10px] text-white/50 mt-1 leading-normal hidden md:block">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRICING CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 py-20">
        <div className="glass-card rounded-[32px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-left">
            <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center border border-success/20 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-dark">Need Custom Pricing?</h2>
            <p className="text-dark/60 text-sm mt-2 leading-relaxed">
              We offer bespoke contracts for corporate businesses, local manufacturing hubs, and regular e-commerce exporters. Save up to 35% on standard shipping costs.
            </p>
          </div>

          <div className="flex gap-4 w-full lg:w-auto shrink-0 flex-wrap">
            <Link
              href="/inquiry"
              className="btn-primary w-full sm:w-auto text-center"
            >
              Get Custom Quote
            </Link>
            <Link
              href="/contact"
              className="btn-outline w-full sm:w-auto text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
