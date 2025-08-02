"use client"

import { useEffect, useRef, useState } from "react"

export default function BannerAds() {
  const [adsLoaded, setAdsLoaded] = useState(false)
  const [adsError, setAdsError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(true)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    // Check if banner ads script is already loaded globally
    if (scriptLoadedRef.current || document.querySelector('script[src*="highperformanceformat.com"]')) {
      return
    }

    const initializeAds = () => {
      try {
        // Mark as loaded to prevent duplicate loading
        scriptLoadedRef.current = true

        // Clear container
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }

        // Check if window.atOptions already exists to avoid duplicate config
        if (!window.atOptions) {
          // Create config script
          const configScript = document.createElement("script")
          configScript.type = "text/javascript"
          configScript.innerHTML = `
            window.atOptions = {
              'key' : 'b3daa748815985ba8ba02c9eb0b4e936',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          `
          configScript.setAttribute("data-banner-config", "true")
          document.head.appendChild(configScript)
        }

        // Create ads script
        const adsScript = document.createElement("script")
        adsScript.type = "text/javascript"
        adsScript.src = "//www.highperformanceformat.com/b3daa748815985ba8ba02c9eb0b4e936/invoke.js"
        adsScript.async = true
        adsScript.setAttribute("data-banner-ads", "true")

        adsScript.onload = () => {
          if (mountedRef.current) {
            setAdsLoaded(true)
            setAdsError(false)
          }
        }

        adsScript.onerror = () => {
          if (mountedRef.current) {
            setAdsError(true)
            setAdsLoaded(false)
            scriptLoadedRef.current = false // Reset on error
          }
        }

        document.head.appendChild(adsScript)

        // Timeout for error handling
        setTimeout(() => {
          if (mountedRef.current && !adsLoaded) {
            setAdsError(true)
          }
        }, 10000)
      } catch (error) {
        console.log("Banner ads error:", error)
        if (mountedRef.current) {
          setAdsError(true)
        }
        scriptLoadedRef.current = false
      }
    }

    initializeAds()

    // Cleanup - NO removeChild calls
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

  return (
    <div className="w-full bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-t border-white/20 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <p className="text-orange-400 text-sm font-bold tracking-wider uppercase drop-shadow-lg">Advertisement</p>
          </div>

          <div className="flex justify-center items-center w-full">
            <div className="bg-gradient-to-r from-orange-600/20 to-teal-600/20 border-2 border-orange-400/30 rounded-lg p-4 backdrop-blur-sm shadow-xl min-h-[70px] flex items-center justify-center">
              <div ref={containerRef} className="flex justify-center items-center min-h-[50px] min-w-[320px]">
                {!adsLoaded && !adsError && (
                  <div className="text-white/80 text-sm animate-pulse flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">Loading Advertisement...</span>
                  </div>
                )}

                {adsError && (
                  <div className="text-orange-400 text-sm font-medium flex items-center space-x-2">
                    <span>📢</span>
                    <span>Advertisement Space</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center max-w-md">
            <p className="text-white/90 text-sm leading-relaxed font-medium drop-shadow-sm">
              Support us by viewing ads • This helps us keep the website free and updated with latest movies
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    atOptions?: any
  }
}
