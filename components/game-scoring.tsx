"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  Save,
  Clock,
  Zap,
  Settings,
} from "lucide-react";

interface Gun {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  overChoke: string;
  underChoke: string;
}

interface Choke {
  id: string;
  name: string;
  manufacturer: string;
  constriction: string;
}

interface Ammunition {
  id: string;
  name: string;
  manufacturer: string;
  shotSize: string;
}

interface Club {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface Shot {
  station: number;
  shotNumber: number;
  firstShot: "hit" | "miss" | null;
  secondShot: "hit" | "miss" | null;
  score: number | null;
}

interface Game {
  id: string;
  userId: string;
  date: string;
  gunId: string;
  overChokeId: string;
  underChokeId: string;
  ammunitionId: string;
  club: string;
  weather: string;
  shots: Shot[];
  totalScore: number;
  hitCount: number;
  status: "setup" | "in-progress" | "completed";
}

interface GameScoringProps {
  userId: string;
}

export default function GameScoring({ userId }: GameScoringProps) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [guns, setGuns] = useState<Gun[]>([]);
  const [chokes, setChokes] = useState<Choke[]>([]);
  const [ammunition, setAmmunition] = useState<Ammunition[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  useEffect(() => {
    // Load equipment data
    const savedGuns = localStorage.getItem(`dtl-guns-${userId}`);
    const savedChokes = localStorage.getItem(`dtl-chokes-${userId}`);
    const savedAmmunition = localStorage.getItem(`dtl-ammunition-${userId}`);
    const savedClubs = localStorage.getItem(`dtl-clubs-${userId}`);

    if (savedGuns) setGuns(JSON.parse(savedGuns));
    if (savedChokes) setChokes(JSON.parse(savedChokes));
    if (savedAmmunition) setAmmunition(JSON.parse(savedAmmunition));
    if (savedClubs) setClubs(JSON.parse(savedClubs));

    // Check for existing in-progress game
    const savedGame = localStorage.getItem(`dtl-current-game-${userId}`);
    if (savedGame) {
      setCurrentGame(JSON.parse(savedGame));
    }
  }, [userId]);

  const initializeGame = (gameSetup: {
    gunId: string;
    overChokeId: string;
    underChokeId: string;
    ammunitionId: string;
    club: string;
    weather: string;
  }) => {
    const shots: Shot[] = [];

    // Initialize 25 shots (5 stations × 5 shots each)
    for (let station = 1; station <= 5; station++) {
      for (let shotNumber = 1; shotNumber <= 5; shotNumber++) {
        shots.push({
          station,
          shotNumber,
          firstShot: null,
          secondShot: null,
          score: null,
        });
      }
    }

    const newGame: Game = {
      id: Date.now().toString(),
      userId,
      date: new Date().toISOString(),
      ...gameSetup,
      shots,
      totalScore: 0,
      hitCount: 0,
      status: "in-progress",
    };

    setCurrentGame(newGame);
    localStorage.setItem(`dtl-current-game-${userId}`, JSON.stringify(newGame));
  };

  const quickStart = () => {
    const defaultSetup = {
      gunId: guns.length === 1 ? guns[0].id : "",
      overChokeId: chokes.length === 1 ? chokes[0].id : "",
      underChokeId: chokes.length === 1 ? chokes[0].id : "",
      ammunitionId: ammunition.length === 1 ? ammunition[0].id : "",
      club: clubs.length === 1 ? clubs[0].name : "",
      weather: "",
    };
    initializeGame(defaultSetup);
  };

  const updateShotScore = (shotIndex: number) => {
    if (!currentGame) return;

    const updatedShots = [...currentGame.shots];
    const shot = updatedShots[shotIndex];

    // 4-click cycle: empty → 3 → 2 → 0 → empty
    if (shot.score === null) {
      // Empty → 3 points (first shot hit)
      shot.firstShot = "hit";
      shot.secondShot = null;
      shot.score = 3;
    } else if (shot.score === 3) {
      // 3 → 2 points (first shot miss, second shot hit)
      shot.firstShot = "miss";
      shot.secondShot = "hit";
      shot.score = 2;
    } else if (shot.score === 2) {
      // 2 → 0 points (both shots miss)
      shot.firstShot = "miss";
      shot.secondShot = "miss";
      shot.score = 0;
    } else {
      // 0 → empty (reset)
      shot.firstShot = null;
      shot.secondShot = null;
      shot.score = null;
    }

    // Calculate totals
    const totalScore = updatedShots.reduce((sum, s) => sum + (s.score || 0), 0);
    const hitCount = updatedShots.filter(
      (s) => s.firstShot === "hit" || s.secondShot === "hit"
    ).length;

    const updatedGame = {
      ...currentGame,
      shots: updatedShots,
      totalScore,
      hitCount,
    };

    setCurrentGame(updatedGame);
    localStorage.setItem(
      `dtl-current-game-${userId}`,
      JSON.stringify(updatedGame)
    );
  };

  const completeGame = () => {
    if (!currentGame) return;

    const completedGame = {
      ...currentGame,
      status: "completed" as const,
    };

    // Save to games history
    const existingGames = JSON.parse(
      localStorage.getItem(`dtl-games-${userId}`) || "[]"
    );
    existingGames.push(completedGame);
    localStorage.setItem(`dtl-games-${userId}`, JSON.stringify(existingGames));

    // Clear current game
    localStorage.removeItem(`dtl-current-game-${userId}`);
    setCurrentGame(null);
    setShowCompletionDialog(false);
  };

  const resetGame = () => {
    if (currentGame) {
      localStorage.removeItem(`dtl-current-game-${userId}`);
      setCurrentGame(null);
    }
  };

  if (!currentGame) {
    return (
      <GameSetup
        onStart={initializeGame}
        onQuickStart={quickStart}
        guns={guns}
        chokes={chokes}
        ammunition={ammunition}
        clubs={clubs}
      />
    );
  }

  // Check if game is complete for showing save button
  const isGameComplete = currentGame.shots.every((s) => s.score !== null);

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      <GameHeader
        game={currentGame}
        guns={guns}
        chokes={chokes}
        ammunition={ammunition}
        onReset={resetGame}
      />
      <ScoringGrid game={currentGame} onUpdateShot={updateShotScore} />
      <GameStats game={currentGame} />

      {/* Save Game Button - only show when game is complete */}
      {isGameComplete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Partie Terminée !</span>
              </div>
              <p className="text-sm text-green-600">
                Tous les coups ont été enregistrés. Vous pouvez maintenant
                sauvegarder votre partie.
              </p>
              <Button
                onClick={completeGame}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder la Partie
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partie Terminée !</DialogTitle>
            <DialogDescription>
              Félicitations ! Vous avez terminé votre série DTL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {currentGame.totalScore}/75
              </div>
              <p className="text-slate-600">Score Final</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-semibold">
                  {currentGame.hitCount}/25
                </div>
                <p className="text-sm text-slate-600">Plateaux Touchés</p>
              </div>
              <div>
                <div className="text-xl font-semibold">
                  {Math.round((currentGame.hitCount / 25) * 100)}%
                </div>
                <p className="text-sm text-slate-600">Taux de Réussite</p>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-700 text-center">
                ✅ Tous les coups ont été enregistrés (1er et 2ème coup pour
                chaque position)
              </p>
            </div>
            <Button
              onClick={completeGame}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder la Partie
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GameSetup({
  onStart,
  onQuickStart,
  guns,
  chokes,
  ammunition,
  clubs,
}: {
  onStart: (setup: any) => void;
  onQuickStart: () => void;
  guns: Gun[];
  chokes: Choke[];
  ammunition: Ammunition[];
  clubs: Club[];
}) {
  const [setup, setSetup] = useState({
    gunId: "",
    overChokeId: "",
    underChokeId: "",
    ammunitionId: "",
    club: "",
    weather: "",
  });

  useEffect(() => {
    if (guns.length === 1 && !setup.gunId) {
      setSetup((prev) => ({ ...prev, gunId: guns[0].id }));
    }
    if (chokes.length === 1 && !setup.overChokeId) {
      setSetup((prev) => ({
        ...prev,
        overChokeId: chokes[0].id,
        underChokeId: chokes[0].id,
      }));
    }
    if (ammunition.length === 1 && !setup.ammunitionId) {
      setSetup((prev) => ({ ...prev, ammunitionId: ammunition[0].id }));
    }
    if (clubs.length === 1 && !setup.club) {
      setSetup((prev) => ({ ...prev, club: clubs[0].name }));
    }
  }, [
    guns,
    chokes,
    ammunition,
    clubs,
    setup.gunId,
    setup.overChokeId,
    setup.ammunitionId,
    setup.club,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(setup);
  };

  return (
    <Card className="max-w-4xl mx-auto m-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
          <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <span>Nouvelle Série DTL</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Commencez rapidement ou configurez votre équipement en détail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                Démarrage Rapide
              </h3>
              <p className="text-blue-700 text-sm">
                Commencez immédiatement avec vos équipements par défaut.
              </p>
            </div>
            <Button
              onClick={onQuickStart}
              className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2 h-12 sm:h-auto"
            >
              <Zap className="h-4 w-4" />
              <span>Commencer</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger
              value="basic"
              className="flex items-center space-x-2 text-sm"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Configuration </span>
              <span>Basique</span>
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="flex items-center space-x-2 text-sm"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configuration </span>
              <span>Avancée</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gun">Fusil</Label>
                  <Select
                    value={setup.gunId}
                    onValueChange={(value) =>
                      setSetup((prev) => ({ ...prev, gunId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre fusil" />
                    </SelectTrigger>
                    <SelectContent>
                      {guns.map((gun) => (
                        <SelectItem key={gun.id} value={gun.id}>
                          {gun.name} ({gun.manufacturer} {gun.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {guns.length === 0 && (
                    <p className="text-sm text-slate-600">
                      Aucun fusil disponible. Ajoutez d'abord votre équipement.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club">Club/Lieu</Label>
                  {clubs.length > 0 ? (
                    <Select
                      value={setup.club}
                      onValueChange={(value) =>
                        setSetup((prev) => ({ ...prev, club: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un club" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubs.map((club) => (
                          <SelectItem key={club.id} value={club.name}>
                            {club.name} - {club.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="club"
                      value={setup.club}
                      onChange={(e) =>
                        setSetup((prev) => ({ ...prev, club: e.target.value }))
                      }
                      placeholder="ex: Club de Tir Municipal"
                    />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                <Target className="h-4 w-4 mr-2" />
                Commencer la Série DTL
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="advanced">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gun">Fusil</Label>
                  <Select
                    value={setup.gunId}
                    onValueChange={(value) =>
                      setSetup((prev) => ({ ...prev, gunId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre fusil" />
                    </SelectTrigger>
                    <SelectContent>
                      {guns.map((gun) => (
                        <SelectItem key={gun.id} value={gun.id}>
                          {gun.name} ({gun.manufacturer} {gun.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ammunition">Munitions</Label>
                  <Select
                    value={setup.ammunitionId}
                    onValueChange={(value) =>
                      setSetup((prev) => ({ ...prev, ammunitionId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez vos munitions" />
                    </SelectTrigger>
                    <SelectContent>
                      {ammunition.map((ammo) => (
                        <SelectItem key={ammo.id} value={ammo.id}>
                          {ammo.name} (#{ammo.shotSize})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overChoke">Choke Dessus</Label>
                  <Select
                    value={setup.overChokeId}
                    onValueChange={(value) =>
                      setSetup((prev) => ({ ...prev, overChokeId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choke canon dessus" />
                    </SelectTrigger>
                    <SelectContent>
                      {chokes.map((choke) => (
                        <SelectItem key={choke.id} value={choke.id}>
                          {choke.name} ({choke.constriction})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="underChoke">Choke Dessous</Label>
                  <Select
                    value={setup.underChokeId}
                    onValueChange={(value) =>
                      setSetup((prev) => ({ ...prev, underChokeId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choke canon dessous" />
                    </SelectTrigger>
                    <SelectContent>
                      {chokes.map((choke) => (
                        <SelectItem key={choke.id} value={choke.id}>
                          {choke.name} ({choke.constriction})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club">Club/Lieu</Label>
                  {clubs.length > 0 ? (
                    <Select
                      value={setup.club}
                      onValueChange={(value) =>
                        setSetup((prev) => ({ ...prev, club: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un club" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubs.map((club) => (
                          <SelectItem key={club.id} value={club.name}>
                            {club.name} - {club.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="club"
                      value={setup.club}
                      onChange={(e) =>
                        setSetup((prev) => ({ ...prev, club: e.target.value }))
                      }
                      placeholder="ex: Club de Tir Municipal"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weather">Conditions Météorologiques</Label>
                  <Input
                    id="weather"
                    value={setup.weather}
                    onChange={(e) =>
                      setSetup((prev) => ({ ...prev, weather: e.target.value }))
                    }
                    placeholder="ex: Ensoleillé, vent léger de gauche"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                <Target className="h-4 w-4 mr-2" />
                Commencer la Série DTL
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function GameHeader({
  game,
  guns,
  chokes,
  ammunition,
  onReset,
}: {
  game: Game;
  guns: Gun[];
  chokes: Choke[];
  ammunition: Ammunition[];
  onReset: () => void;
}) {
  const gun = guns.find((g) => g.id === game.gunId);
  const overChoke = chokes.find((c) => c.id === game.overChokeId);
  const underChoke = chokes.find((c) => c.id === game.underChokeId);
  const ammo = ammunition.find((a) => a.id === game.ammunitionId);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Série DTL en Cours</span>
            </CardTitle>
            <CardDescription className="text-sm">
              {new Date(game.date).toLocaleDateString("fr-FR")} à{" "}
              {game.club || "Lieu non spécifié"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={onReset}
            className="text-red-600 hover:text-red-700 bg-transparent h-10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Réinitialiser</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 text-sm">
          <div>
            <p className="text-sm font-medium text-slate-600">Fusil</p>
            <p className="text-sm">{gun?.name || "Non spécifié"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Choke Dessus</p>
            <p className="text-sm">{overChoke?.name || "Non spécifié"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Choke Dessous</p>
            <p className="text-sm">{underChoke?.name || "Non spécifié"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Munitions</p>
            <p className="text-sm">{ammo?.name || "Non spécifiées"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Météo</p>
            <p className="text-sm">{game.weather || "Non spécifiée"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoringGrid({
  game,
  onUpdateShot,
}: {
  game: Game;
  onUpdateShot: (shotIndex: number) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Grille de Score</CardTitle>
        <CardDescription className="text-sm">
          Cliquez plusieurs fois : Vide → 3pts (1er coup touché) → 2pts (1er
          raté, 2ème touché) → 0pt (2 coups ratés) → Vide
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((station) => (
            <div key={station} className="space-y-3">
              <h3 className="font-semibold text-base sm:text-lg">
                Poste {station}
              </h3>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {game.shots
                  .filter((shot) => shot.station === station)
                  .map((shot, index) => {
                    const shotIndex = game.shots.findIndex((s) => s === shot);
                    return (
                      <ShotButton
                        key={`${station}-${shot.shotNumber}`}
                        shot={shot}
                        shotNumber={shot.shotNumber}
                        onUpdate={() => onUpdateShot(shotIndex)}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ShotButton({
  shot,
  shotNumber,
  onUpdate,
}: {
  shot: Shot;
  shotNumber: number;
  onUpdate: () => void;
}) {
  const getButtonColor = () => {
    if (shot.score === 3) return "bg-green-500 hover:bg-green-600 text-white";
    if (shot.score === 2) return "bg-yellow-500 hover:bg-yellow-600 text-white";
    if (shot.score === 0) return "bg-red-500 hover:bg-red-600 text-white";
    return "bg-slate-200 hover:bg-slate-300 text-slate-700 border-2 border-dashed border-slate-400";
  };

  return (
    <div className="text-center">
      <Button
        onClick={onUpdate}
        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg font-bold text-base sm:text-lg ${getButtonColor()} touch-manipulation`}
      >
        {shot.score !== null ? shot.score : ""}
      </Button>
      <p className="text-xs text-slate-600 mt-1">Coup {shotNumber}</p>
      <div className="flex justify-center space-x-1 mt-1">
        {shot.firstShot === "hit" && (
          <CheckCircle className="h-3 w-3 text-green-600" />
        )}
        {shot.firstShot === "miss" && (
          <XCircle className="h-3 w-3 text-red-600" />
        )}
        {shot.secondShot === "hit" && (
          <CheckCircle className="h-3 w-3 text-yellow-600" />
        )}
        {shot.secondShot === "miss" && (
          <XCircle className="h-3 w-3 text-red-600" />
        )}
      </div>
    </div>
  );
}

function GameStats({ game }: { game: Game }) {
  const stationStats = [1, 2, 3, 4, 5].map((station) => {
    const stationShots = game.shots.filter((s) => s.station === station);
    const stationScore = stationShots.reduce(
      (sum, s) => sum + (s.score || 0),
      0
    );
    const stationHits = stationShots.filter(
      (s) => s.firstShot === "hit" || s.secondShot === "hit"
    ).length;
    return { station, score: stationScore, hits: stationHits };
  });

  const completeShots = game.shots.filter(
    (s) => s.firstShot !== null && s.secondShot !== null
  ).length;
  const totalShots = game.shots.length;
  const progressPercentage = Math.round((completeShots / totalShots) * 100);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Score Actuel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600">
              {game.totalScore}/75
            </div>
            <div className="text-base sm:text-lg text-slate-600">
              {game.hitCount}/25 plateaux touchés
            </div>
            <div className="text-sm text-slate-500">
              {Math.round((game.hitCount / 25) * 100)}% de réussite
            </div>
            <div className="mt-3 p-2 bg-slate-50 rounded border">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Progression</span>
                <span>
                  {completeShots}/{totalShots} coups complets
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {progressPercentage}% terminé
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Détail par Poste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stationStats.map(({ station, score, hits }) => (
              <div key={station} className="flex justify-between items-center">
                <span className="text-sm font-medium">Poste {station}</span>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    {hits}/5
                  </Badge>
                  <span className="text-sm font-bold w-8">{score}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
