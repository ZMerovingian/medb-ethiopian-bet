
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Clock, TrendingUp, Users } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface Match {
  id: string;
  competition: string;
  home_team: string;
  away_team: string;
  match_date: string;
  status: string;
  home_score: number;
  away_score: number;
  odds: any;
  live_odds: any;
}

interface InternationalBettingProps {
  session: Session | null;
}

const InternationalBetting = ({ session }: InternationalBettingProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [betType, setBetType] = useState<string>("");
  const [stake, setStake] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
    if (session) {
      fetchBalance();
    }
  }, [session]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('international_matches')
        .select('*')
        .order('match_date', { ascending: true });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchBalance = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const placeBet = async (match: Match, selection: string, odds: number) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to place bets.",
        variant: "destructive",
      });
      return;
    }

    if (!stake || parseFloat(stake) <= 0) {
      toast({
        title: "Invalid stake",
        description: "Please enter a valid stake amount.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(stake) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const potentialPayout = parseFloat(stake) * odds;

      const { data, error } = await supabase
        .from('live_bets')
        .insert({
          user_id: session.user.id,
          event_id: match.id,
          bet_type: match.status === 'live' ? 'live' : 'pre_match',
          selection: selection,
          odds: odds,
          stake: parseFloat(stake),
          potential_payout: potentialPayout,
          status: 'pending'
        });

      if (error) throw error;

      // Update balance
      const newBalance = balance - parseFloat(stake);
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', session.user.id);

      if (balanceError) throw balanceError;

      setBalance(newBalance);
      setStake("");

      toast({
        title: "Bet placed successfully!",
        description: `You bet ${stake} ETB on ${selection} with potential payout of ${potentialPayout.toFixed(2)} ETB`,
      });

    } catch (error: any) {
      toast({
        title: "Bet placement failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 animate-pulse';
      case 'upcoming': return 'bg-blue-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const liveMatches = matches.filter(m => m.status === 'live');
  const finishedMatches = matches.filter(m => m.status === 'finished');

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Please sign in to access international betting.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">International Betting</h1>
        <p className="text-slate-400">Bet on international football matches</p>
        <div className="mt-4">
          <Badge className="bg-yellow-500 text-slate-900">
            Balance: {balance.toFixed(2)} ETB
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 mb-6">
          <TabsTrigger value="live" className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Live ({liveMatches.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4" />
            Upcoming ({upcomingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="finished" className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4" />
            Finished ({finishedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {liveMatches.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="text-center py-8">
                <p className="text-slate-400">No live matches at the moment</p>
              </CardContent>
            </Card>
          ) : (
            liveMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onPlaceBet={placeBet}
                stake={stake}
                setStake={setStake}
                loading={loading}
                isLive={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMatches.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onPlaceBet={placeBet}
              stake={stake}
              setStake={setStake}
              loading={loading}
              isLive={false}
            />
          ))}
        </TabsContent>

        <TabsContent value="finished" className="space-y-4">
          {finishedMatches.map((match) => (
            <Card key={match.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge className="bg-gray-500 text-white mb-2">{match.competition}</Badge>
                    <div className="text-white font-semibold">
                      {match.home_team} vs {match.away_team}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {formatDate(match.match_date)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {match.home_score} - {match.away_score}
                    </div>
                    <Badge className="bg-gray-500">Finished</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MatchCard = ({ match, onPlaceBet, stake, setStake, loading, isLive }: {
  match: Match;
  onPlaceBet: (match: Match, selection: string, odds: number) => Promise<void>;
  stake: string;
  setStake: (stake: string) => void;
  loading: boolean;
  isLive: boolean;
}) => {
  const odds = isLive ? match.live_odds : match.odds;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-500 text-white">{match.competition}</Badge>
              {isLive && <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>}
            </div>
            <div className="text-white font-semibold text-lg">
              {match.home_team} vs {match.away_team}
            </div>
            <div className="text-slate-400 text-sm flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(match.match_date)}
            </div>
          </div>
          {isLive && (
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {match.home_score} - {match.away_score}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <div className="text-center">
                  <div className="text-xs">Home Win</div>
                  <div className="font-bold">{odds?.home || 'N/A'}</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Bet on {match.home_team} to Win
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Stake (ETB)</Label>
                  <Input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter stake amount"
                  />
                </div>
                <div className="bg-slate-700 p-3 rounded">
                  <div className="text-slate-400 text-sm">Potential Payout</div>
                  <div className="text-white font-bold">
                    {stake ? (parseFloat(stake) * (odds?.home || 0)).toFixed(2) : '0.00'} ETB
                  </div>
                </div>
                <Button
                  onClick={() => onPlaceBet(match, `${match.home_team} Win`, odds?.home || 0)}
                  disabled={loading || !stake}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Placing Bet..." : "Place Bet"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <div className="text-center">
                  <div className="text-xs">Draw</div>
                  <div className="font-bold">{odds?.draw || 'N/A'}</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Bet on Draw</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Stake (ETB)</Label>
                  <Input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter stake amount"
                  />
                </div>
                <div className="bg-slate-700 p-3 rounded">
                  <div className="text-slate-400 text-sm">Potential Payout</div>
                  <div className="text-white font-bold">
                    {stake ? (parseFloat(stake) * (odds?.draw || 0)).toFixed(2) : '0.00'} ETB
                  </div>
                </div>
                <Button
                  onClick={() => onPlaceBet(match, 'Draw', odds?.draw || 0)}
                  disabled={loading || !stake}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Placing Bet..." : "Place Bet"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <div className="text-center">
                  <div className="text-xs">Away Win</div>
                  <div className="font-bold">{odds?.away || 'N/A'}</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Bet on {match.away_team} to Win
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Stake (ETB)</Label>
                  <Input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter stake amount"
                  />
                </div>
                <div className="bg-slate-700 p-3 rounded">
                  <div className="text-slate-400 text-sm">Potential Payout</div>
                  <div className="text-white font-bold">
                    {stake ? (parseFloat(stake) * (odds?.away || 0)).toFixed(2) : '0.00'} ETB
                  </div>
                </div>
                <Button
                  onClick={() => onPlaceBet(match, `${match.away_team} Win`, odds?.away || 0)}
                  disabled={loading || !stake}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Placing Bet..." : "Place Bet"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default InternationalBetting;
