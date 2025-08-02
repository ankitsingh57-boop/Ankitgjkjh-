"use client"

import { useEffect, useRef } from "react"

// Global flag to prevent multiple script loading
let globalScriptLoaded = false

export default function SocialBarAds() {
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    // Check if script already loaded globally
    if (globalScriptLoaded || document.querySelector('script[src*="pl27324781.profitableratecpm.com"]')) {
      console.log("Social bar ads already loaded globally, skipping...")
      return
    }

    const initializeAds = () => {
      try {
        // Mark as loaded globally
        globalScriptLoaded = true

        // Create script only once
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "//pl27324781.profitableratecpm.com/e6/ff/2d/e6ff2d9b1f830c965a76b4ee4b85c3ae.js"
        script.async = true
        script.defer = true // Add defer for better performance
        script.setAttribute("data-social-bar-ads", "true")

        script.onload = () => {
          if (mountedRef.current) {
            console.log("Social bar ads loaded successfully")
          }
        }

        script.onerror = () => {
          if (mountedRef.current) {
            console.log("Social bar ads failed to load")
            globalScriptLoaded = false // Reset on error
          }
        }

        document.head.appendChild(script)
      } catch (error) {
        console.log("Social bar ads error:", error)
        globalScriptLoaded = false
      }
    }

    // Small delay for DOM ready - reduced from 500 to 100
    setTimeout(initializeAds, 100)

    return () => {
      mountedRef.current = false
    }
  }, [])

  return null
}
