"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Play, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import AdminPanel from "@/components/admin-panel"
import { getMovies, type Movie } from "@/lib/supabase"

const categories = ["All", "Action", "Adventure", "Drama", "Sci-Fi", "Crime", "Comedy", "Thriller", "Romance"]

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  // Load movies from Supabase
  useEffect(() => {
    loadMovies()
  }, [])

  const loadMovies = async () => {
    setLoading(true)
    const moviesData = await getMovies()
    setMovies(moviesData)
    setLoading(false)
  }

  const featuredMovies = movies.filter((movie) => movie.featured)

  // Auto-rotate hero banner every 3 seconds with smooth transition
  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % featuredMovies.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [featuredMovies.length])

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || movie.genre.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % featuredMovies.length)
  }

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
  }

  const currentHeroMovie = featuredMovies[currentHeroIndex]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full p-2 animate-spin">
            <Image src="/logo.png" alt="Loading" width={48} height={48} className="w-full h-full object-contain" />
          </div>
          <p className="text-white text-xl animate-pulse">Loading Smart Saathi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 animate-gradient-x">
      {/* Admin Panel */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} onDataChange={loadMovies} />}

      {/* Header with Logo */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo with Glow Effect */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full p-2 flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="Smart Saathi Logo"
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold">
                  <span className="text-orange-400">Smart</span>{" "}
                  <span className="text-teal-400 animate-pulse">Saathi</span>
                </div>
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link
                  href="/"
                  className="text-white hover:text-orange-400 transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="text-white/70 hover:text-teal-400 transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  Movies
                </Link>
                <Link
                  href="#"
                  className="text-white/70 hover:text-orange-400 transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  TV Shows
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-orange-400/30 text-white placeholder:text-white/50 w-48 h-8 rounded-full focus:border-teal-400 transition-all duration-300"
                />
              </div>
              <Link href="/join">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-xs"
                >
                  Join
                </Button>
              </Link>
              <Button
                onClick={() => setShowAdmin(true)}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-orange-400/30 text-white placeholder:text-white/50 w-full h-8 rounded-full focus:border-teal-400 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Clickable Poster Slider */}
      {currentHeroMovie && (
        <section className="relative h-[45vh] md:h-[55vh] overflow-hidden">
          <Link href={`/movie/${currentHeroMovie.id}`} className="block h-full">
            <div className="absolute inset-0 transition-all duration-1000 ease-in-out transform hover:scale-105">
              <Image
                src={currentHeroMovie.image_url || "/placeholder.svg"}
                alt={currentHeroMovie.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-transparent" />
            </div>

            {/* Hover Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 z-10">
              <div className="bg-gradient-to-r from-orange-500 to-teal-500 p-4 rounded-full shadow-2xl animate-bounce">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          </Link>

          {/* Navigation Arrows */}
          {featuredMovies.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  prevHero()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500/80 to-teal-500/80 hover:from-orange-600 hover:to-teal-600 text-white p-2 rounded-full transition-all duration-300 z-20 hover:scale-110"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  nextHero()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500/80 to-teal-500/80 hover:from-orange-600 hover:to-teal-600 text-white p-2 rounded-full transition-all duration-300 z-20 hover:scale-110"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {featuredMovies.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentHeroIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentHeroIndex
                      ? "bg-gradient-to-r from-orange-400 to-teal-400 scale-125"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Categories with Animation */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category, index) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              size="sm"
              className={`transition-all duration-300 hover:scale-105 animate-fade-in-up px-3 py-1 text-xs rounded-full ${
                category === selectedCategory
                  ? "bg-gradient-to-r from-orange-500 to-teal-500 text-white shadow-lg"
                  : "bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-orange-400/50"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Movies Grid with Animations */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 animate-fade-in-up">
          <span className="text-orange-400">All</span> <span className="text-teal-400">Movies</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {filteredMovies.map((movie, index) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div
                className="group relative bg-gradient-to-b from-white/10 to-transparent rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-orange-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Movie Poster */}
                <div className="relative aspect-[3/4.5] overflow-hidden">
                  <Image
                    src={movie.image_url || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-xs animate-pulse">
                      <Star className="w-3 h-3 mr-1" />
                      {movie.rating}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-gradient-to-r from-orange-500 to-teal-500 p-3 rounded-full shadow-xl animate-bounce">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-3 bg-gradient-to-r from-purple-900/20 to-transparent">
                  <h3 className="text-white font-bold text-sm md:text-base group-hover:text-orange-400 transition-colors line-clamp-1 mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-teal-300 text-xs md:text-sm font-medium">{movie.year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer with Gradient */}
      <footer className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-t border-white/10 mt-16 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
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
