"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface GoogleAdSenseProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
  className?: string
}

export default function GoogleAdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "",
}: GoogleAdSenseProps) {
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
      console.log("AdSense loading error:", error)
    }
  }, [])

  return (
    <div className={`w-full ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-6416883641774487"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
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
