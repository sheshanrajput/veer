export default function TermsPage() {
  return (
    <div className="bg-background pb-24">
      {/* Hero */}
      <section className="bg-dark text-white pt-36 pb-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
            Legal
          </span>
          <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            Last Updated: June 29, 2026. Review rules, cargo liabilities, and shipping covenants of VEER International.
          </p>
        </div>
      </section>

      {/* Terms Body */}
      <section className="max-w-4xl mx-auto px-6 mt-16 text-dark/70 leading-relaxed text-sm md:text-base flex flex-col gap-8">
        
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">1. Packing Compliance</h2>
          <p>
            The shipper is responsible for ensuring that all contents are securely packaged and comply with airline guidelines. Prohibited items, including hazardous materials, weapons, and illicit substances, will be flagged and held at the Ahmedabad warehouse.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">2. Customs Clearance & Duties</h2>
          <p>
            VEER International facilitates customs clearances. Any import duties, tax charges, or local port fees levied by the destination country's customs authority must be paid by the receiver, unless otherwise arranged in a custom DDP agreement.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">3. Delivery Timelines</h2>
          <p>
            Delivery dates are estimated and are subject to flight operations, customs processes, and weather conditions. VEER is not liable for indirect losses caused by flight delays.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">4. Liability & Insurance</h2>
          <p>
            Standard shipping covers limited liability for loss or damage. We highly recommend obtaining optional transit insurance for high-value items, calculated based on the declared cargo value.
          </p>
        </div>

      </section>
    </div>
  );
}
