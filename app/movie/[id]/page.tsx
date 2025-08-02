"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Calendar, Clock, Download, Play, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import BannerAds from "@/components/banner-ads"
import SocialBarAds from "@/components/social-bar-ads"
import { getMovieById, type Movie } from "@/lib/supabase"

interface MoviePageProps {
  params: {
    id: string
  }
}

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMovie()
  }, [params.id])

  const loadMovie = async () => {
    setLoading(true)
    const movieData = await getMovieById(Number.parseInt(params.id))
    setMovie(movieData)
    setLoading(false)
  }

  // Updated ads integration function with new URL
  const handleDownloadClick = (downloadUrl: string, linkNumber: number) => {
    // Updated ads URL
    const adsUrl = "https://www.profitableratecpm.com/ens0awetrm?key=3a67244d4e04111e273bbc0cedf0d2db"

    // Open ads in new tab
    const adsWindow = window.open(adsUrl, "_blank")

    // Show user notification with better UX
    const notification = document.createElement("div")
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f97316, #14b8a6);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: system-ui;
        font-weight: 600;
        max-width: 320px;
        animation: slideIn 0.5s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 18px;">🎬</span>
          <span>Download Link ${linkNumber}</span>
        </div>
        <div style="font-size: 14px; opacity: 0.9; line-height: 1.4;">
          Please wait 3 seconds for the ad to load, then close the ad tab to get your download!
        </div>
        <div style="margin-top: 12px; text-align: center;">
          <div style="
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          ">
            <div style="
              width: 16px;
              height: 16px;
              border: 2px solid rgba(255,255,255,0.3);
              border-top: 2px solid white;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            "></div>
            Ad loading...
          </div>
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `
    document.body.appendChild(notification)

    // Reduced wait time to 3 seconds for better user experience
    setTimeout(() => {
      // Remove notification
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }

      // Show download ready notification
      const downloadNotification = document.createElement("div")
      downloadNotification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 20px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          z-index: 10000;
          font-family: system-ui;
          font-weight: 600;
          max-width: 320px;
          animation: slideIn 0.5s ease-out;
        ">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 20px;">✅</span>
            <span>Download Ready!</span>
          </div>
          <div style="font-size: 14px; opacity: 0.9; line-height: 1.4; margin-bottom: 16px;">
            Your movie download is ready. Click below to start downloading now.
          </div>
          <button onclick="window.open('${downloadUrl}', '_blank'); document.body.removeChild(this.parentElement.parentElement)" style="
            width: 100%;
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            <span style="font-size: 16px;">🚀</span>
            Start Download Now
          </button>
          <div style="text-align: center; margin-top: 12px;">
            <button onclick="document.body.removeChild(this.parentElement.parentElement)" style="
              background: none;
              border: none;
              color: rgba(255,255,255,0.7);
              font-size: 12px;
              cursor: pointer;
              text-decoration: underline;
              padding: 4px 8px;
            ">
              Close
            </button>
          </div>
        </div>
      `
      document.body.appendChild(downloadNotification)

      // Auto remove after 30 seconds
      setTimeout(() => {
        if (document.body.contains(downloadNotification)) {
          document.body.removeChild(downloadNotification)
        }
      }, 30000)
    }, 3000) // Reduced to 3 seconds
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full p-2 animate-spin">
            <Image src="/logo.png" alt="Loading" width={48} height={48} className="w-full h-full object-contain" />
          </div>
          <p className="text-white text-xl animate-pulse">Loading Movie...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Movie Not Found</h1>
          <Link href="/">
            <Button className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white rounded-full px-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 animate-gradient-x">
      {/* Social Bar Ads */}
      <SocialBarAds />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full p-1">
                  <Image src="/logo.png" alt="Logo" width={24} height={24} className="w-full h-full object-contain" />
                </div>
                <div className="text-xl md:text-2xl font-bold">
                  <span className="text-orange-400">Smart</span> <span className="text-teal-400">Saathi</span>
                </div>
              </Link>
            </div>
            <Link href="/">
              <Button className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white rounded-full px-6 transition-all duration-300 hover:scale-105">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Movie Detail Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                <Image src={movie.image_url || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-lg px-3 py-1 animate-pulse">
                    <Star className="w-4 h-4 mr-1" />
                    {movie.rating}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-orange-400">{movie.title.split(" ")[0]}</span>{" "}
                <span className="text-teal-400">{movie.title.split(" ").slice(1).join(" ")}</span>
              </h1>
              <div className="flex items-center space-x-8 text-white/80 mb-8 text-lg">
                <span className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Calendar className="w-5 h-5 mr-2" />
                  {movie.year}
                </span>
                <span className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Clock className="w-5 h-5 mr-2" />
                  {movie.duration}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mb-8">
                {movie.genre.map((g: string) => (
                  <Badge key={g} className="bg-gradient-to-r from-orange-500 to-teal-500 text-white px-4 py-2 text-sm">
                    {g}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Play className="mr-2 h-6 w-6" />
                  Watch Trailer
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white bg-transparent px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Heart className="mr-2 h-6 w-6" />
                  Add to Wishlist
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white bg-transparent px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Share2 className="mr-2 h-6 w-6" />
                  Share
                </Button>
              </div>
            </div>

            {/* Synopsis */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-3xl font-bold text-white mb-6">
                <span className="text-orange-400">Syn</span>
                <span className="text-teal-400">opsis</span>
              </h2>
              <p className="text-white leading-relaxed text-lg">{movie.description}</p>
            </div>

            {/* Download Section */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Card className="bg-gradient-to-br from-orange-600/20 to-teal-600/20 border-orange-400/30 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                    <Download className="mr-3 h-8 w-8 text-orange-400" />
                    <span className="text-orange-400">Download</span> <span className="text-teal-400 ml-2">Links</span>
                  </h2>

                  {/* Updated Ads Notice */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-xl">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">💡</span>
                      <h3 className="text-white font-bold text-lg">Quick Download Instructions</h3>
                    </div>
                    <div className="text-white/80 text-sm space-y-2">
                      <p>• Click on any download link below</p>
                      <p>• Wait just 3 seconds for the ad to load</p>
                      <p>• Close the ad tab to get your download link</p>
                      <p>• Your movie download will start immediately</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {movie.download_links.map((link: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-orange-600/30 to-teal-600/30 rounded-xl p-6 border border-orange-400/40 hover:border-orange-400/60 transition-all duration-300 hover:scale-105"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-white font-bold text-xl">Download Link {index + 1}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 animate-pulse">
                              Available
                            </Badge>
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1">
                              HD Quality
                            </Badge>
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                              Fast
                            </Badge>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white shadow-lg h-14 text-lg rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                          onClick={() => handleDownloadClick(link.url, index + 1)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <Download className="mr-3 h-6 w-6" />
                          Download Link {index + 1}
                          <span className="ml-2 text-sm opacity-80">(Quick Download)</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 text-xl">✨</span>
                      <div>
                        <p className="text-green-400 text-sm leading-relaxed">
                          <strong>Fast & Safe:</strong> We've optimized the download process! Now you only need to wait
                          3 seconds instead of 5. All downloads are virus-free and safe.
                        </p>
                        <p className="text-green-400/80 text-xs mt-2">
                          Ads help us keep this service free and updated with the latest movies. Thank you for your
                          support!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Ads Section */}
      <BannerAds />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-t border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full p-2 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Smart Saathi Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold">
                <span className="text-orange-400">Smart</span> <span className="text-teal-400">Saathi</span>
              </h3>
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold text-lg flex items-center justify-center">
                Made in India 🇮🇳 Owner by Kashyap
              </p>
              <p className="text-orange-400 font-medium">hdhub4u content</p>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/60">
            <p>&copy; 2024 Smart Saathi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
