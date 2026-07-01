export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            Last Updated: June 29, 2026. Understand how VEER International gathers and protects client details.
          </p>
        </div>
      </section>

      {/* Terms Body */}
      <section className="max-w-4xl mx-auto px-6 mt-16 text-dark/70 leading-relaxed text-sm md:text-base flex flex-col gap-8">
        
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">1. Data Collection</h2>
          <p>
            We collect personal identity credentials (name, email, phone number, and physical coordinates of pick-up and delivery locations) solely for generating customs documents, scheduling cargo flights, and finalizing booking transactions.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">2. GPS Coordinates Tracking</h2>
          <p>
            Our mobile application and web-based tracking dashboard retrieve and map GPS location data of active transit trucks and flight cargo lanes to feed live status coordinates to clients.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">3. Data Sharing</h2>
          <p>
            We do not share your confidential files or addresses with external third-party advertisers. Data is exclusively shared with authorized airline carriers, destination customs clearance terminals, and last-mile delivery agents (like DHL, UPS, FedEx, or Aramex) to fulfill delivery logs.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">4. Security Infrastructure</h2>
          <p>
            All submitted payloads, including payment details and booking inquiries, undergo SSL encryption during transmission. Storage servers utilize enterprise firewall logs to block unauthorized breaches.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl text-dark mb-4">5. Customer Rights</h2>
          <p>
            You retain the right to query, alter, or purge your shipper records from our systems by dropping an email to our support desk: <code className="text-primary font-bold">info@veerlogistics.com</code>.
          </p>
        </div>

      </section>
    </div>
  );
}
