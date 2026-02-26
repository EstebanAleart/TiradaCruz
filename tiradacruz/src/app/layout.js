import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tirada de Cartas Españolas Online Gratis | Tarot Argentina - Rosario",
  description:
    "Realizá tu tirada de cartas españolas en cruz online y gratis. Consultá el tarot con inteligencia artificial. El mejor tarot online de Argentina y Rosario. Interpretaciones personalizadas al instante.",
  keywords:
    "tarot online argentina, tarot rosario, cartas españolas online, tirada de cartas gratis, tarot gratis argentina, lectura de cartas, tarot online gratis, cartas españolas en cruz, tarot con IA, consulta tarot argentina",
  authors: [{ name: "TiradaCruz" }],
  creator: "TiradaCruz",
  publisher: "TiradaCruz",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Tirada de Cartas Españolas Online Gratis | Tarot Argentina",
    description:
      "Mezclá, cortá y revelá tus cartas españolas en cruz. Interpretación con inteligencia artificial al instante. Gratis, sin registro. El tarot online más auténtico de Argentina.",
    type: "website",
    locale: "es_AR",
    siteName: "TiradaCruz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tirada de Cartas Españolas Online Gratis | Tarot Argentina",
    description:
      "Mezclá, cortá y revelá tus cartas españolas en cruz. Interpretación con IA al instante. Gratis para toda Argentina.",
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "Tbg0mHr8Iwyb_QuVnG2YiUYbLjuVbD6LtXrzKK87v8g",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TiradaCruz - Tarot Online Argentina",
  description:
    "Aplicación web gratuita para realizar tiradas de cartas españolas en cruz con interpretación por inteligencia artificial. Disponible para toda Argentina.",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "ARS",
  },
  inLanguage: "es-AR",
  audience: {
    "@type": "Audience",
    geographicArea: {
      "@type": "Country",
      name: "Argentina",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          src="https://pl28802415.effectivegatecpm.com/e9/31/73/e93173988f40c27ebbfbdf0d4b97f451.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
