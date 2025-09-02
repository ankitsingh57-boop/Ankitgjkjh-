"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Play, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import AdminPanel from "@/components/admin-panel"
import { getMoviesPaged, getFeaturedMovies, getGenres, type Movie } from "@/lib/supabase"

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 40
  const [totalMovies, setTotalMovies] = useState(0)
  const totalPages = Math.max(1, Math.ceil(totalMovies / pageSize))

  // Hero rotation
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % featuredMovies.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [featuredMovies.length])

  // Load genres for categories
  useEffect(() => {
    ;(async () => {
      const names = await getGenres()
      setCategories(["All", ...names])
    })()
  }, [])

  // Load movies for current page/filter/search
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [pageData, featured] = await Promise.all([
        getMoviesPaged({ page: currentPage, pageSize, search: searchTerm, category: selectedCategory }),
        getFeaturedMovies(5),
      ])
      setMovies(pageData.items)
      setTotalMovies(pageData.total)
      setFeaturedMovies(featured)
      setLoading(false)
    }
    load()
  }, [currentPage, searchTerm, selectedCategory])

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  const nextHero = () => setCurrentHeroIndex((p) => (p + 1) % Math.max(featuredMovies.length, 1))
  const prevHero = () =>
    setCurrentHeroIndex((p) => (p - 1 + Math.max(featuredMovies.length, 1)) % Math.max(featuredMovies.length, 1))
  const currentHeroMovie = featuredMovies[currentHeroIndex]

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxToShow = 7
    if (totalPages <= maxToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      pages.push(1)
      if (start > 2) pages.push("...")
      for (let i = start; i <= end; i++) pages.push(i)
      if (end < totalPages - 1) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onDataChange={() => {
            setCurrentPage(1)
          }}
        />
      )}

      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-40 will-change-transform">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full blur-lg opacity-60 group-hover:opacity-90 transition-opacity"></div>
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
                  <span className="text-orange-400">Smart</span> <span className="text-teal-400">Saathi</span>
                </div>
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link href="/" className="text-white hover:text-orange-400 transition-colors text-sm font-medium">
                  Home
                </Link>
                <Link href="#" className="text-white/70 hover:text-teal-400 transition-colors text-sm font-medium">
                  Movies
                </Link>
                <Link href="#" className="text-white/70 hover:text-orange-400 transition-colors text-sm font-medium">
                  TV Shows
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-orange-400/30 text-white placeholder:text-white/50 w-48 h-8 rounded-full focus:border-teal-400 transition-colors"
                />
              </div>
              <Link href="/join">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 py-2 rounded-full"
                >
                  Join
                </Button>
              </Link>
              <Button
                onClick={() => setShowAdmin(true)}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-teal-500 text-white p-2 rounded-full"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-orange-400/30 text-white placeholder:text-white/50 w-full h-8 rounded-full focus:border-teal-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      {currentHeroMovie && (
        <section className="relative h-[42vh] md:h-[54vh] overflow-hidden" style={{ contentVisibility: "auto" }}>
          <Link href={`/movie/${currentHeroMovie.id}`} className="block h-full">
            <div className="absolute inset-0 transition-transform duration-1000 ease-in-out transform hover:scale-105 will-change-transform">
              <Image
                src={currentHeroMovie.image_url || "/placeholder.svg"}
                alt={currentHeroMovie.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-transparent" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 z-10">
              <div className="bg-gradient-to-r from-orange-500 to-teal-500 p-4 rounded-full shadow-2xl">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          </Link>

          {featuredMovies.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  prevHero()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500/80 to-teal-500/80 text-white p-2 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  nextHero()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500/80 to-teal-500/80 text-white p-2 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {featuredMovies.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentHeroIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-transform ${
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

      {/* Categories (dynamic) */}
      <section className="container mx-auto px-4 py-6" style={{ contentVisibility: "auto" }}>
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              size="sm"
              className={`transition-transform hover:scale-105 px-3 py-1 text-xs rounded-full ${
                category === selectedCategory
                  ? "bg-gradient-to-r from-orange-500 to-teal-500 text-white shadow-lg"
                  : "bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-orange-400/50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Movies Grid */}
      <section className="container mx-auto px-4 py-8" style={{ contentVisibility: "auto" }}>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          <span className="text-orange-400">All</span> <span className="text-teal-400">Movies</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div className="group relative bg-gradient-to-b from-white/10 to-transparent rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-orange-400/50 transition-transform hover:scale-[1.01]">
                <div className="relative aspect-[3/4.5] overflow-hidden">
                  <Image
                    src={movie.image_url || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {movie.rating}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-gradient-to-r from-orange-500 to-teal-500 p-3 rounded-full shadow-xl">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
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

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          {renderPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <Button
                key={`${p}-${idx}`}
                size="sm"
                onClick={() => setCurrentPage(p)}
                className={
                  p === currentPage
                    ? "bg-gradient-to-r from-orange-500 to-teal-500 text-white"
                    : "bg-gray-800/50 border border-gray-600/50 text-white hover:bg-white/10"
                }
              >
                {p}
              </Button>
            ) : (
              <span key={`dots-${idx}`} className="px-2 text-white/60">
                {p}
              </span>
            ),
          )}
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
        <p className="text-center text-white/60 text-xs mt-2">
          Page {currentPage} of {totalPages} • {totalMovies} movies
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-t border-white/10 mt-16">
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
    </div>
  )
}
