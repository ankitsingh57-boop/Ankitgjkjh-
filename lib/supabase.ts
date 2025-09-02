import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://cbtbjnwhekyeyermrfgg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidGJqbndoZWt5ZXllcm1yZmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjQxNTIsImV4cCI6MjA2OTcwMDE1Mn0.s7p_-Mk_CALSF_zgHr3HGO0GzLRFR7sUG9UrTzy0gjc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface MovieDownload {
  id?: number
  movie_id?: number
  url: string
  position: number
  created_at?: string
  updated_at?: string
}

export interface Movie {
  id: number
  title: string
  year: string
  rating: string
  duration: string
  genre: string[]
  image_url: string
  description: string
  featured: boolean
  trailer_url?: string | null
  created_at: string
  updated_at: string
  // Legacy JSONB compatibility
  download_links?: Array<{ url: string }>
  // Unified list for UI
  movie_downloads?: MovieDownload[]
}

export interface JoinLink {
  id: number
  title: string
  description: string
  url: string
  created_at: string
  updated_at: string
}

/**
 * Admin password verification using DB-only table (no Supabase Auth).
 * Returns true if email/password are correct.
 */
export async function adminVerify(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("admin_verify", { p_email: email, p_plain_password: password })
  if (error) {
    console.warn("admin_verify RPC error:", error)
    return false
  }
  return !!data
}

// Movies (legacy full fetch)
export async function getMovies(): Promise<Movie[]> {
  const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching movies:", error)
    return []
  }
  return data || []
}

// Paged movies with search and category filters
export interface GetMoviesPagedParams {
  page?: number
  pageSize?: number
  search?: string
  category?: string // "All" or a specific genre
}
export interface MoviesPage {
  items: Movie[]
  total: number
  page: number
  pageSize: number
}
export async function getMoviesPaged(params: GetMoviesPagedParams = {}): Promise<MoviesPage> {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.max(1, params.pageSize ?? 40)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from("movies").select("*", { count: "exact" })

  if (params.search && params.search.trim().length > 0) {
    query = query.ilike("title", `%${params.search.trim()}%`)
  }

  if (params.category && params.category !== "All") {
    // genre is text[]; contains expects an array
    query = query.contains("genre", [params.category])
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

  if (error) {
    console.error("Error fetching paged movies:", error)
    return { items: [], total: 0, page, pageSize }
  }

  return { items: (data || []) as Movie[], total: count ?? 0, page, pageSize }
}

// Featured movies (for hero)
export async function getFeaturedMovies(limit = 5): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching featured movies:", error)
    return []
  }
  return (data || []).slice(0, Math.max(1, limit))
}

export async function getMovieById(id: number): Promise<Movie | null> {
  const { data: movie, error: movieErr } = await supabase.from("movies").select("*").eq("id", id).single()
  if (movieErr || !movie) {
    console.error("Error fetching movie:", movieErr)
    return null
  }

  // Try normalized table first
  let tableDownloads: MovieDownload[] = []
  const { data: dls, error: dlErr } = await supabase
    .from("movie_downloads")
    .select("*")
    .eq("movie_id", id)
    .order("position", { ascending: true })

  if (!dlErr && dls) {
    tableDownloads = dls as MovieDownload[]
  } else {
    // Fallback to legacy JSONB if present
    const legacy = (movie as any).download_links
    if (Array.isArray(legacy)) {
      tableDownloads = legacy.map((x: any, idx: number) => ({ url: x?.url ?? "", position: idx + 1 }))
    }
  }

  return { ...(movie as Movie), movie_downloads: tableDownloads }
}

export async function addMovie(
  movie: Omit<Movie, "id" | "created_at" | "updated_at" | "movie_downloads">,
): Promise<Movie | null> {
  const { data, error } = await supabase.from("movies").insert([movie]).select().single()
  if (error) {
    console.error("Error adding movie:", error)
    return null
  }
  return data as Movie
}

export async function updateMovie(id: number, movie: Partial<Movie>): Promise<Movie | null> {
  const { data, error } = await supabase.from("movies").update(movie).eq("id", id).select().single()
  if (error) {
    console.error("Error updating movie:", error)
    return null
  }
  return data as Movie
}

export async function deleteMovie(id: number): Promise<boolean> {
  const { error } = await supabase.from("movies").delete().eq("id", id)
  if (error) {
    console.error("Error deleting movie:", error)
    return false
  }
  return true
}

// Downloads: use normalized table if it exists; fall back to legacy JSONB column
function isRelationMissing(err: any) {
  const code = err?.code || ""
  const msg = err?.message || err?.details || ""
  return code === "42P01" || /relation .* does not exist/i.test(msg)
}

export async function setMovieDownloads(movieId: number, urls: string[]) {
  const filtered = (urls || []).map((u) => (u || "").trim()).filter((u) => u.length > 0)
  const rows = filtered.map((url, idx) => ({ movie_id: movieId, url, position: idx + 1 }))

  try {
    const delRes = await supabase.from("movie_downloads").delete().eq("movie_id", movieId)
    if (delRes.error) throw delRes.error

    if (rows.length > 0) {
      const insRes = await supabase.from("movie_downloads").insert(rows)
      if (insRes.error) throw insRes.error
    }
    return
  } catch (err: any) {
    if (isRelationMissing(err)) {
      // Fallback to legacy JSONB column if table missing
      const jsonb = filtered.map((url) => ({ url }))
      await supabase.from("movies").update({ download_links: jsonb }).eq("id", movieId)
      return
    }
    console.error("Error saving downloads:", err)
  }
}

// Join Links
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
