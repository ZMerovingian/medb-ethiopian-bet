
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Tv, Calendar, Clock, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveMatch {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  league: string;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  minute?: number;
  youtube_stream?: string;
}

const LiveSportsViewing = () => {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLiveMatches();
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMatches = async () => {
    try {
      // Mock data for now - in production, you'd connect to a real API
      const mockMatches: LiveMatch[] = [
        {
          id: '1',
          home_team: 'Arsenal',
          away_team: 'Chelsea',
          home_score: 2,
          away_score: 1,
          league: 'Premier League',
          status: 'live',
          time: '78\'',
          minute: 78,
          youtube_stream: 'dQw4w9WgXcQ' // Example YouTube ID
        },
        {
          id: '2',
          home_team: 'Saint George',
          away_team: 'Ethiopia Bunna',
          home_score: 1,
          away_score: 0,
          league: 'Ethiopian Premier League',
          status: 'live',
          time: '45\'',
          minute: 45,
          youtube_stream: 'dQw4w9WgXcQ'
        },
        {
          id: '3',
          home_team: 'Barcelona',
          away_team: 'Real Madrid',
          home_score: 0,
          away_score: 0,
          league: 'La Liga',
          status: 'upcoming',
          time: '18:00',
          youtube_stream: 'dQw4w9WgXcQ'
        }
      ];
      
      setLiveMatches(mockMatches);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching live matches:', error);
      toast({
        title: "Error",
        description: "Failed to load live matches",
        variant: "destructive",
      });
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

  const openStream = (youtubeId: string) => {
    setSelectedStream(youtubeId);
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading live sports...</p>
          </div>
        </div>
      </section>
    );
  }

  const liveMatchesData = liveMatches.filter(m => m.status === 'live');
  const upcomingMatches = liveMatches.filter(m => m.status === 'upcoming');
  const finishedMatches = liveMatches.filter(m => m.status === 'finished');

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">
            <Tv className="w-4 h-4 mr-2" />
            Live Sports Viewing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Watch Live Sports
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Stream live matches and get real-time scores from Ethiopian Premier League and international football
          </p>
        </div>

        {/* Video Player */}
        {selectedStream && (
          <div className="mb-12">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Live Stream</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedStream(null)}
                    className="border-slate-600 text-slate-300"
                  >
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedStream}?autoplay=1`}
                    title="Live Sports Stream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Matches Tabs */}
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 mb-8">
            <TabsTrigger value="live" className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Live ({liveMatchesData.length})
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

          <TabsContent value="live" className="space-y-6">
            {liveMatchesData.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="text-center py-8">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No live matches at the moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {liveMatchesData.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onWatchStream={openStream}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onWatchStream={openStream}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finished" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {finishedMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onWatchStream={openStream}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-16">
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Tv className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Live Streaming</h3>
            <p className="text-slate-400 text-sm">Official streams available</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Real-time Scores</h3>
            <p className="text-slate-400 text-sm">Live score updates</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Multiple Leagues</h3>
            <p className="text-slate-400 text-sm">Ethiopian & International</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Play className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Free Access</h3>
            <p className="text-slate-400 text-sm">No subscription required</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MatchCard = ({ match, onWatchStream }: { 
  match: LiveMatch; 
  onWatchStream: (streamId: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 animate-pulse';
      case 'upcoming': return 'bg-blue-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-blue-500 text-white text-xs">
            {match.league}
          </Badge>
          <Badge className={`${getStatusColor(match.status)} text-white`}>
            {match.status === 'live' && (
              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
            )}
            {match.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Teams and Score */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-white font-semibold text-lg mb-1">{match.home_team}</div>
              <div className="text-2xl font-bold text-white">{match.home_score}</div>
            </div>
            
            <div className="flex flex-col items-center mx-4">
              <div className="text-slate-400 text-sm mb-1">VS</div>
              <div className="text-slate-300 font-semibold">{match.time}</div>
            </div>
            
            <div className="text-center flex-1">
              <div className="text-white font-semibold text-lg mb-1">{match.away_team}</div>
              <div className="text-2xl font-bold text-white">{match.away_score}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {match.youtube_stream && (
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => onWatchStream(match.youtube_stream!)}
            >
              <Play className="w-4 h-4 mr-2" />
              {match.status === 'live' ? 'Watch Live' : match.status === 'upcoming' ? 'Preview' : 'Highlights'}
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300">
              <Activity className="w-4 h-4 mr-1" />
              Stats
            </Button>
            <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300">
              <Users className="w-4 h-4 mr-1" />
              Team Info
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveSportsViewing;
