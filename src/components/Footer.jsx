"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Mail, Phone, MapPin, Clock, ArrowRight, Heart } from 'lucide-react';
import { BRAND_NAME, CONTACT_INFO, NAV_LINKS, SERVICES } from '@/constants';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-dark text-white border-t border-white/5 pt-20 pb-8 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-white/5">
          
          {/* Brand & Newsletter Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="self-start">
              <img 
                src="/veer-international-logo.png" 
                alt="VEER International Logo" 
                className="h-12 w-auto object-contain hover:scale-102 transition-all duration-300"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Premium international logistics and express cargo shipping solutions connecting Ahmedabad to the world.
            </p>
            
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 mt-2">
              <span className="text-sm font-semibold text-white/90">Subscribe to our newsletter</span>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-success"
                >
                  Thank you! You have subscribed successfully.
                </motion.p>
              )}
            </form>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6 lg:pl-8">
            <h3 className="font-heading font-bold text-base uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-white/60 hover:text-secondary text-sm transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-secondary text-sm transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/60 hover:text-secondary text-sm transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Quicklist */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-bold text-base uppercase tracking-wider text-white">Our Services</h3>
            <ul className="flex flex-col gap-3">
              {SERVICES.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link href="/services" className="text-white/60 hover:text-secondary text-sm transition-colors duration-300">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Map */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-bold text-base uppercase tracking-wider text-white">Get in Touch</h3>
            <ul className="flex flex-col gap-4 text-sm text-white/60">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex gap-3 items-start">
                <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.hours}</span>
              </li>
            </ul>

            {/* Embedded Google Map */}
            <div className="w-full h-24 rounded-xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 border border-white/10">
              <iframe
                src={CONTACT_INFO.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VEER Logistics Location Map"
              />
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All Rights Reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-error fill-error animate-pulse" />
            <span>for Premium Global Delivery.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
