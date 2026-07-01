import { Space_Grotesk, Inter, Sora } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LenisProvider from '@/components/LenisProvider';
import '@/app/globals.css';
import { BRAND_NAME, BRAND_DESCRIPTION } from '@/constants';

export const metadata = {
  metadataBase: new URL('https://veerlogistics.com'),
  title: {
    default: `${BRAND_NAME} | Premium Global Logistics`,
    template: `%s | ${BRAND_NAME}`
  },
  description: BRAND_DESCRIPTION,
  keywords: ["international courier", "cargo services", "express cargo", "Ahmedabad courier", "door pickup", "medicine delivery", "student courier", "global shipping", "FedEx partner", "DHL partner"],
  authors: [{ name: "VEER Logistics Team" }],
  openGraph: {
    title: `${BRAND_NAME} | Premium Global Logistics`,
    description: BRAND_DESCRIPTION,
    url: 'https://veerlogistics.com',
    siteName: BRAND_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://veerlogistics.com/veer-international-logo.png',
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} Logo`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} | Premium Global Logistics`,
    description: BRAND_DESCRIPTION,
    images: ['https://veerlogistics.com/veer-international-logo.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  // Structured Schema.org data for local logistics business
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LogisticsBusiness",
    "name": BRAND_NAME,
    "image": "https://veerlogistics.com/veer-international-logo.png",
    "@id": "https://veerlogistics.com/#organization",
    "url": "https://veerlogistics.com",
    "telephone": "+917940051234",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "102-105, Shanti Mall, Near S.G. Highway",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "postalCode": "380054",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.038552,
      "longitude": 72.506161
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://facebook.com/veerlogistics",
      "https://twitter.com/veerlogistics",
      "https://linkedin.com/company/veerlogistics"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <LenisProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </LenisProvider>
      </body>
    </html>
  );
}
