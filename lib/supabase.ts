import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://cbtbjnwhekyeyermrfgg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidGJqbndoZWt5ZXllcm1yZmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjQxNTIsImV4cCI6MjA2OTcwMDE1Mn0.s7p_-Mk_CALSF_zgHr3HGO0GzLRFR7sUG9UrTzy0gjc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* -------------------- Lightweight client-side cache -------------------- */
type CacheEntry<T> = { data: T; ts: number }
const cache = new Map<string, CacheEntry<any>>()
const TTL = 30_000 // 30s keeps UI snappy but avoids long stale data

function getCache<T>(key: string): T | null {
  const e = cache.get(key)
  if (!e) return null
  if (Date.now() - e.ts > TTL) {
    cache.delete(key)
    return null
  }
  return e.data as T
}
function setCache<T>(key: string, data: T) {
  cache.set(key, { data, ts: Date.now() })
}
export function clearCache(prefix?: string) {
  if (!prefix) cache.clear()
  else {
    for (const k of cache.keys()) {
      if (k.startsWith(prefix)) cache.delete(k)
    }
  }
}

/* -------------------- Types -------------------- */
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
  download_links?: Array<{ url: string }>
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

export interface Genre {
  id?: number
  name: string
}

/* -------------------- Admin verify (unchanged) -------------------- */
export async function adminVerify(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("admin_verify", { p_email: email, p_plain_password: password })
  if (error) {
    console.warn("admin_verify RPC error:", error)
    return false
  }
  return !!data
}

/* -------------------- Genres -------------------- */
const DEFAULT_GENRES = ["Action", "Adventure", "Drama", "Sci-Fi", "Crime", "Comedy", "Thriller", "Romance", "Horror"]

export async function getGenres(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("genres").select("name").order("name", { ascending: true })
    if (error) throw error
    const names = (data || []).map((g: any) => g.name).filter(Boolean)
    const merged = Array.from(new Set([...(names.length ? names : DEFAULT_GENRES)]))
    if (!merged.includes("Horror")) merged.push("Horror")
    return merged
  } catch {
    return DEFAULT_GENRES
  }
}

/* -------------------- Movies list with paging -------------------- */
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

  const key = `movies:${page}:${pageSize}:${params.search ?? ""}:${params.category ?? ""}`
  const cached = getCache<MoviesPage>(key)
  if (cached) return cached

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from("movies").select("*", { count: "exact" })

  if (params.search && params.search.trim().length > 0) {
    query = query.ilike("title", `%${params.search.trim()}%`)
  }

  if (params.category && params.category !== "All") {
    query = query.contains("genre", [params.category])
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

  if (error) {
    console.error("Error fetching paged movies:", error)
    return { items: [], total: 0, page, pageSize }
  }

  const value = { items: (data || []) as Movie[], total: count ?? 0, page, pageSize }
  setCache(key, value)
  return value
}

/* -------------------- Featured -------------------- */
export async function getFeaturedMovies(limit = 5): Promise<Movie[]> {
  const key = `featured:${limit}`
  const cached = getCache<Movie[]>(key)
  if (cached) return cached

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching featured movies:", error)
    return []
  }
  const items = (data || []).slice(0, Math.max(1, limit)) as Movie[]
  setCache(key, items)
  return items
}

/* -------------------- Admin list (used in panel) -------------------- */
export async function getMovies(): Promise<Movie[]> {
  const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching movies:", error)
    return []
  }
  return data || []
}

/* -------------------- Movie detail -------------------- */
export async function getMovieById(id: number): Promise<Movie | null> {
  const key = `movie:${id}`
  const cached = getCache<Movie | null>(key)
  if (cached !== null && cached !== undefined) return cached

  const { data: movie, error: movieErr } = await supabase.from("movies").select("*").eq("id", id).single()
  if (movieErr || !movie) {
    console.error("Error fetching movie:", movieErr)
    setCache(key, null)
    return null
  }

  let tableDownloads: MovieDownload[] = []
  const { data: dls, error: dlErr } = await supabase
    .from("movie_downloads")
    .select("*")
    .eq("movie_id", id)
    .order("position", { ascending: true })

  if (!dlErr && dls) {
    tableDownloads = dls as MovieDownload[]
  } else {
    const legacy = (movie as any).download_links
    if (Array.isArray(legacy)) {
      tableDownloads = legacy.map((x: any, idx: number) => ({ url: x?.url ?? "", position: idx + 1 }))
    }
  }

  const full = { ...(movie as Movie), movie_downloads: tableDownloads }
  setCache(key, full)
  return full
}

/* -------------------- Mutations (invalidate cache) -------------------- */
export async function addMovie(
  movie: Omit<Movie, "id" | "created_at" | "updated_at" | "movie_downloads">,
): Promise<Movie | null> {
  const { data, error } = await supabase.from("movies").insert([movie]).select().single()
  if (error) {
    console.error("Error adding movie:", error)
    return null
  }
  clearCache("movies:")
  clearCache("featured:")
  return data as Movie
}

export async function updateMovie(id: number, movie: Partial<Movie>): Promise<Movie | null> {
  const { data, error } = await supabase.from("movies").update(movie).eq("id", id).select().single()
  if (error) {
    console.error("Error updating movie:", error)
    return null
  }
  clearCache(`movie:${id}`)
  clearCache("movies:")
  clearCache("featured:")
  return data as Movie
}

export async function deleteMovie(id: number): Promise<boolean> {
  const { error } = await supabase.from("movies").delete().eq("id", id)
  if (error) {
    console.error("Error deleting movie:", error)
    return false
  }
  clearCache(`movie:${id}`)
  clearCache("movies:")
  clearCache("featured:")
  return true
}

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
    clearCache(`movie:${movieId}`)
    return
  } catch (err: any) {
    if (isRelationMissing(err)) {
      const jsonb = filtered.map((url) => ({ url }))
      await supabase.from("movies").update({ download_links: jsonb }).eq("id", movieId)
      clearCache(`movie:${movieId}`)
      return
    }
    console.error("Error saving downloads:", err)
  }
}

/* -------------------- Join Links -------------------- */
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
