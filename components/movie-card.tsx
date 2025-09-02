"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Star, Play } from "lucide-react"
import React from "react"
import type { Movie } from "@/lib/supabase"

// Next.js cannot infer props; provide defaults
const defaultMovie: Movie = {
  id: 0,
  title: "Movie",
  year: "2024",
  rating: "8.0",
  duration: "120 min",
  genre: [],
  image_url: "/movie-poster.png",
  description: "",
  featured: false,
  created_at: "",
  updated_at: "",
}

type Props = {
  movie?: Movie
}

function MovieCardBase({ movie = defaultMovie }: Props) {
  return (
    <div
      className="group relative bg-gradient-to-b from-white/10 to-transparent rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-orange-400/50 transition-transform hover:scale-[1.01] transform-gpu"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "320px 220px",
      }}
    >
      <div className="relative aspect-[3/4.5] overflow-hidden">
        <Image
          src={movie.image_url || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
          sizes="(max-width: 768px) 50vw, 20vw"
          priority={false}
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
  )
}

const MovieCard = React.memo(MovieCardBase)
export default MovieCard
