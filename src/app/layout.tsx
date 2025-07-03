import { ToastContainer } from "react-toastify";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JitCyber - เรียนรู้ความปลอดภัยไซเบอร์สำหรับคนไทย",
    template: "%s | JitCyber",
  },
  description: "แพลตฟอร์มการเรียนรู้ความปลอดภัยทางไซเบอร์ภาษาไทย ด้วยบทเรียนเชิงปฏิบัติ เกมจำลองสถานการณ์ และผู้เชี่ยวชาญเฉพาะทาง",
  keywords: [
    "ความปลอดภัยไซเบอร์",
    "cybersecurity ไทย",
    "เรียนรู้ดิจิทัล",
    "การป้องกันแฮ็กเกอร์",
    "ความปลอดภัยออนไลน์",
    "cyber education",
    "thai cybersecurity"
  ],

  metadataBase: new URL("https://jit-cyber.vercel.app"),

  openGraph: {
    title: "JitCyber - เรียนรู้ความปลอดภัยไซเบอร์",
    description: "แพลตฟอร์มภาษาไทยสำหรับการเรียนรู้และฝึกฝนทักษะความปลอดภัยทางไซเบอร์",
    url: "https://jit-cyber.vercel.app",
    siteName: "JitCyber",
    images: [
      {
        url: "https://jit-cyber.vercel.app/chibi.png",
        width: 1200,
        height: 630,
        alt: "JitCyber - แพลตฟอร์มการเรียนรู้ความปลอดภัยไซเบอร์",
      },
    ],
    locale: "th_TH",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "JitCyber - ความปลอดภัยไซเบอร์สำหรับคนไทย",
    description: "เรียนรู้ทักษะการป้องกันไซเบอร์ผ่านภาษาไทยด้วยวิธีง่ายและสนุก",
    images: ["https://jit-cyber.vercel.app/chibi.png"], // PNG not SVG
    creator: "@jitcyber",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/greenlogo.svg" },
      { url: "/greenlogo.svg", sizes: "16x16", type: "image/svg" },
      { url: "/greenlogo.svg", sizes: "32x32", type: "image/svg" },
    ],
    apple: [
      { url: "/greenlogo.svg", sizes: "180x180", type: "image/svg" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },

  manifest: "/site.webmanifest",

  // alternates: {
  //   canonical: "https://jitcyber.com",
  //   languages: {
  //     "th-TH": "https://jitcyber.com/th",
  //     "en-US": "https://jitcyber.com/en",
  //   },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100`}
      >
        <Providers>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            toastClassName="!bg-white dark:!bg-slate-800 !text-slate-800 dark:!text-slate-100 !rounded-xl !border !border-slate-200 dark:!border-slate-700"
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}