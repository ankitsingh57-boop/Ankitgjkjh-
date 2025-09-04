import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import Script from "next/script"
import "./globals.css" // Import globals.css at the top of the file

export const metadata: Metadata = {
  title: "Smart Saathi - Movie Download Website",
  description:
    "Your ultimate destination for the latest movies and entertainment content. Download high-quality movies with professional UI design.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-KJ2F868DMX" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KJ2F868DMX');
        `}
      </Script>
      <ClientLayout>{children}</ClientLayout>
    </>
  )
}
