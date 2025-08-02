"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Edit, Trash2, Save, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getJoinLinks,
  updateJoinLink,
  addJoinLink,
  type Movie,
  type JoinLink,
} from "@/lib/supabase"

interface AdminPanelProps {
  onClose: () => void
  onDataChange: () => void
}

const genreOptions = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Thriller",
  "Romance",
  "Sci-Fi",
  "Crime",
  "Horror",
  "Fantasy",
]

export default function AdminPanel({ onClose, onDataChange }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [loading, setLoading] = useState(false)

  // Movies state
  const [movies, setMovies] = useState<Movie[]>([])
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    rating: "",
    duration: "",
    selectedGenres: [] as string[],
    imageUrl: "",
    description: "",
    downloadLink1: "",
    downloadLink2: "",
    downloadLink3: "",
    featured: false,
  })

  // Join Links state
  const [joinLinks, setJoinLinks] = useState<JoinLink[]>([])
  const [editingJoinLink, setEditingJoinLink] = useState<JoinLink | null>(null)
  const [joinLinkForm, setJoinLinkForm] = useState({
    title: "",
    description: "",
    url: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    setLoading(true)
    const [moviesData, joinLinksData] = await Promise.all([getMovies(), getJoinLinks()])
    setMovies(moviesData)
    setJoinLinks(joinLinksData)
    setLoading(false)
  }

  const handleLogin = () => {
    if (password === "ankit07") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password!")
    }
  }

  const handleMovieSubmit = async () => {
    setLoading(true)
    const downloadLinks = [formData.downloadLink1, formData.downloadLink2, formData.downloadLink3]
      .filter((link) => link.trim() !== "")
      .map((url) => ({ url }))

    const movieData = {
      title: formData.title,
      year: formData.year,
      rating: formData.rating,
      duration: formData.duration,
      genre: formData.selectedGenres,
      image_url: formData.imageUrl,
      description: formData.description,
      download_links: downloadLinks,
      featured: formData.featured,
    }

    let success = false
    if (editingMovie) {
      const result = await updateMovie(editingMovie.id, movieData)
      success = !!result
    } else {
      const result = await addMovie(movieData)
      success = !!result
    }

    if (success) {
      resetForm()
      setActiveTab("list")
      await loadData()
      onDataChange()
    } else {
      alert("Error saving movie. Please try again.")
    }
    setLoading(false)
  }

  const handleDeleteMovie = async (movieId: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      setLoading(true)
      const success = await deleteMovie(movieId)
      if (success) {
        await loadData()
        onDataChange()
      } else {
        alert("Error deleting movie. Please try again.")
      }
      setLoading(false)
    }
  }

  const handleJoinLinkSubmit = async () => {
    setLoading(true)
    const linkData = {
      title: joinLinkForm.title,
      description: joinLinkForm.description,
      url: joinLinkForm.url,
    }

    let success = false
    if (editingJoinLink) {
      const result = await updateJoinLink(editingJoinLink.id, linkData)
      success = !!result
    } else {
      const result = await addJoinLink(linkData)
      success = !!result
    }

    if (success) {
      resetJoinLinkForm()
      await loadData()
    } else {
      alert("Error saving join link. Please try again.")
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      year: "",
      rating: "",
      duration: "",
      selectedGenres: [],
      imageUrl: "",
      description: "",
      downloadLink1: "",
      downloadLink2: "",
      downloadLink3: "",
      featured: false,
    })
    setEditingMovie(null)
  }

  const resetJoinLinkForm = () => {
    setJoinLinkForm({
      title: "",
      description: "",
      url: "",
    })
    setEditingJoinLink(null)
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      duration: movie.duration,
      selectedGenres: movie.genre,
      imageUrl: movie.image_url,
      description: movie.description,
      downloadLink1: movie.download_links[0]?.url || "",
      downloadLink2: movie.download_links[1]?.url || "",
      downloadLink3: movie.download_links[2]?.url || "",
      featured: movie.featured,
    })
    setActiveTab("form")
  }

  const handleEditJoinLink = (link: JoinLink) => {
    setEditingJoinLink(link)
    setJoinLinkForm({
      title: link.title,
      description: link.description,
      url: link.url,
    })
  }

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, selectedGenres: [...formData.selectedGenres, genre] })
    } else {
      setFormData({ ...formData, selectedGenres: formData.selectedGenres.filter((g) => g !== genre) })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-purple-900 to-indigo-900 border-orange-400/30 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full p-2 flex items-center justify-center">
                  <Image src="/logo.png" alt="Logo" width={20} height={20} className="w-full h-full object-contain" />
                </div>
                <CardTitle className="text-white text-xl">Admin Login</CardTitle>
              </div>
              <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-white text-sm font-medium">Password</Label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-orange-400/30 text-white pr-12 h-12 rounded-lg focus:border-teal-400"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter admin password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 h-12 text-lg rounded-lg shadow-lg"
            >
              Login to Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <Card className="w-full max-w-5xl mx-auto bg-gradient-to-br from-purple-900 to-indigo-900 border-orange-400/30 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full p-2 flex items-center justify-center">
                  <Image src="/logo.png" alt="Logo" width={20} height={20} className="w-full h-full object-contain" />
                </div>
                <CardTitle className="text-white text-2xl">Admin Panel</CardTitle>
              </div>
              <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex space-x-3 mt-4">
              <Button
                onClick={() => setActiveTab("list")}
                className={
                  activeTab === "list"
                    ? "bg-gradient-to-r from-orange-500 to-teal-500"
                    : "bg-gray-800/50 border border-gray-600 text-white hover:bg-white/10"
                }
              >
                Movie List
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("form")
                  resetForm()
                }}
                className={
                  activeTab === "form"
                    ? "bg-gradient-to-r from-orange-500 to-teal-500"
                    : "bg-gray-800/50 border border-gray-600 text-white hover:bg-white/10"
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Movie
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("join-links")
                  resetJoinLinkForm()
                }}
                className={
                  activeTab === "join-links"
                    ? "bg-gradient-to-r from-orange-500 to-teal-500"
                    : "bg-gray-800/50 border border-gray-600 text-white hover:bg-white/10"
                }
              >
                Join Links
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full animate-spin"></div>
                <span className="ml-3 text-white">Loading...</span>
              </div>
            )}

            {!loading && activeTab === "list" && (
              <div className="space-y-4">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-orange-400/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-700">
                          <img
                            src={movie.image_url || "/placeholder.svg"}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{movie.title}</h3>
                          <p className="text-gray-400 text-sm">
                            {movie.year} • {movie.rating} ⭐ {movie.featured && "• Featured"}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {movie.genre.map((g) => (
                              <Badge
                                key={g}
                                className="bg-gradient-to-r from-orange-500/20 to-teal-500/20 text-white text-xs"
                              >
                                {g}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-gray-500 text-xs mt-1">{movie.download_links.length} download link(s)</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit(movie)}
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteMovie(movie.id)} size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && activeTab === "form" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white font-medium">Movie Name</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-white/10 border-orange-400/30 text-white mt-2 h-12 focus:border-teal-400"
                      placeholder="Enter movie name"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-medium">Year</Label>
                    <Input
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="bg-white/10 border-orange-400/30 text-white mt-2 h-12 focus:border-teal-400"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-medium">Rating</Label>
                    <Input
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="bg-white/10 border-orange-400/30 text-white mt-2 h-12 focus:border-teal-400"
                      placeholder="8.5"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-medium">Duration</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-white/10 border-orange-400/30 text-white mt-2 h-12 focus:border-teal-400"
                      placeholder="120 min"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white font-medium mb-3 block">Movie Image URL</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="bg-white/10 border-orange-400/30 text-white h-12 focus:border-teal-400"
                    placeholder="https://example.com/movie-image.jpg"
                  />
                  <p className="text-gray-400 text-sm mt-2">This image will be used for both poster and banner</p>
                </div>

                <div>
                  <Label className="text-white font-medium mb-4 block">Genres</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {genreOptions.map((genre) => (
                      <div key={genre} className="flex items-center space-x-3">
                        <Checkbox
                          id={genre}
                          checked={formData.selectedGenres.includes(genre)}
                          onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                          className="border-orange-400/30"
                        />
                        <Label htmlFor={genre} className="text-white">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white font-medium">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/10 border-orange-400/30 text-white mt-2 focus:border-teal-400 placeholder:text-white/50"
                    rows={4}
                    placeholder="Enter movie description"
                  />
                </div>

                <div>
                  <Label className="text-white font-medium mb-4 block">Download Links</Label>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300 text-sm">Download Link 1 (Required)</Label>
                      <Input
                        value={formData.downloadLink1}
                        onChange={(e) => setFormData({ ...formData, downloadLink1: e.target.value })}
                        className="bg-white/10 border-orange-400/30 text-white mt-1 h-12 focus:border-teal-400"
                        placeholder="https://example.com/download1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Download Link 2 (Optional)</Label>
                      <Input
                        value={formData.downloadLink2}
                        onChange={(e) => setFormData({ ...formData, downloadLink2: e.target.value })}
                        className="bg-white/10 border-orange-400/30 text-white mt-1 h-12 focus:border-teal-400"
                        placeholder="https://example.com/download2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Download Link 3 (Optional)</Label>
                      <Input
                        value={formData.downloadLink3}
                        onChange={(e) => setFormData({ ...formData, downloadLink3: e.target.value })}
                        className="bg-white/10 border-orange-400/30 text-white mt-1 h-12 focus:border-teal-400"
                        placeholder="https://example.com/download3"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-orange-400/20">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                    className="border-orange-400/30"
                  />
                  <Label htmlFor="featured" className="text-white font-medium">
                    Show in Hero Banner (Featured Movie)
                  </Label>
                </div>

                <Button
                  onClick={handleMovieSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 h-14 text-lg rounded-lg shadow-lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editingMovie ? "Update Movie" : "Add Movie"}
                </Button>
              </div>
            )}

            {!loading && activeTab === "join-links" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Manage Join Links</h3>

                {/* Join Links List */}
                <div className="space-y-4 mb-8">
                  {joinLinks.map((link) => (
                    <div
                      key={link.id}
                      className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-orange-400/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg mb-2">{link.title}</h4>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{link.description}</p>
                          <p className="text-teal-400 text-xs">{link.url}</p>
                        </div>
                        <Button
                          onClick={() => handleEditJoinLink(link)}
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 ml-4"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Join Link Form */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <h4 className="text-white font-bold text-lg mb-4">
                    {editingJoinLink ? "Edit Join Link" : "Add New Join Link"}
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-medium">Link Title</Label>
                      <Input
                        value={joinLinkForm.title}
                        onChange={(e) => setJoinLinkForm({ ...joinLinkForm, title: e.target.value })}
                        className="bg-white/10 border-orange-400/30 text-white mt-2 h-12 focus:border-teal-400"
                        placeholder="e.g., Join Our Telegram Channel"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-medium">Description</Label>
                      <Textarea
                        value={joinLinkForm.description}
                        onChange={(e) => setJoinLinkForm({ ...joinLinkForm, description: e.target.value })}
                        className="bg-white/10 border-orange-400/30 text-white mt-2 focus:border-teal-400"
                        rows={3}
                        placeholder="Describe what users will get by joining..."
                      />
                    </div>

                    <div>
                      <Label className="text-white font-medium">Link URL</Label>
                      <Input
                        value={joinLinkForm.url}
                        onChange={(e) => setJoinLinkForm({ ...joinLinkForm, url: e.target.value })}
                        className="bg-white/10 border-orange-400/30 text-white mt-2 h-12 focus:border-teal-400"
                        placeholder="https://telegram.me/yourchannel"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={handleJoinLinkSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {editingJoinLink ? "Update Link" : "Add Link"}
                      </Button>
                      {editingJoinLink && (
                        <Button
                          onClick={resetJoinLinkForm}
                          variant="outline"
                          className="border-gray-600 text-white hover:bg-white/10 bg-transparent"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
