"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getJoinLinks, type JoinLink } from "@/lib/supabase"

export default function JoinPage() {
  const [joinLinks, setJoinLinks] = useState<JoinLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJoinLinks()
  }, [])

  const loadJoinLinks = async () => {
    setLoading(true)
    const links = await getJoinLinks()
    setJoinLinks(links)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full p-2 animate-spin">
            <Image src="/logo.png" alt="Loading" width={48} height={48} className="w-full h-full object-contain" />
          </div>
          <p className="text-white text-xl animate-pulse">Loading Join Links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 animate-gradient-x">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full p-2 flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="Smart Saathi Logo"
                      width={20}
                      height={20}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold">
                  <span className="text-orange-400">Smart</span>{" "}
                  <span className="text-teal-400 animate-pulse">Saathi</span>
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

      {/* Join Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-orange-400">Join</span> <span className="text-teal-400">Our Community</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              Connect with us and stay updated with the latest movies, exclusive content, and special offers!
            </p>
          </div>

          {/* Join Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {joinLinks.map((link, index) => (
              <Card
                key={link.id}
                className="bg-gradient-to-br from-black/40 to-black/20 border border-white/20 hover:border-orange-400/60 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-teal-500 rounded-full flex items-center justify-center">
                      <ExternalLink className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{link.title}</h3>

                    <p className="text-white/90 leading-relaxed text-base">{link.description}</p>

                    <Button
                      onClick={() => window.open(link.url, "_blank")}
                      className="w-full bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Join Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <Card className="bg-gradient-to-r from-black/40 to-black/20 border border-white/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  <span className="text-orange-400">Why</span> <span className="text-teal-400">Join Us?</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-orange-400">Latest Updates</h4>
                    <p className="text-sm">Get notified about new movie releases instantly</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-teal-400">Exclusive Content</h4>
                    <p className="text-sm">Access to exclusive movies and special content</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-orange-400">Community Support</h4>
                    <p className="text-sm">Join a community of movie enthusiasts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-t border-white/10 mt-16 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full p-2 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Smart Saathi Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">
                <span className="text-orange-400">Smart</span> <span className="text-teal-400">Saathi</span>
              </h3>
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold flex items-center justify-center">
                Made in India 🇮🇳 Owner by Kashyap
              </p>
              <p className="text-orange-400 font-medium">hdhub4u content</p>
            </div>
          </div>

          <div className="border-t border-white/10 mt-6 pt-6 text-center text-white/60 text-sm">
            <p>&copy; 2024 Smart Saathi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
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
