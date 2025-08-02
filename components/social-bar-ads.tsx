"use client"

import { useEffect, useRef } from "react"

export default function SocialBarAds() {
  const mountedRef = useRef(true)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    // Check if script is already loaded globally
    if (scriptLoadedRef.current || document.querySelector('script[src*="pl27324781.profitableratecpm.com"]')) {
      return
    }

    const initializeAds = () => {
      try {
        // Mark as loaded to prevent duplicate loading
        scriptLoadedRef.current = true

        // Create script only once
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "//pl27324781.profitableratecpm.com/e6/ff/2d/e6ff2d9b1f830c965a76b4ee4b85c3ae.js"
        script.async = true
        script.setAttribute("data-social-bar-ads", "true") // Mark this script

        script.onload = () => {
          if (mountedRef.current) {
            console.log("Social bar ads loaded successfully")
          }
        }

        script.onerror = () => {
          if (mountedRef.current) {
            console.log("Social bar ads failed to load")
            scriptLoadedRef.current = false // Reset on error
          }
        }

        document.head.appendChild(script)
      } catch (error) {
        console.log("Social bar ads error:", error)
        scriptLoadedRef.current = false
      }
    }

    initializeAds()

    // Cleanup
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return null
}
