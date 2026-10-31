import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://shobaimile.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "ShobaiMile | Together, We Make a Difference",
    template: "%s | ShobaiMile",
  },

  description:
    "Join ShobaiMile, a volunteer community platform where people connect, discover community events, contribute to meaningful causes, and make a positive social impact together.",

  applicationName: "ShobaiMile",

  keywords: [
    "ShobaiMile",
    "volunteer community",
    "volunteering platform",
    "community events",
    "social impact",
    "volunteer opportunities",
    "community engagement",
    "make a difference",
  ],

  authors: [{ name: "ShobaiMile" }],

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ShobaiMile",
    title: "ShobaiMile | Together, We Make a Difference",
    description:
      "Discover community events, connect with volunteers, track your impact, and help build a better community with ShobaiMile.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShobaiMile — Volunteer Community Platform",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShobaiMile | Together, We Make a Difference",
    description:
      "Connect with volunteers, discover community events, and make a positive impact together.",
    images: ["/images/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
