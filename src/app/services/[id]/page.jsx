import { SERVICES } from '@/constants';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, ShieldCheck, Mail, Phone, 
  Clock, ArrowRight, MessageSquare, Ship, Award, HelpCircle
} from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;

  // 1. Try to find the service in the database first
  let service = null;
  let isStatic = false;

  try {
    const dbService = await prisma.service.findFirst({
      where: {
        slug: id,
        status: true,
      },
    });

    if (dbService) {
      service = {
        title: dbService.title,
        slug: dbService.slug,
        shortDescription: dbService.shortDescription,
        description: dbService.description,
        image: dbService.image,
        benefits: [
          "Customs clearance assistance",
          "End-to-end real-time tracking",
          "Express delivery timeline guarantees",
          "Dedicated 24/7 client support"
        ], // Default benefits for database-added items
      };
    }
  } catch (error) {
    console.error('Error fetching service from database:', error);
  }

  // 2. If not found in database, check the static SERVICES constant
  if (!service) {
    const staticService = SERVICES.find((s) => s.id === id);
    if (staticService) {
      isStatic = true;
      service = {
        title: staticService.title,
        slug: staticService.id,
        shortDescription: staticService.description,
        description: staticService.description,
        image: staticService.image,
        benefits: staticService.benefits || [],
      };
    }
  }

  if (!service) {
    notFound();
  }

  // Resolve icon or fallback
  let IconComponent = ShieldCheck;
  if (isStatic) {
    const staticSrv = SERVICES.find((s) => s.id === id);
    if (staticSrv && staticSrv.icon) {
      IconComponent = staticSrv.icon;
    }
  } else {
    IconComponent = Ship;
  }

  return (
    <div className="bg-background pb-24">
      {/* 1. HERO HEADER */}
      <section className="bg-dark text-white pt-36 pb-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back button */}
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4">
                <IconComponent className="w-3.5 h-3.5 text-secondary" />
                Service Logistics
              </span>
              <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
                {service.title}
              </h1>
              <p className="text-white/60 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
                {service.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DETAIL CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Info Column */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Visual Image Banner */}
          {service.image && (
            <div className="rounded-3xl overflow-hidden border border-black/[0.04] shadow-premium max-h-[420px] relative bg-black/5">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover max-h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-2xl text-dark">Service Overview</h2>
            <div className="text-dark/70 text-base leading-relaxed whitespace-pre-wrap space-y-4">
              {service.description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          <div className="bg-black/[0.01] border border-black/[0.03] rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark">What's Included in {service.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-black/[0.03] shadow-sm">
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm text-dark/80 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 self-start">
          
          {/* Booking Card */}
          <div className="bg-white rounded-3xl border border-black/[0.04] p-6 shadow-premium space-y-6">
            <h3 className="font-heading font-bold text-lg text-dark">Book Your Cargo</h3>
            <p className="text-xs text-dark/60 leading-relaxed">
              Book this shipment or get in touch for custom commercial contracts, packaging guidelines, and price estimations.
            </p>
            
            <div className="space-y-3">
              <Link 
                href={`/contact?service=${service.slug}`}
                className="btn-primary w-full flex items-center justify-center gap-2 text-center"
              >
                Inquire For This Service
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                href="/tracking" 
                className="btn-outline w-full flex items-center justify-center gap-2 text-center"
              >
                Track Current Order
              </Link>
            </div>
          </div>

          {/* Support Channels Card */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h4 className="font-heading font-bold text-sm text-dark uppercase tracking-wider">Quick Support</h4>
            
            <div className="space-y-3.5">
              <a 
                href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} 
                className="flex items-center gap-3.5 text-sm font-semibold text-dark/80 hover:text-primary transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <span>{CONTACT_INFO.phone}</span>
              </a>

              <a 
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3.5 text-sm font-semibold text-dark/80 hover:text-success transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <span>WhatsApp Live Chat</span>
              </a>

              <a 
                href={`mailto:${CONTACT_INFO.email}`} 
                className="flex items-center gap-3.5 text-sm font-semibold text-dark/80 hover:text-primary transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <span className="truncate">{CONTACT_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
