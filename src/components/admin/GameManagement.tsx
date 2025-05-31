
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface Game {
  id: string;
  name: string;
  type: string;
  description: string;
  min_bet: number;
  max_bet: number;
  house_edge: number;
  is_active: boolean;
}

interface GameManagementProps {
  session: Session;
}

export const GameManagement = ({ session }: GameManagementProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        title: "Error",
        description: "Failed to fetch games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleGameStatus = async (gameId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ is_active: isActive })
        .eq('id', gameId);

      if (error) throw error;

      setGames(games.map(game => 
        game.id === gameId ? { ...game, is_active: isActive } : game
      ));

      toast({
        title: "Success",
        description: `Game ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateGame = async (gameData: Partial<Game>) => {
    try {
      const { error } = await supabase
        .from('games')
        .update(gameData)
        .eq('id', selectedGame?.id);

      if (error) throw error;

      fetchGames();
      setSelectedGame(null);

      toast({
        title: "Success",
        description: "Game updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createGame = async (gameData: Omit<Game, 'id'>) => {
    try {
      const { error } = await supabase
        .from('games')
        .insert(gameData);

      if (error) throw error;

      fetchGames();
      setIsCreateMode(false);

      toast({
        title: "Success",
        description: "Game created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Game Management</CardTitle>
              <CardDescription className="text-slate-400">
                Configure and manage casino games
              </CardDescription>
            </div>
            <Dialog open={isCreateMode} onOpenChange={setIsCreateMode}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Game
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Game</DialogTitle>
                </DialogHeader>
                <GameForm onSubmit={createGame} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Min Bet</TableHead>
                <TableHead className="text-slate-300">Max Bet</TableHead>
                <TableHead className="text-slate-300">House Edge</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id} className="border-slate-700">
                  <TableCell className="text-white font-medium">{game.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                      {game.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{game.min_bet} ETB</TableCell>
                  <TableCell className="text-white">{game.max_bet} ETB</TableCell>
                  <TableCell className="text-white">{(game.house_edge * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Switch
                      checked={game.is_active}
                      onCheckedChange={(checked) => toggleGameStatus(game.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedGame(game)}
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Edit Game</DialogTitle>
                        </DialogHeader>
                        {selectedGame && (
                          <GameForm 
                            game={selectedGame} 
                            onSubmit={updateGame}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const GameForm = ({ game, onSubmit }: { 
  game?: Game; 
  onSubmit: (data: any) => void; 
}) => {
  const [formData, setFormData] = useState({
    name: game?.name || '',
    type: game?.type || '',
    description: game?.description || '',
    min_bet: game?.min_bet || 1,
    max_bet: game?.max_bet || 1000,
    house_edge: game?.house_edge || 0.02,
    is_active: game?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-slate-300">Game Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>

      <div>
        <Label className="text-slate-300">Game Type</Label>
        <Input
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>

      <div>
        <Label className="text-slate-300">Description</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Min Bet (ETB)</Label>
          <Input
            type="number"
            value={formData.min_bet}
            onChange={(e) => setFormData({ ...formData, min_bet: parseFloat(e.target.value) })}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>

        <div>
          <Label className="text-slate-300">Max Bet (ETB)</Label>
          <Input
            type="number"
            value={formData.max_bet}
            onChange={(e) => setFormData({ ...formData, max_bet: parseFloat(e.target.value) })}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-slate-300">House Edge (0.0 - 1.0)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={formData.house_edge}
          onChange={(e) => setFormData({ ...formData, house_edge: parseFloat(e.target.value) })}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active" className="text-slate-300">Active</Label>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        {game ? 'Update Game' : 'Create Game'}
      </Button>
    </form>
  );
};
