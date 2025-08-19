"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Trophy, BarChart3, Settings, LogOut, Plus, MapPin } from "lucide-react"
import EquipmentManagement from "@/components/equipment-management"
import GameScoring from "@/components/game-scoring"
import GameHistory from "@/components/game-history"
import ClubManagement from "@/components/club-management"

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface DashboardProps {
  user: User
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardStats, setDashboardStats] = useState({
    totalGames: 0,
    averageScore: 0,
    bestScore: 0,
    hitRate: 0,
  })

  useEffect(() => {
    const savedGames = localStorage.getItem(`dtl-games-${user.id}`)
    if (savedGames) {
      const games = JSON.parse(savedGames)
      if (games.length > 0) {
        const totalScore = games.reduce((sum: number, game: any) => sum + game.totalScore, 0)
        const totalHits = games.reduce((sum: number, game: any) => sum + game.hitCount, 0)
        const averageScore = totalScore / games.length
        const bestScore = Math.max(...games.map((game: any) => game.totalScore))
        const hitRate = (totalHits / (games.length * 25)) * 100

        setDashboardStats({
          totalGames: games.length,
          averageScore: Math.round(averageScore * 10) / 10,
          bestScore,
          hitRate: Math.round(hitRate * 10) / 10,
        })
      }
    }
  }, [user.id, activeTab])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">DTL Shot Tracker</h1>
                <p className="text-sm text-slate-600">Welcome back, {user.name}</p>
              </div>
            </div>

            <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="scoring" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>New Game</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Equipment</span>
            </TabsTrigger>
            <TabsTrigger value="clubs" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Clubs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                  <Target className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalGames}</div>
                  <p className="text-xs text-slate-600">
                    {dashboardStats.totalGames === 0 ? "No games recorded yet" : "Games completed"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Trophy className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.totalGames > 0 ? dashboardStats.averageScore : "-"}
                  </div>
                  <p className="text-xs text-slate-600">
                    {dashboardStats.totalGames === 0 ? "Start shooting to see stats" : "Out of 75 points"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                  <BarChart3 className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.totalGames > 0 ? dashboardStats.bestScore : "-"}
                  </div>
                  <p className="text-xs text-slate-600">Personal best</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
                  <Target className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.totalGames > 0 ? `${dashboardStats.hitRate}%` : "-"}
                  </div>
                  <p className="text-xs text-slate-600">Overall accuracy</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>
                  Ready to track your DTL performance? Start by recording your first game.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveTab("scoring")} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Game
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoring">
            <GameScoring userId={user.id} />
          </TabsContent>

          <TabsContent value="history">
            <GameHistory userId={user.id} />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentManagement userId={user.id} />
          </TabsContent>

          <TabsContent value="clubs">
            <ClubManagement userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
