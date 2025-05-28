
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dice1, Zap, Gem, Play, TrendingUp, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Game {
  id: string;
  name: string;
  type: string;
  description: string;
  min_bet: number;
  max_bet: number;
  house_edge: number;
  config: any;
}

const GamesSection = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        title: "Error",
        description: "Failed to load games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGameIcon = (type: string) => {
    switch (type) {
      case 'dice':
        return <Dice1 className="w-8 h-8" />;
      case 'crash':
        return <TrendingUp className="w-8 h-8" />;
      case 'slots':
        return <Gem className="w-8 h-8" />;
      default:
        return <Play className="w-8 h-8" />;
    }
  };

  const getGameGradient = (type: string) => {
    switch (type) {
      case 'dice':
        return 'from-blue-500 to-purple-600';
      case 'crash':
        return 'from-red-500 to-pink-600';
      case 'slots':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-yellow-500 to-orange-600';
    }
  };

  if (loading) {
    return (
      <section id="games" className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Casino Games</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="games" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Zap className="w-4 h-4 mr-2" />
            Provably Fair Games
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Casino Games
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Experience transparent, fair gaming with our cryptographically provable games
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getGameGradient(game.type)} text-white`}>
                    {getGameIcon(game.type)}
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {(game.house_edge * 100).toFixed(1)}% Edge
                  </Badge>
                </div>
                <CardTitle className="text-white text-xl">{game.name}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-slate-400 mb-4 line-clamp-2">{game.description}</p>
                
                <div className="flex justify-between text-sm text-slate-500 mb-6">
                  <span>Min: {game.min_bet} ETB</span>
                  <span>Max: {game.max_bet} ETB</span>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold group-hover:shadow-lg group-hover:shadow-yellow-500/25 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Provably Fair</h3>
            <p className="text-slate-400 text-sm">Verify every game result with cryptographic proof</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Instant Payouts</h3>
            <p className="text-slate-400 text-sm">Automatic and immediate winning payouts</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Gem className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Low House Edge</h3>
            <p className="text-slate-400 text-sm">Industry-leading favorable odds for players</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
