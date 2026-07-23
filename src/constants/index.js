import { 
  Globe, Package, Plane, Truck, ShieldCheck, Clock, Navigation, 
  DollarSign, FileText, Briefcase, HeartHandshake, ShieldAlert 
} from 'lucide-react';

export const BRAND_NAME = "VEER International Express Courier & Cargo";
export const BRAND_TAGLINE = "Fast. Secure. Worldwide Delivery.";
export const BRAND_DESCRIPTION = "Your trusted international courier and cargo partner based in Ahmedabad, delivering trust across the globe with speed and reliability.";

export const CONTACT_INFO = {
  phone: "+91 79 4005 1234",
  whatsapp: "+91 9876543210",
  email: "info@veerlogistics.com",
  address: "102-105, Shanti Mall, Near S.G. Highway, Ahmedabad, Gujarat 380054",
  hours: "Mon - Sat: 09:00 AM - 08:00 PM, Sunday: Closed",
  socials: {
    facebook: "https://facebook.com/veerlogistics",
    twitter: "https://twitter.com/veerlogistics",
    linkedin: "https://linkedin.com/company/veerlogistics",
    instagram: "https://instagram.com/veerlogistics"
  },
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.597148560877!2d72.50616147610668!3d23.03855217916243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcca9d6a2f76846!2sSola%20Road%20%26%20SG%20Highway%20Intersection!5e0!3m2!1sen!2sin!4v1719600000000!5m2!1sen!2sin"
};

export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Tracking", path: "/tracking" },
  { name: "About Us", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" }
];

export const COUNTRIES = [
  { code: "US", name: "United States", zone: "Zone A" },
  { code: "GB", name: "United Kingdom", zone: "Zone B" },
  { code: "AE", name: "United Arab Emirates", zone: "Zone C" },
  { code: "DE", name: "Germany", zone: "Zone B" },
  { code: "CA", name: "Canada", zone: "Zone A" },
  { code: "AU", name: "Australia", zone: "Zone D" },
  { code: "SG", name: "Singapore", zone: "Zone C" },
  { code: "SA", name: "Saudi Arabia", zone: "Zone C" },
  { code: "FR", name: "France", zone: "Zone B" },
  { code: "JP", name: "Japan", zone: "Zone D" },
  { code: "NL", name: "Netherlands", zone: "Zone B" },
  { code: "NZ", name: "New Zealand", zone: "Zone D" }
];

export const SERVICES = [
  {
    id: "international-courier",
    title: "International Courier",
    description: "Reliable and fast door-to-door courier service for documents and parcels worldwide.",
    icon: Globe,
    benefits: [
      "Customs clearance assistance",
      "End-to-end real-time tracking",
      "Express delivery within 3-5 business days",
      "Secure tamper-proof packaging"
    ],
    image: "/images/international-courier.svg"
  },
  {
    id: "document-courier",
    title: "Document Courier",
    description: "Express and highly confidential handling for critical business documents and passports.",
    icon: FileText,
    benefits: [
      "Priority shipping lane",
      "Tamper-evident document pouches",
      "Signature on delivery required",
      "Next-day delivery available in major hubs"
    ],
    image: "/images/document-courier.svg"
  },
  {
    id: "express-delivery",
    title: "Express Delivery",
    description: "Time-definite international deliveries with guaranteed speed and custom-fit routes.",
    icon: Clock,
    benefits: [
      "Money-back delivery guarantee",
      "24/7 dedicated support desk",
      "Priority boarding on international cargo flights",
      "Immediate delivery notifications"
    ],
    image: "/images/express-delivery.svg"
  },
  {
    id: "air-cargo",
    title: "Air Cargo",
    description: "Global air freight services for heavy machinery, fragile parts, and bulk shipments.",
    icon: Plane,
    benefits: [
      "Charter flights and consolidation options",
      "Specialized oversized cargo handling",
      "DDP & DDU custom clearance terms",
      "Airport-to-airport & airport-to-door delivery"
    ],
    image: "/images/air-cargo.svg"
  },
  {
    id: "commercial-cargo",
    title: "Commercial Cargo",
    description: "Tailored supply chain and freight forwarding services for commercial exporters.",
    icon: Briefcase,
    benefits: [
      "Complete import/export documentation setup",
      "Multi-modal transit capabilities",
      "Sea-Air combined shipping solutions",
      "Warehousing and consolidation services"
    ],
    image: "/images/air-cargo.svg"
  },
  {
    id: "door-pickup",
    title: "Door Pickup Service",
    description: "Convenient parcel pickup right from your home or warehouse across Ahmedabad.",
    icon: Truck,
    benefits: [
      "Free scheduled pickup",
      "Weighing and documentation at your doorstep",
      "Instant consignment note generation",
      "Flexible pickup windows"
    ],
    image: "/images/express-delivery.svg"
  },
  {
    id: "parcel-packing",
    title: "Parcel Packing",
    description: "Professional, export-grade packaging solutions ensuring transit durability.",
    icon: ShieldCheck,
    benefits: [
      "Double-walled cardboard boxes",
      "Wooden crating for fragile goods",
      "Vacuum sealing for food items",
      "Strict compliance with airline packaging rules"
    ],
    image: "/images/parcel-packing.svg"
  },
  {
    id: "business-shipping",
    title: "Business Shipping",
    description: "End-to-end logistics solutions customized for corporate entities and manufacturers.",
    icon: HeartHandshake,
    benefits: [
      "Dedicated account managers",
      "Volume-based corporate discounts",
      "Custom API integration for order tracking",
      "Consolidated monthly invoicing"
    ],
    image: "/images/document-courier.svg"
  },
  {
    id: "medicine-delivery",
    title: "Medicine Delivery",
    description: "Safe, speed-focused shipping of life-saving medicines with cold-chain features.",
    icon: ShieldAlert,
    benefits: [
      "FDA documentation assistance",
      "Temperature-controlled packaging options",
      "Express priority custom clearance",
      "Daily dispatch to Europe, USA, and GCC"
    ],
    image: "/images/medicine-delivery.svg"
  },
  {
    id: "student-parcel",
    title: "Student Parcel",
    description: "Specially discounted excess baggage and document courier for university students.",
    icon: Package,
    benefits: [
      "Up to 25% student discount",
      "Books and personal items packaging",
      "University application document courier",
      "Free home pickup"
    ],
    image: "/images/parcel-packing.svg"
  },
  {
    id: "ecommerce-logistics",
    title: "E-commerce Logistics",
    description: "Direct-to-consumer international shipping for local e-commerce brands.",
    icon: Navigation,
    benefits: [
      "Seamless Shopify & WooCommerce plugins",
      "Low weight-break rates",
      "Automated returns processing",
      "Full API visibility for buyers"
    ],
    image: "/images/express-delivery.svg"
  },
  {
    id: "import-export",
    title: "Import Export Logistics",
    description: "B2B import/export facilitation including customs clearance at Ahmedabad Air Cargo.",
    icon: DollarSign,
    benefits: [
      "Customs house agent (CHA) services",
      "Duty computation and advisory",
      "Temporary import/export bonding",
      "Fast clearance for air freights"
    ],
    image: "/images/international-courier.svg"
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "International Courier",
    description: "Seamless global shipping network covering over 220+ countries and territories.",
    icon: Globe
  },
  {
    title: "Door Pickup",
    description: "Hassle-free collection from your home, office or warehouse in Ahmedabad.",
    icon: Truck
  },
  {
    title: "Air Cargo",
    description: "Swift air freight services with priority airline cargo space bookings.",
    icon: Plane
  },
  {
    title: "Express Delivery",
    description: "Time-sensitive packages reach their global destinations via the fastest routes.",
    icon: Clock
  },
  {
    title: "Business Shipping",
    description: "Bespoke corporate logistics contracts with discounted freight rates.",
    icon: HeartHandshake
  },
  {
    title: "Secure Packaging",
    description: "Double-walled boxes, bubble wrap and professional crating for absolute safety.",
    icon: ShieldCheck
  },
  {
    title: "Live Tracking",
    description: "End-to-end updates from Ahmedabad dispatch directly to customer delivery.",
    icon: Navigation
  },
  {
    title: "Affordable Pricing",
    description: "Competitive international rates with transparent pricing and no hidden costs.",
    icon: DollarSign
  },
  {
    title: "Transit Insurance",
    description: "Optional financial safety cover to secure high-value shipments against loss.",
    icon: ShieldAlert
  },
  {
    title: "Fast Support",
    description: "Dedicated account support team available via phone, email, and WhatsApp.",
    icon: Clock
  }
];

export const SHIPPING_PROCESS = [
  { title: "Booking", description: "Submit details online or call us" },
  { title: "Pickup", description: "Free parcel collection from your doorstep" },
  { title: "Packaging", description: "Export-grade safety layering & weighing" },
  { title: "Warehouse", description: "Sorting and custom document preparation" },
  { title: "Flight Dispatch", description: "Express flight departure from Ahmedabad" },
  { title: "Destination Country", description: "Port of entry landing and verification" },
  { title: "Customs Clearance", description: "Import duties processing and approval" },
  { title: "Out for Delivery", description: "Handed over to the local last-mile courier" },
  { title: "Delivered", description: "Safe delivery and digital signature capture" }
];

export const TESTIMONIALS = [
  {
    name: "Rajesh Patel",
    role: "Founder, Patel Exports Ltd.",
    quote: "VEER International has transformed our commercial exports. Their custom clearance in Ahmedabad is incredibly fast, and cargo reaches our clients in Germany within 4 days. Absolutely reliable!",
    rating: 5,
    image: "/images/user-avatar.svg"
  },
  {
    name: "Dr. Ananya Sharma",
    role: "Individual Sender",
    quote: "I sent critical medicines to my son studying in the USA. The temperature-sensitive parcel was delivered safely on time. The support team walked me through all the FDA documents.",
    rating: 5,
    image: "/images/user-avatar.svg"
  },
  {
    name: "Karan Mehta",
    role: "CEO, Ahmedabad E-commerce Hub",
    quote: "Our e-commerce boutique ships garments globally. VEER's automated tracking API integration makes it easy for our clients to track their packages. Excellent bulk rates too!",
    rating: 5,
    image: "/images/user-avatar.svg"
  },
  {
    name: "Sneha Vyas",
    role: "Student, University of Toronto",
    quote: "Their student discount is a lifesaver. I shipped two heavy suitcases of personal luggage from Ahmedabad to Canada. The price was very reasonable and it arrived without a scratch.",
    rating: 5,
    image: "/images/user-avatar.svg"
  }
];

export const FAQS = [
  {
    question: "What documents are required to ship goods internationally?",
    answer: "For commercial cargo, you require an IEC (Import Export Code), GST certificate, Commercial Invoice, and Packing List. For individual parcels (e.g. personal items, food, or medicines), you require a Sender's ID proof (Aadhar/Passport) and a detailed list of contents. Medicine shipping also requires a doctor's prescription and medical invoice."
  },
  {
    question: "How long does it take for a shipment to reach the US or UK?",
    answer: "Express deliveries to the US, UK, and European countries take approximately 3-5 business days. Economy shipping options take 7-10 business days. Transit time starts after the package clears customs dispatch at Ahmedabad Airport."
  },
  {
    question: "Do you offer home pickup in Ahmedabad?",
    answer: "Yes, we offer free home and office pickup services anywhere in Ahmedabad, Gandhinagar, and nearby industrial zones. Our pickup agent will carry a portable weighing scale and prepare documentation on the spot."
  },
  {
    question: "What items are prohibited from international shipping?",
    answer: "Prohibited items include aerosols, inflammable liquids, currency, batteries, hazardous chemicals, weapons, perishables, and specific drugs prohibited by international air laws. Feel free to contact our support team for a full check list."
  },
  {
    question: "Are customs duties included in the shipping quotation?",
    answer: "Generally, shipping quotes are for freight and door-delivery (DDU - Delivery Duty Unpaid). Import duties, taxes, and octroi are assessed by customs of the destination country and must be paid by the recipient. However, we can also arrange DDP (Delivered Duty Paid) shipments upon request."
  },
  {
    question: "Does VEER provide transit insurance?",
    answer: "Yes. We offer optional transit insurance to safeguard your package against accidental damage or loss in transit. The premium is calculated based on the declared value of the items being shipped."
  }
];

export const STATS = [
  { value: "220+", label: "Countries Served" },
  { value: "1.2M+", label: "Parcels Delivered" },
  { value: "99.8%", label: "Success Rate" },
  { value: "15k+", label: "Happy Customers" },
  { value: "10+", label: "Years Experience" },
  { value: "24/7", label: "Support Availability" }
];

export const BLOGS = [
  {
    title: "Navigating New Custom Clearance Regulations for E-commerce in 2026",
    summary: "Understand the updated duty thresholds, digital filings, and compliance strategies for seamless international shipments.",
    date: "June 25, 2026",
    readTime: "5 min read",
    image: "/images/document-courier.svg"
  },
  {
    title: "How to Securely Package Fragile Commercial Goods for Air Freight",
    summary: "A comprehensive guide on bubble wrapping, double-walled boxes, and customized wooden crating standard practices.",
    date: "June 18, 2026",
    readTime: "4 min read",
    image: "/images/parcel-packing.svg"
  },
  {
    title: "Air Cargo vs Ocean Freight: Selecting the Ideal Mode for Your Business",
    summary: "Analyze the cost, speed, capacity, and environmental aspects to determine the best logistical choice for your supply chain.",
    date: "June 10, 2026",
    readTime: "6 min read",
    image: "/images/air-cargo.svg"
  }
];
