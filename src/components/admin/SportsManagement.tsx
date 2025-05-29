
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Play, Square } from "lucide-react";
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
}

interface SportsManagementProps {
  session: Session;
}

export const SportsManagement = ({ session }: SportsManagementProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
  }, []);

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
      toast({
        title: "Error",
        description: "Failed to fetch matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMatchStatus = async (matchId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('international_matches')
        .update({ status })
        .eq('id', matchId);

      if (error) throw error;

      setMatches(matches.map(match => 
        match.id === matchId ? { ...match, status } : match
      ));

      toast({
        title: "Success",
        description: `Match status updated to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateMatch = async (matchData: Partial<Match>) => {
    try {
      const { error } = await supabase
        .from('international_matches')
        .update(matchData)
        .eq('id', selectedMatch?.id);

      if (error) throw error;

      fetchMatches();
      setSelectedMatch(null);

      toast({
        title: "Success",
        description: "Match updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      const { error } = await supabase
        .from('international_matches')
        .insert(matchData);

      if (error) throw error;

      fetchMatches();
      setIsCreateMode(false);

      toast({
        title: "Success",
        description: "Match created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
              <CardTitle className="text-white">Sports Management</CardTitle>
              <CardDescription className="text-slate-400">
                Manage international football matches and betting
              </CardDescription>
            </div>
            <Dialog open={isCreateMode} onOpenChange={setIsCreateMode}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Match
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Match</DialogTitle>
                </DialogHeader>
                <MatchForm onSubmit={createMatch} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Match</TableHead>
                <TableHead className="text-slate-300">Competition</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Score</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id} className="border-slate-700">
                  <TableCell>
                    <div className="text-white font-medium">
                      {match.home_team} vs {match.away_team}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                      {match.competition}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {new Date(match.match_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-white">
                    {match.home_score} - {match.away_score}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(match.status)} text-white`}>
                      {match.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedMatch(match)}
                            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white">Edit Match</DialogTitle>
                          </DialogHeader>
                          {selectedMatch && (
                            <MatchForm 
                              match={selectedMatch} 
                              onSubmit={updateMatch}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {match.status === 'upcoming' && (
                        <Button
                          size="sm"
                          onClick={() => updateMatchStatus(match.id, 'live')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {match.status === 'live' && (
                        <Button
                          size="sm"
                          onClick={() => updateMatchStatus(match.id, 'finished')}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
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

const MatchForm = ({ match, onSubmit }: { 
  match?: Match; 
  onSubmit: (data: any) => void; 
}) => {
  const [formData, setFormData] = useState({
    competition: match?.competition || '',
    home_team: match?.home_team || '',
    away_team: match?.away_team || '',
    match_date: match?.match_date ? new Date(match.match_date).toISOString().slice(0, 16) : '',
    home_score: match?.home_score || 0,
    away_score: match?.away_score || 0,
    status: match?.status || 'upcoming',
    odds: match?.odds || { home: 2.0, draw: 3.0, away: 3.5 }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      match_date: new Date(formData.match_date).toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Competition</Label>
          <Input
            value={formData.competition}
            onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>

        <div>
          <Label className="text-slate-300">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Home Team</Label>
          <Input
            value={formData.home_team}
            onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>

        <div>
          <Label className="text-slate-300">Away Team</Label>
          <Input
            value={formData.away_team}
            onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-slate-300">Match Date</Label>
        <Input
          type="datetime-local"
          value={formData.match_date}
          onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Home Score</Label>
          <Input
            type="number"
            value={formData.home_score}
            onChange={(e) => setFormData({ ...formData, home_score: parseInt(e.target.value) || 0 })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label className="text-slate-300">Away Score</Label>
          <Input
            type="number"
            value={formData.away_score}
            onChange={(e) => setFormData({ ...formData, away_score: parseInt(e.target.value) || 0 })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-slate-300">Home Odds</Label>
          <Input
            type="number"
            step="0.1"
            value={formData.odds.home}
            onChange={(e) => setFormData({ 
              ...formData, 
              odds: { ...formData.odds, home: parseFloat(e.target.value) || 0 }
            })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label className="text-slate-300">Draw Odds</Label>
          <Input
            type="number"
            step="0.1"
            value={formData.odds.draw}
            onChange={(e) => setFormData({ 
              ...formData, 
              odds: { ...formData.odds, draw: parseFloat(e.target.value) || 0 }
            })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label className="text-slate-300">Away Odds</Label>
          <Input
            type="number"
            step="0.1"
            value={formData.odds.away}
            onChange={(e) => setFormData({ 
              ...formData, 
              odds: { ...formData.odds, away: parseFloat(e.target.value) || 0 }
            })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        {match ? 'Update Match' : 'Create Match'}
      </Button>
    </form>
  );
};
