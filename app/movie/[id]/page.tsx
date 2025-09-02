"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Calendar, Clock, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getMovieById, type Movie } from "@/lib/supabase"
import TrailerPlayer from "@/components/trailer-player"

interface MoviePageProps {
  params: { id: string }
}

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const m = await getMovieById(Number.parseInt(params.id))
      setMovie(m)
      setLoading(false)
    }
    load()
  }, [params.id])

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
            <Button className="bg-gradient-to-r from-orange-500 to-teal-500 text-white rounded-full px-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Unified downloads (normalized or legacy)
  const downloads =
    movie.movie_downloads && movie.movie_downloads.length > 0
      ? movie.movie_downloads
      : (movie.download_links || []).map((x, i) => ({ url: x.url, position: i + 1 }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50 will-change-transform">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full p-1">
                <Image src="/logo.png" alt="Logo" width={24} height={24} className="w-full h-full object-contain" />
              </div>
              <div className="text-xl md:text-2xl font-bold">
                <span className="text-orange-400">Smart</span> <span className="text-teal-400">Saathi</span>
              </div>
            </Link>
            <Link href="/">
              <Button className="bg-gradient-to-r from-orange-500 to-teal-500 text-white rounded-full px-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 py-10" style={{ contentVisibility: "auto" }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={movie.image_url || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-lg px-3 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    {movie.rating}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Info + Trailer + Description + Downloads */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-orange-400">{movie.title.split(" ")[0]}</span>{" "}
                <span className="text-teal-400">{movie.title.split(" ").slice(1).join(" ")}</span>
              </h1>
              <div className="flex items-center gap-4 sm:gap-8 text-white/80 mb-6 text-base sm:text-lg">
                <span className="flex items-center bg-white/10 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm">
                  <Calendar className="w-5 h-5 mr-2" />
                  {movie.year}
                </span>
                <span className="flex items-center bg-white/10 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm">
                  <Clock className="w-5 h-5 mr-2" />
                  {movie.duration}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                {movie.genre.map((g: string) => (
                  <Badge key={g} className="bg-gradient-to-r from-orange-500 to-teal-500 text-white px-4 py-2 text-sm">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Trailer above Download Links */}
            {movie.trailer_url && (
              <div style={{ contentVisibility: "auto" }}>
                <h2 className="text-2xl font-bold text-white mb-4">
                  <span className="text-orange-400">Movie</span> <span className="text-teal-400">Trailer</span>
                </h2>
                <TrailerPlayer
                  url={movie.trailer_url}
                  title={`${movie.title} Trailer`}
                  posterFallback={movie.image_url}
                  autoLoadWhenInView={true}
                  className="border border-white/10"
                />
              </div>
            )}

            {/* Description */}
            {movie.description && (
              <div style={{ contentVisibility: "auto" }}>
                <Card className="bg-gradient-to-br from-white/10 to-transparent border-white/10 backdrop-blur-sm shadow-2xl">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      <span className="text-orange-400">Movie</span> <span className="text-teal-400">Description</span>
                    </h2>
                    <p className="text-white/80 leading-relaxed whitespace-pre-line">{movie.description}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Download Section */}
            <div style={{ contentVisibility: "auto" }}>
              <Card className="bg-gradient-to-br from-orange-600/20 to-teal-600/20 border-orange-400/30 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
                    <Download className="mr-3 h-8 w-8 text-orange-400" />
                    <span className="text-orange-400">Download</span> <span className="text-teal-400 ml-2">Links</span>
                  </h2>

                  {downloads.length === 0 ? (
                    <p className="text-white/70">No download links available yet.</p>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {downloads.map((dl, index) => (
                        <div
                          key={`${dl.url}-${index}`}
                          className="bg-gradient-to-r from-orange-600/30 to-teal-600/30 rounded-xl p-4 sm:p-6 border border-orange-400/40 hover:border-orange-400/60 transition-transform duration-300 hover:scale-[1.01]"
                        >
                          <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <h3 className="text-white font-bold text-lg sm:text-xl">Download Link {index + 1}</h3>
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                              Available
                            </Badge>
                          </div>
                          <Button
                            className="w-full bg-gradient-to-r from-orange-500 to-teal-500 text-white shadow-lg h-12 sm:h-14 text-base sm:text-lg rounded-xl transition-transform duration-300 hover:scale-[1.01]"
                            onClick={() => window.open(dl.url, "_blank", "noopener,noreferrer")}
                          >
                            Download Link {index + 1}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-t border-white/10 mt-16">
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
    </div>
  )
}
