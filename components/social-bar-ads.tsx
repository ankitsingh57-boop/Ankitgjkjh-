"use client"

import { useEffect, useRef } from "react"

export default function SocialBarAds() {
  const mountedRef = useRef(true)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    const initializeAds = () => {
      try {
        // Force reload the script
        scriptLoadedRef.current = true

        // Create script
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "//pl27324781.profitableratecpm.com/e6/ff/2d/e6ff2d9b1f830c965a76b4ee4b85c3ae.js"
        script.async = true
        script.setAttribute("data-social-bar-ads", "true")

        script.onload = () => {
          if (mountedRef.current) {
            console.log("Social bar ads loaded successfully")
          }
        }

        script.onerror = () => {
          if (mountedRef.current) {
            console.log("Social bar ads failed to load")
            scriptLoadedRef.current = false
          }
        }

        document.head.appendChild(script)
      } catch (error) {
        console.log("Social bar ads error:", error)
        scriptLoadedRef.current = false
      }
    }

    // Add small delay to ensure DOM is ready
    setTimeout(initializeAds, 1000)

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
