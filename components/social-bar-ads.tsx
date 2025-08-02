"use client"

import { useEffect } from "react"

export default function SocialBarAds() {
  useEffect(() => {
    // Create and inject the social bar ads script
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "//pl27324781.profitableratecpm.com/e6/ff/2d/e6ff2d9b1f830c965a76b4ee4b85c3ae.js"
    script.async = true

    // Add script to head
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      try {
        document.head.removeChild(script)
      } catch (e) {
        // Script might already be removed
      }
    }
  }, [])

  // This component doesn't render anything visible
  // The social bar ads will be handled by the script
  return null
}
