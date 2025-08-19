"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, Plus, Edit2, Trash2, Phone, Mail, Globe, Target } from "lucide-react"

interface Club {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  notes: string
  createdAt: string
}

interface ClubStats {
  gamesPlayed: number
  averageScore: number
  bestScore: number
  lastVisited: string
}

interface ClubManagementProps {
  userId: string
}

export default function ClubManagement({ userId }: ClubManagementProps) {
  const [clubs, setClubs] = useState<Club[]>([])
  const [clubStats, setClubStats] = useState<Map<string, ClubStats>>(new Map())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClub, setEditingClub] = useState<Club | null>(null)

  useEffect(() => {
    // Load clubs data
    const savedClubs = localStorage.getItem(`dtl-clubs-${userId}`)
    if (savedClubs) {
      setClubs(JSON.parse(savedClubs))
    }

    // Calculate club statistics from games
    const savedGames = localStorage.getItem(`dtl-games-${userId}`)
    if (savedGames) {
      const games = JSON.parse(savedGames)
      const stats = new Map<string, ClubStats>()

      games.forEach((game: any) => {
        const clubName = game.club
        if (!stats.has(clubName)) {
          stats.set(clubName, {
            gamesPlayed: 0,
            averageScore: 0,
            bestScore: 0,
            lastVisited: game.date,
          })
        }

        const clubStat = stats.get(clubName)!
        clubStat.gamesPlayed++
        clubStat.averageScore =
          (clubStat.averageScore * (clubStat.gamesPlayed - 1) + game.totalScore) / clubStat.gamesPlayed
        clubStat.bestScore = Math.max(clubStat.bestScore, game.totalScore)

        if (new Date(game.date) > new Date(clubStat.lastVisited)) {
          clubStat.lastVisited = game.date
        }
      })

      setClubStats(stats)
    }
  }, [userId])

  const saveClubs = (newClubs: Club[]) => {
    setClubs(newClubs)
    localStorage.setItem(`dtl-clubs-${userId}`, JSON.stringify(newClubs))
  }

  const handleAddClub = (club: Omit<Club, "id" | "createdAt">) => {
    const newClub: Club = {
      ...club,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    saveClubs([...clubs, newClub])
    setIsDialogOpen(false)
  }

  const handleEditClub = (club: Club) => {
    const updatedClubs = clubs.map((c) => (c.id === club.id ? club : c))
    saveClubs(updatedClubs)
    setEditingClub(null)
  }

  const handleDeleteClub = (id: string) => {
    saveClubs(clubs.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Club Management</h2>
          <p className="text-slate-600">Manage your shooting clubs and track performance by location</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Club
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Club</DialogTitle>
              <DialogDescription>Enter the details of your shooting club or range.</DialogDescription>
            </DialogHeader>
            <ClubForm onSubmit={handleAddClub} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {clubs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No clubs added yet</h3>
            <p className="text-slate-600 text-center mb-4">
              Add your shooting clubs to track performance by location and keep contact information handy.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Club
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => {
            const stats = clubStats.get(club.name)
            return (
              <ClubCard
                key={club.id}
                club={club}
                stats={stats}
                onEdit={() => setEditingClub(club)}
                onDelete={() => handleDeleteClub(club.id)}
              />
            )
          })}
        </div>
      )}

      {editingClub && (
        <Dialog open={!!editingClub} onOpenChange={() => setEditingClub(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Club</DialogTitle>
              <DialogDescription>Update the details of your shooting club.</DialogDescription>
            </DialogHeader>
            <ClubForm initialData={editingClub} onSubmit={handleEditClub} onCancel={() => setEditingClub(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ClubCard({
  club,
  stats,
  onEdit,
  onDelete,
}: {
  club: Club
  stats?: ClubStats
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>{club.name}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              {club.city}, {club.state}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="text-sm text-slate-600">
          <p>{club.address}</p>
          <p>
            {club.city}, {club.state} {club.zipCode}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          {club.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{club.phone}</span>
            </div>
          )}
          {club.email && (
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{club.email}</span>
            </div>
          )}
          {club.website && (
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="h-4 w-4 text-slate-400" />
              <a
                href={club.website.startsWith("http") ? club.website : `https://${club.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                {club.website}
              </a>
            </div>
          )}
        </div>

        {/* Performance Stats */}
        {stats && stats.gamesPlayed > 0 ? (
          <div className="border-t pt-3 space-y-2">
            <h4 className="font-semibold text-sm flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span>Performance at this club</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-semibold">{stats.gamesPlayed}</div>
                <div className="text-slate-600">Games</div>
              </div>
              <div>
                <div className="font-semibold">{stats.averageScore.toFixed(1)}</div>
                <div className="text-slate-600">Avg Score</div>
              </div>
              <div>
                <div className="font-semibold">{stats.bestScore}</div>
                <div className="text-slate-600">Best Score</div>
              </div>
              <div>
                <div className="font-semibold">{new Date(stats.lastVisited).toLocaleDateString()}</div>
                <div className="text-slate-600">Last Visit</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t pt-3">
            <p className="text-sm text-slate-500 italic">No games recorded at this club yet</p>
          </div>
        )}

        {/* Notes */}
        {club.notes && (
          <div className="border-t pt-3">
            <p className="text-sm text-slate-600">{club.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ClubForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Club
  onSubmit: (club: Club | Omit<Club, "id" | "createdAt">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
    notes: initialData?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...initialData, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Club Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., City Gun Club"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          placeholder="e.g., 123 Shooting Range Rd"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="e.g., Springfield"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
            placeholder="e.g., IL"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          value={formData.zipCode}
          onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
          placeholder="e.g., 62701"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="e.g., (555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="e.g., info@citygunclub.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
          placeholder="e.g., www.citygunclub.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional notes about this club (hours, facilities, etc.)"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? "Update Club" : "Add Club"}
        </Button>
      </div>
    </form>
  )
}
