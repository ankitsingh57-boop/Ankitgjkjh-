"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface GoogleMultiplexAdsProps {
  className?: string
  style?: React.CSSProperties
}

export default function GoogleMultiplexAds({ className = "", style = { display: "block" } }: GoogleMultiplexAdsProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isAdLoaded = useRef(false)

  useEffect(() => {
    // Prevent multiple ad loads
    if (isAdLoaded.current) return

    try {
      // Check if adsbygoogle is available
      if (typeof window !== "undefined" && window.adsbygoogle) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (adRef.current && !isAdLoaded.current) {
            window.adsbygoogle.push({})
            isAdLoaded.current = true
          }
        }, 100)
      }
    } catch (error) {
      console.log("Multiplex ads loading error:", error)
    }
  }, [])

  return (
    <div className={`w-full ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-6416883641774487"
        data-ad-slot="5448693170"
      />
    </div>
  )
}

// Extend window type for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
