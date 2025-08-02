"use client"

import { useEffect } from "react"

export default function BannerAds() {
  useEffect(() => {
    // Create and inject the ads script
    const script1 = document.createElement("script")
    script1.type = "text/javascript"
    script1.innerHTML = `
      atOptions = {
        'key' : 'b3daa748815985ba8ba02c9eb0b4e936',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `
    document.head.appendChild(script1)

    const script2 = document.createElement("script")
    script2.type = "text/javascript"
    script2.src = "//www.highperformanceformat.com/b3daa748815985ba8ba02c9eb0b4e936/invoke.js"
    script2.async = true
    document.head.appendChild(script2)

    // Cleanup function
    return () => {
      try {
        document.head.removeChild(script1)
        document.head.removeChild(script2)
      } catch (e) {
        // Scripts might already be removed
      }
    }
  }, [])

  return (
    <div className="w-full bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-t border-white/10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Ads Label */}
          <div className="text-center">
            <p className="text-white/60 text-xs font-medium tracking-wider uppercase">Advertisement</p>
          </div>

          {/* Ads Container */}
          <div className="flex justify-center items-center w-full">
            <div className="bg-gradient-to-r from-orange-600/10 to-teal-600/10 border border-orange-400/20 rounded-lg p-4 backdrop-blur-sm">
              {/* The ads will be injected here by the script */}
              <div id="banner-ads-container" className="flex justify-center items-center min-h-[50px]">
                {/* Fallback content while ads load */}
                <div className="text-white/40 text-sm animate-pulse">Loading Advertisement...</div>
              </div>
            </div>
          </div>

          {/* Support Message */}
          <div className="text-center max-w-md">
            <p className="text-white/50 text-xs leading-relaxed">
              Support us by viewing ads • This helps us keep the website free and updated with latest movies
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
