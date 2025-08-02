"use client"

import { useEffect, useRef } from "react"

export default function SocialBarAds() {
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Create and inject the social bar ads script
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "//pl27324781.profitableratecpm.com/e6/ff/2d/e6ff2d9b1f830c965a76b4ee4b85c3ae.js"
    script.async = true

    // Store reference
    scriptRef.current = script

    // Add script to head
    document.head.appendChild(script)

    // Cleanup function with proper error handling
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        try {
          scriptRef.current.parentNode.removeChild(scriptRef.current)
        } catch (error) {
          console.log("Script already removed or not found")
        }
      }
    }
  }, [])

  // This component doesn't render anything visible
  // The social bar ads will be handled by the script
  return null
}
