"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, SwordIcon as Rifle, Wrench, Package } from "lucide-react"

interface Gun {
  id: string
  name: string
  manufacturer: string
  model: string
  gauge: string
  barrelLength: string
  overChoke: string
  underChoke: string
  notes: string
  createdAt: string
}

interface Choke {
  id: string
  name: string
  manufacturer: string
  constriction: string
  type: string
  notes: string
  createdAt: string
}

interface Ammunition {
  id: string
  name: string
  manufacturer: string
  shotSize: string
  velocity: string
  weight: string
  notes: string
  createdAt: string
}

interface EquipmentManagementProps {
  userId: string
}

export default function EquipmentManagement({ userId }: EquipmentManagementProps) {
  const [guns, setGuns] = useState<Gun[]>([])
  const [chokes, setChokes] = useState<Choke[]>([])
  const [ammunition, setAmmunition] = useState<Ammunition[]>([])
  const [activeTab, setActiveTab] = useState("guns")

  useEffect(() => {
    // Load equipment data from localStorage
    const savedGuns = localStorage.getItem(`dtl-guns-${userId}`)
    const savedChokes = localStorage.getItem(`dtl-chokes-${userId}`)
    const savedAmmunition = localStorage.getItem(`dtl-ammunition-${userId}`)

    if (savedGuns) setGuns(JSON.parse(savedGuns))
    if (savedChokes) setChokes(JSON.parse(savedChokes))
    if (savedAmmunition) setAmmunition(JSON.parse(savedAmmunition))
  }, [userId])

  const saveGuns = (newGuns: Gun[]) => {
    setGuns(newGuns)
    localStorage.setItem(`dtl-guns-${userId}`, JSON.stringify(newGuns))
  }

  const saveChokes = (newChokes: Choke[]) => {
    setChokes(newChokes)
    localStorage.setItem(`dtl-chokes-${userId}`, JSON.stringify(newChokes))
  }

  const saveAmmunition = (newAmmunition: Ammunition[]) => {
    setAmmunition(newAmmunition)
    localStorage.setItem(`dtl-ammunition-${userId}`, JSON.stringify(newAmmunition))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion de l'Équipement</h2>
          <p className="text-slate-600">Gérez vos fusils, chokes et munitions pour un suivi optimal des performances</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guns" className="flex items-center space-x-2">
            <Rifle className="h-4 w-4" />
            <span>Fusils ({guns.length})</span>
          </TabsTrigger>
          <TabsTrigger value="chokes" className="flex items-center space-x-2">
            <Wrench className="h-4 w-4" />
            <span>Chokes ({chokes.length})</span>
          </TabsTrigger>
          <TabsTrigger value="ammunition" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Munitions ({ammunition.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guns">
          <GunsTab guns={guns} onSave={saveGuns} />
        </TabsContent>

        <TabsContent value="chokes">
          <ChokesTab chokes={chokes} onSave={saveChokes} />
        </TabsContent>

        <TabsContent value="ammunition">
          <AmmunitionTab ammunition={ammunition} onSave={saveAmmunition} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GunsTab({ guns, onSave }: { guns: Gun[]; onSave: (guns: Gun[]) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGun, setEditingGun] = useState<Gun | null>(null)

  const handleAddGun = (gun: Omit<Gun, "id" | "createdAt">) => {
    const newGun: Gun = {
      ...gun,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    onSave([...guns, newGun])
    setIsDialogOpen(false)
  }

  const handleEditGun = (gun: Gun) => {
    const updatedGuns = guns.map((g) => (g.id === gun.id ? gun : g))
    onSave(updatedGuns)
    setEditingGun(null)
  }

  const handleDeleteGun = (id: string) => {
    onSave(guns.filter((g) => g.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vos Fusils</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Fusil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Fusil</DialogTitle>
              <DialogDescription>Entrez les détails de votre fusil pour suivre les performances.</DialogDescription>
            </DialogHeader>
            <GunForm onSubmit={handleAddGun} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {guns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Rifle className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun fusil ajouté</h3>
            <p className="text-slate-600 text-center mb-4">
              Ajoutez votre premier fusil pour commencer à suivre les performances avec un équipement spécifique.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Votre Premier Fusil
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guns.map((gun) => (
            <Card key={gun.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{gun.name}</CardTitle>
                    <CardDescription>
                      {gun.manufacturer} {gun.model}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingGun(gun)} className="h-8 w-8 p-0">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGun(gun.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{gun.gauge}</Badge>
                  <Badge variant="outline">{gun.barrelLength} cm</Badge>
                  <Badge variant="outline">Dessus: {gun.overChoke}</Badge>
                  <Badge variant="outline">Dessous: {gun.underChoke}</Badge>
                </div>
                {gun.notes && <p className="text-sm text-slate-600">{gun.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingGun && (
        <Dialog open={!!editingGun} onOpenChange={() => setEditingGun(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le Fusil</DialogTitle>
              <DialogDescription>Mettez à jour les détails de votre fusil.</DialogDescription>
            </DialogHeader>
            <GunForm initialData={editingGun} onSubmit={handleEditGun} onCancel={() => setEditingGun(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ChokesTab({ chokes, onSave }: { chokes: Choke[]; onSave: (chokes: Choke[]) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingChoke, setEditingChoke] = useState<Choke | null>(null)

  const handleAddChoke = (choke: Omit<Choke, "id" | "createdAt">) => {
    const newChoke: Choke = {
      ...choke,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    onSave([...chokes, newChoke])
    setIsDialogOpen(false)
  }

  const handleEditChoke = (choke: Choke) => {
    const updatedChokes = chokes.map((c) => (c.id === choke.id ? choke : c))
    onSave(updatedChokes)
    setEditingChoke(null)
  }

  const handleDeleteChoke = (id: string) => {
    onSave(chokes.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vos Chokes</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Choke
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Choke</DialogTitle>
              <DialogDescription>Entrez les détails de votre tube de choke.</DialogDescription>
            </DialogHeader>
            <ChokeForm onSubmit={handleAddChoke} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {chokes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun choke ajouté</h3>
            <p className="text-slate-600 text-center mb-4">
              Ajoutez vos tubes de choke pour suivre les performances avec différentes restrictions.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Votre Premier Choke
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chokes.map((choke) => (
            <Card key={choke.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{choke.name}</CardTitle>
                    <CardDescription>
                      {choke.manufacturer} - {choke.type}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingChoke(choke)} className="h-8 w-8 p-0">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChoke(choke.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{choke.constriction}</Badge>
                  <Badge variant="outline">{choke.type}</Badge>
                </div>
                {choke.notes && <p className="text-sm text-slate-600">{choke.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingChoke && (
        <Dialog open={!!editingChoke} onOpenChange={() => setEditingChoke(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le Choke</DialogTitle>
              <DialogDescription>Mettez à jour les détails de votre choke.</DialogDescription>
            </DialogHeader>
            <ChokeForm initialData={editingChoke} onSubmit={handleEditChoke} onCancel={() => setEditingChoke(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function AmmunitionTab({
  ammunition,
  onSave,
}: { ammunition: Ammunition[]; onSave: (ammunition: Ammunition[]) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAmmo, setEditingAmmo] = useState<Ammunition | null>(null)

  const handleAddAmmo = (ammo: Omit<Ammunition, "id" | "createdAt">) => {
    const newAmmo: Ammunition = {
      ...ammo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    onSave([...ammunition, newAmmo])
    setIsDialogOpen(false)
  }

  const handleEditAmmo = (ammo: Ammunition) => {
    const updatedAmmo = ammunition.map((a) => (a.id === ammo.id ? ammo : a))
    onSave(updatedAmmo)
    setEditingAmmo(null)
  }

  const handleDeleteAmmo = (id: string) => {
    onSave(ammunition.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vos Munitions</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter des Munitions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter de la Nouvelle Munition</DialogTitle>
              <DialogDescription>Entrez les détails de votre munition.</DialogDescription>
            </DialogHeader>
            <AmmunitionForm onSubmit={handleAddAmmo} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {ammunition.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune munition ajoutée</h3>
            <p className="text-slate-600 text-center mb-4">
              Ajoutez vos types de munition pour suivre les performances avec différents charges.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Votre Première Munition
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ammunition.map((ammo) => (
            <Card key={ammo.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{ammo.name}</CardTitle>
                    <CardDescription>{ammo.manufacturer}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingAmmo(ammo)} className="h-8 w-8 p-0">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAmmo(ammo.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">#{ammo.shotSize}</Badge>
                  <Badge variant="outline">{ammo.velocity} fps</Badge>
                  <Badge variant="outline">{ammo.weight} oz</Badge>
                </div>
                {ammo.notes && <p className="text-sm text-slate-600">{ammo.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingAmmo && (
        <Dialog open={!!editingAmmo} onOpenChange={() => setEditingAmmo(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier la Munition</DialogTitle>
              <DialogDescription>Mettez à jour les détails de votre munition.</DialogDescription>
            </DialogHeader>
            <AmmunitionForm initialData={editingAmmo} onSubmit={handleEditAmmo} onCancel={() => setEditingAmmo(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Form Components
function GunForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Gun
  onSubmit: (gun: Gun | Omit<Gun, "id" | "createdAt">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    manufacturer: initialData?.manufacturer || "",
    model: initialData?.model || "",
    gauge: initialData?.gauge || "",
    barrelLength: initialData?.barrelLength || "",
    overChoke: initialData?.overChoke || "",
    underChoke: initialData?.underChoke || "",
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
        <Label htmlFor="name">Nom du Fusil</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="ex: Mon Fusil de Compétition"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Fabricant</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))}
            placeholder="ex: Beretta"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Modèle</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
            placeholder="ex: A400"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gauge">Calibre</Label>
          <Select value={formData.gauge} onValueChange={(value) => setFormData((prev) => ({ ...prev, gauge: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">Calibre 12</SelectItem>
              <SelectItem value="20">Calibre 20</SelectItem>
              <SelectItem value="28">Calibre 28</SelectItem>
              <SelectItem value="410">Calibre .410</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="barrelLength">Longueur Canon (cm)</Label>
          <Input
            id="barrelLength"
            value={formData.barrelLength}
            onChange={(e) => setFormData((prev) => ({ ...prev, barrelLength: e.target.value }))}
            placeholder="76"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="overChoke">Choke Dessus</Label>
          <Input
            id="overChoke"
            value={formData.overChoke}
            onChange={(e) => setFormData((prev) => ({ ...prev, overChoke: e.target.value }))}
            placeholder="Modified"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="underChoke">Choke Dessous</Label>
          <Input
            id="underChoke"
            value={formData.underChoke}
            onChange={(e) => setFormData((prev) => ({ ...prev, underChoke: e.target.value }))}
            placeholder="Full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optionnel)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Notes supplémentaires sur ce fusil..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? "Modifier le Fusil" : "Ajouter le Fusil"}
        </Button>
      </div>
    </form>
  )
}

function ChokeForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Choke
  onSubmit: (choke: Choke | Omit<Choke, "id" | "createdAt">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    manufacturer: initialData?.manufacturer || "",
    constriction: initialData?.constriction || "",
    type: initialData?.type || "",
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
        <Label htmlFor="name">Nom du Choke</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="ex: Competition Modified"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Fabricant</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))}
            placeholder="ex: Briley"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fixed">Fixe</SelectItem>
              <SelectItem value="Screw-in">Screw-in</SelectItem>
              <SelectItem value="Interchangeable">Interchangeable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="constriction">Restriction</Label>
        <Select
          value={formData.constriction}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, constriction: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner la restriction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cylinder">Cylinder (0.000")</SelectItem>
            <SelectItem value="Skeet">Skeet (0.005")</SelectItem>
            <SelectItem value="Improved Cylinder">Improved Cylinder (0.010")</SelectItem>
            <SelectItem value="Light Modified">Light Modified (0.015")</SelectItem>
            <SelectItem value="Modified">Modified (0.020")</SelectItem>
            <SelectItem value="Improved Modified">Improved Modified (0.025")</SelectItem>
            <SelectItem value="Light Full">Light Full (0.030")</SelectItem>
            <SelectItem value="Full">Full (0.035")</SelectItem>
            <SelectItem value="Extra Full">Extra Full (0.040"+)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optionnel)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Notes supplémentaires sur ce choke..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? "Modifier le Choke" : "Ajouter le Choke"}
        </Button>
      </div>
    </form>
  )
}

function AmmunitionForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Ammunition
  onSubmit: (ammo: Ammunition | Omit<Ammunition, "id" | "createdAt">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    manufacturer: initialData?.manufacturer || "",
    shotSize: initialData?.shotSize || "",
    velocity: initialData?.velocity || "",
    weight: initialData?.weight || "",
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
        <Label htmlFor="name">Nom de la Munition</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="ex: Competition Load"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="manufacturer">Fabricant</Label>
        <Input
          id="manufacturer"
          value={formData.manufacturer}
          onChange={(e) => setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))}
          placeholder="ex: Federal"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shotSize">Taille de la Balle</Label>
          <Select
            value={formData.shotSize}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, shotSize: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="8.5">8.5</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="7.5">7.5</SelectItem>
              <SelectItem value="7">7</SelectItem>
              <SelectItem value="6">6</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="velocity">Vitesse (fps)</Label>
          <Input
            id="velocity"
            value={formData.velocity}
            onChange={(e) => setFormData((prev) => ({ ...prev, velocity: e.target.value }))}
            placeholder="1200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Poids (oz)</Label>
          <Input
            id="weight"
            value={formData.weight}
            onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
            placeholder="1 1/8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optionnel)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Notes supplémentaires sur cette munition..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? "Modifier la Munition" : "Ajouter la Munition"}
        </Button>
      </div>
    </form>
  )
}
