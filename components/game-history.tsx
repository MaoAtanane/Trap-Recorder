"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  MobileTabsList,
  MobileTabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface Game {
  id: string;
  userId: string;
  date: string;
  gunId: string;
  chokeId: string;
  ammunitionId: string;
  club: string;
  weather: string;
  shots: Array<{
    station: number;
    shotNumber: number;
    firstShot: "hit" | "miss" | null;
    secondShot: "hit" | "miss" | null;
    score: number;
  }>;
  totalScore: number;
  hitCount: number;
  status: "completed";
}

interface Equipment {
  id: string;
  name: string;
  manufacturer?: string;
  model?: string;
}

interface GameHistoryProps {
  userId: string;
}

export default function GameHistory({ userId }: GameHistoryProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [guns, setGuns] = useState<Equipment[]>([]);
  const [chokes, setChokes] = useState<Equipment[]>([]);
  const [ammunition, setAmmunition] = useState<Equipment[]>([]);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    gunId: "",
    chokeId: "",
    ammunitionId: "",
    club: "",
    minScore: "",
    maxScore: "",
  });
  const [sortBy, setSortBy] = useState<"date" | "score" | "hitRate">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load games and equipment data
    const savedGames = localStorage.getItem(`dtl-games-${userId}`);
    const savedGuns = localStorage.getItem(`dtl-guns-${userId}`);
    const savedChokes = localStorage.getItem(`dtl-chokes-${userId}`);
    const savedAmmunition = localStorage.getItem(`dtl-ammunition-${userId}`);

    if (savedGames) setGames(JSON.parse(savedGames));
    if (savedGuns) setGuns(JSON.parse(savedGuns));
    if (savedChokes) setChokes(JSON.parse(savedChokes));
    if (savedAmmunition) setAmmunition(JSON.parse(savedAmmunition));
  }, [userId]);

  const filteredAndSortedGames = useMemo(() => {
    const filtered = games.filter((game) => {
      const gameDate = new Date(game.date);
      const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

      if (fromDate && gameDate < fromDate) return false;
      if (toDate && gameDate > toDate) return false;
      if (filters.gunId && game.gunId !== filters.gunId) return false;
      if (filters.chokeId && game.chokeId !== filters.chokeId) return false;
      if (filters.ammunitionId && game.ammunitionId !== filters.ammunitionId)
        return false;
      if (
        filters.club &&
        !game.club.toLowerCase().includes(filters.club.toLowerCase())
      )
        return false;
      if (
        filters.minScore &&
        game.totalScore < Number.parseInt(filters.minScore)
      )
        return false;
      if (
        filters.maxScore &&
        game.totalScore > Number.parseInt(filters.maxScore)
      )
        return false;

      return true;
    });

    // Sort games
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "score":
          comparison = a.totalScore - b.totalScore;
          break;
        case "hitRate":
          comparison = a.hitCount / 25 - b.hitCount / 25;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [games, filters, sortBy, sortOrder]);

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      gunId: "",
      chokeId: "",
      ammunitionId: "",
      club: "",
      minScore: "",
      maxScore: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Game History & Analytics
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Track your performance and analyze trends over time
          </p>
        </div>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        {/* Mobile-optimized tabs */}
        {isMobile ? (
          <MobileTabsList>
            <MobileTabsTrigger value="history">
              <Calendar className="h-4 w-4" />
              <span>History</span>
            </MobileTabsTrigger>
            <MobileTabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </MobileTabsTrigger>
            <MobileTabsTrigger value="equipment">
              <BarChart3 className="h-4 w-4" />
              <span>Equipment</span>
            </MobileTabsTrigger>
          </MobileTabsList>
        ) : (
          /* Desktop tabs - original layout */
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="history"
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Game History</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Performance Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="equipment"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Equipment Analysis</span>
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="history">
          <div className="space-y-6">
            <GameFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              guns={guns}
              chokes={chokes}
              ammunition={ammunition}
            />

            <GameList
              games={filteredAndSortedGames}
              guns={guns}
              chokes={chokes}
              ammunition={ammunition}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(field) => {
                if (field === sortBy) {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy(field);
                  setSortOrder("desc");
                }
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <PerformanceAnalytics games={filteredAndSortedGames} />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentAnalysis
            games={filteredAndSortedGames}
            guns={guns}
            chokes={chokes}
            ammunition={ammunition}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GameFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  guns,
  chokes,
  ammunition,
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  guns: Equipment[];
  chokes: Equipment[];
  ammunition: Equipment[];
}) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Filters</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-xs sm:text-sm"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs sm:text-sm"
            >
              {showFilters ? (
                <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {showFilters && (
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Date From</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Date To</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Min Score</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minScore}
                onChange={(e) => updateFilter("minScore", e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Max Score</Label>
              <Input
                type="number"
                placeholder="75"
                value={filters.maxScore}
                onChange={(e) => updateFilter("maxScore", e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Gun</Label>
              <Select
                value={filters.gunId}
                onValueChange={(value) => updateFilter("gunId", value)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="All guns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All guns</SelectItem>
                  {guns.map((gun) => (
                    <SelectItem key={gun.id} value={gun.id}>
                      {gun.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Choke</Label>
              <Select
                value={filters.chokeId}
                onValueChange={(value) => updateFilter("chokeId", value)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="All chokes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All chokes</SelectItem>
                  {chokes.map((choke) => (
                    <SelectItem key={choke.id} value={choke.id}>
                      {choke.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Ammunition</Label>
              <Select
                value={filters.ammunitionId}
                onValueChange={(value) => updateFilter("ammunitionId", value)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="All ammunition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ammunition</SelectItem>
                  {ammunition.map((ammo) => (
                    <SelectItem key={ammo.id} value={ammo.id}>
                      {ammo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Club</Label>
              <Input
                placeholder="Filter by club name"
                value={filters.club}
                onChange={(e) => updateFilter("club", e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function GameList({
  games,
  guns,
  chokes,
  ammunition,
  sortBy,
  sortOrder,
  onSortChange,
}: {
  games: Game[];
  guns: Equipment[];
  chokes: Equipment[];
  ammunition: Equipment[];
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: "date" | "score" | "hitRate") => void;
}) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  if (games.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No games found
          </h3>
          <p className="text-slate-600 text-center">
            No games match your current filters. Try adjusting your search
            criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Games ({games.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <Label className="text-sm">Sort by:</Label>
            <Select
              value={sortBy}
              onValueChange={(value: any) => onSortChange(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="hitRate">Hit Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {games.map((game) => {
            const gun = guns.find((g) => g.id === game.gunId);
            const choke = chokes.find((c) => c.id === game.chokeId);
            const ammo = ammunition.find((a) => a.id === game.ammunitionId);
            const hitRate = Math.round((game.hitCount / 25) * 100);

            return (
              <div
                key={game.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors gap-3"
              >
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                      {new Date(game.date).toLocaleDateString()}
                    </h4>
                    <Badge variant="outline" className="w-fit text-xs">
                      {game.club}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-slate-600">
                    <span className="truncate">
                      {gun?.name || "Unknown Gun"}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">
                      {choke?.name || "Unknown Choke"}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">
                      {ammo?.name || "Unknown Ammo"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 min-w-0">
                  <div className="text-center min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {game.totalScore}
                    </div>
                    <div className="text-xs text-slate-600">Score</div>
                  </div>
                  <div className="text-center min-w-0">
                    <div className="text-base sm:text-lg font-semibold">
                      {game.hitCount}/25
                    </div>
                    <div className="text-xs text-slate-600">{hitRate}%</div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedGame(game)}
                        className="text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                        <span className="sm:hidden">Details</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] w-full max-h-[90vh] h-[90vh] p-0 sm:p-6">
                      <DialogHeader className="flex-shrink-0 pb-4 px-4 sm:px-0">
                        <DialogTitle className="text-lg sm:text-xl">
                          Game Details -{" "}
                          {new Date(game.date).toLocaleDateString()}
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                          {game.club}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-0 pb-4">
                        {selectedGame && (
                          <GameDetails
                            game={selectedGame}
                            guns={guns}
                            chokes={chokes}
                            ammunition={ammunition}
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function GameDetails({
  game,
  guns,
  chokes,
  ammunition,
}: {
  game: Game;
  guns: Equipment[];
  chokes: Equipment[];
  ammunition: Equipment[];
}) {
  const gun = guns.find((g) => g.id === game.gunId);
  const choke = chokes.find((c) => c.id === game.chokeId);
  const ammo = ammunition.find((a) => a.id === game.ammunitionId);

  const stationStats = [1, 2, 3, 4, 5].map((station) => {
    const stationShots = game.shots.filter((s) => s.station === station);
    const stationScore = stationShots.reduce((sum, s) => sum + s.score, 0);
    const stationHits = stationShots.filter(
      (s) => s.firstShot === "hit" || s.secondShot === "hit"
    ).length;
    return {
      station,
      score: stationScore,
      hits: stationHits,
      shots: stationShots,
    };
  });

  return (
    <div className="space-y-4">
      {/* Game Info */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Equipment Used
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm sm:text-base">
            <div>
              <strong>Gun:</strong> {gun?.name || "Unknown"}
            </div>
            <div>
              <strong>Choke:</strong> {choke?.name || "Unknown"}
            </div>
            <div>
              <strong>Ammunition:</strong> {ammo?.name || "Unknown"}
            </div>
            <div>
              <strong>Weather:</strong> {game.weather || "Not specified"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm sm:text-base">
            <div>
              <strong>Total Score:</strong> {game.totalScore}/75
            </div>
            <div>
              <strong>Targets Hit:</strong> {game.hitCount}/25
            </div>
            <div>
              <strong>Hit Rate:</strong>{" "}
              {Math.round((game.hitCount / 25) * 100)}%
            </div>
            <div>
              <strong>Average per Station:</strong>{" "}
              {(game.totalScore / 5).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            Station Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stationStats.map(({ station, score, hits, shots }) => (
              <div key={station} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h4 className="font-semibold text-sm sm:text-base">
                    Station {station}
                  </h4>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {hits}/5 hits
                    </Badge>
                    <span className="font-bold text-sm sm:text-base">
                      {score}/15
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                  {shots.map((shot, index) => (
                    <div
                      key={index}
                      className={`p-1 sm:p-1.5 text-center text-xs font-medium rounded ${
                        shot.score === 3
                          ? "bg-green-100 text-green-800"
                          : shot.score === 2
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {shot.score}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PerformanceAnalytics({ games }: { games: Game[] }) {
  const chartData = useMemo(() => {
    return games
      .slice(-20) // Last 20 games
      .map((game, index) => ({
        game: index + 1,
        score: game.totalScore,
        hitRate: Math.round((game.hitCount / 25) * 100),
        date: new Date(game.date).toLocaleDateString(),
      }));
  }, [games]);

  const stats = useMemo(() => {
    if (games.length === 0) return null;

    const totalScore = games.reduce((sum, game) => sum + game.totalScore, 0);
    const totalHits = games.reduce((sum, game) => sum + game.hitCount, 0);
    const avgScore = totalScore / games.length;
    const avgHitRate = (totalHits / (games.length * 25)) * 100;
    const bestScore = Math.max(...games.map((g) => g.totalScore));
    const recentGames = games.slice(-5);
    const recentAvg =
      recentGames.reduce((sum, game) => sum + game.totalScore, 0) /
      recentGames.length;

    return {
      totalGames: games.length,
      avgScore: avgScore.toFixed(1),
      avgHitRate: avgHitRate.toFixed(1),
      bestScore,
      recentAvg: recentAvg.toFixed(1),
      improvement:
        recentGames.length >= 5
          ? (recentAvg - avgScore > 0 ? "+" : "") +
            (recentAvg - avgScore).toFixed(1)
          : null,
    };
  }, [games]);

  if (games.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No data available
          </h3>
          <p className="text-slate-600 text-center">
            Complete some games to see your performance analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {stats?.totalGames}
            </div>
            <div className="text-xs sm:text-sm text-slate-600">Total Games</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {stats?.avgScore}
            </div>
            <div className="text-xs sm:text-sm text-slate-600">
              Average Score
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {stats?.avgHitRate}%
            </div>
            <div className="text-xs sm:text-sm text-slate-600">
              Average Hit Rate
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {stats?.bestScore}
            </div>
            <div className="text-xs sm:text-sm text-slate-600">Best Score</div>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {stats?.recentAvg}
            </div>
            <div className="text-xs sm:text-sm text-slate-600">
              Recent Average
            </div>
            {stats?.improvement && (
              <div
                className={`text-xs ${
                  Number.parseFloat(stats.improvement) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stats.improvement} vs overall
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Score Progression
          </CardTitle>
          <CardDescription className="text-sm">
            Your last 20 games performance trend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="game" />
                <YAxis domain={[0, 75]} />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "score" ? "Score" : "Hit Rate (%)",
                  ]}
                  labelFormatter={(label) => `Game ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hit Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Hit Rate Progression
          </CardTitle>
          <CardDescription className="text-sm">
            Percentage of targets hit over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="game" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Hit Rate"]}
                  labelFormatter={(label) => `Game ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="hitRate"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EquipmentAnalysis({
  games,
  guns,
  chokes,
  ammunition,
}: {
  games: Game[];
  guns: Equipment[];
  chokes: Equipment[];
  ammunition: Equipment[];
}) {
  const equipmentStats = useMemo(() => {
    const gunStats = new Map();
    const chokeStats = new Map();
    const ammoStats = new Map();

    games.forEach((game) => {
      // Gun stats
      if (!gunStats.has(game.gunId)) {
        gunStats.set(game.gunId, { games: 0, totalScore: 0, totalHits: 0 });
      }
      const gunStat = gunStats.get(game.gunId);
      gunStat.games++;
      gunStat.totalScore += game.totalScore;
      gunStat.totalHits += game.hitCount;

      // Choke stats
      if (!chokeStats.has(game.chokeId)) {
        chokeStats.set(game.chokeId, { games: 0, totalScore: 0, totalHits: 0 });
      }
      const chokeStat = chokeStats.get(game.chokeId);
      chokeStat.games++;
      chokeStat.totalScore += game.totalScore;
      chokeStat.totalHits += game.hitCount;

      // Ammo stats
      if (!ammoStats.has(game.ammunitionId)) {
        ammoStats.set(game.ammunitionId, {
          games: 0,
          totalScore: 0,
          totalHits: 0,
        });
      }
      const ammoStat = ammoStats.get(game.ammunitionId);
      ammoStat.games++;
      ammoStat.totalScore += game.totalScore;
      ammoStat.totalHits += game.hitCount;
    });

    return { gunStats, chokeStats, ammoStats };
  }, [games]);

  if (games.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No equipment data
          </h3>
          <p className="text-slate-600 text-center">
            Complete some games to see equipment performance analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <EquipmentStatsTable
        title="Gun Performance"
        equipment={guns}
        stats={equipmentStats.gunStats}
      />
      <EquipmentStatsTable
        title="Choke Performance"
        equipment={chokes}
        stats={equipmentStats.chokeStats}
      />
      <EquipmentStatsTable
        title="Ammunition Performance"
        equipment={ammunition}
        stats={equipmentStats.ammoStats}
      />
    </div>
  );
}

function EquipmentStatsTable({
  title,
  equipment,
  stats,
}: {
  title: string;
  equipment: Equipment[];
  stats: Map<string, any>;
}) {
  const sortedStats = Array.from(stats.entries())
    .map(([id, stat]) => {
      const item = equipment.find((e) => e.id === id);
      return {
        id,
        name: item?.name || "Unknown",
        games: stat.games,
        avgScore: (stat.totalScore / stat.games).toFixed(1),
        avgHitRate: ((stat.totalHits / (stat.games * 25)) * 100).toFixed(1),
        totalScore: stat.totalScore,
        totalHits: stat.totalHits,
      };
    })
    .sort(
      (a, b) => Number.parseFloat(b.avgScore) - Number.parseFloat(a.avgScore)
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">
          Performance comparison across different equipment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Equipment</th>
                <th className="text-center p-2 font-medium">Games</th>
                <th className="text-center p-2 font-medium">Avg Score</th>
                <th className="text-center p-2 font-medium">Avg Hit Rate</th>
                <th className="text-center p-2 font-medium">Total Score</th>
                <th className="text-center p-2 font-medium">Total Hits</th>
              </tr>
            </thead>
            <tbody>
              {sortedStats.map((stat) => (
                <tr key={stat.id} className="border-b hover:bg-slate-50">
                  <td className="p-2 font-medium truncate max-w-24 sm:max-w-none">
                    {stat.name}
                  </td>
                  <td className="p-2 text-center">{stat.games}</td>
                  <td className="p-2 text-center font-semibold">
                    {stat.avgScore}
                  </td>
                  <td className="p-2 text-center">{stat.avgHitRate}%</td>
                  <td className="p-2 text-center">{stat.totalScore}</td>
                  <td className="p-2 text-center">{stat.totalHits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
