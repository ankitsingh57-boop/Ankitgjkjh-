import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://cbtbjnwhekyeyermrfgg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidGJqbndoZWt5ZXllcm1yZmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjQxNTIsImV4cCI6MjA2OTcwMDE1Mn0.s7p_-Mk_CALSF_zgHr3HGO0GzLRFR7sUG9UrTzy0gjc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Movie {
  id: number
  title: string
  year: string
  rating: string
  duration: string
  genre: string[]
  image_url: string
  description: string
  download_links: Array<{ url: string }>
  featured: boolean
  created_at: string
  updated_at: string
}

export interface JoinLink {
  id: number
  title: string
  description: string
  url: string
  created_at: string
  updated_at: string
}

// Movie functions
export async function getMovies(): Promise<Movie[]> {
  const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching movies:", error)
    return []
  }

  return data || []
}

export async function getMovieById(id: number): Promise<Movie | null> {
  const { data, error } = await supabase.from("movies").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching movie:", error)
    return null
  }

  return data
}

export async function addMovie(movie: Omit<Movie, "id" | "created_at" | "updated_at">): Promise<Movie | null> {
  const { data, error } = await supabase.from("movies").insert([movie]).select().single()

  if (error) {
    console.error("Error adding movie:", error)
    return null
  }

  return data
}

export async function updateMovie(id: number, movie: Partial<Movie>): Promise<Movie | null> {
  const { data, error } = await supabase.from("movies").update(movie).eq("id", id).select().single()

  if (error) {
    console.error("Error updating movie:", error)
    return null
  }

  return data
}

export async function deleteMovie(id: number): Promise<boolean> {
  const { error } = await supabase.from("movies").delete().eq("id", id)

  if (error) {
    console.error("Error deleting movie:", error)
    return false
  }

  return true
}

// Join Links functions
export async function getJoinLinks(): Promise<JoinLink[]> {
  const { data, error } = await supabase.from("join_links").select("*").order("id", { ascending: true })

  if (error) {
    console.error("Error fetching join links:", error)
    return []
  }

  return data || []
}

export async function updateJoinLink(id: number, joinLink: Partial<JoinLink>): Promise<JoinLink | null> {
  const { data, error } = await supabase.from("join_links").update(joinLink).eq("id", id).select().single()

  if (error) {
    console.error("Error updating join link:", error)
    return null
  }

  return data
}

export async function addJoinLink(
  joinLink: Omit<JoinLink, "id" | "created_at" | "updated_at">,
): Promise<JoinLink | null> {
  const { data, error } = await supabase.from("join_links").insert([joinLink]).select().single()

  if (error) {
    console.error("Error adding join link:", error)
    return null
  }

  return data
}
