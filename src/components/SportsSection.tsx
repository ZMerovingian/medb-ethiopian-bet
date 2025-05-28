
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trophy, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface SportsEvent {
  id: string;
  league: string;
  home_team: string;
  away_team: string;
  event_date: string;
  status: string;
  odds: any;
}

const SportsSection = () => {
  const [events, setEvents] = useState<SportsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('sports_events')
        .select('*')
        .in('status', ['upcoming', 'live'])
        .order('event_date', { ascending: true })
        .limit(6);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching sports events:', error);
      toast({
        title: "Error",
        description: "Failed to load sports events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLeagueBadgeColor = (league: string) => {
    if (league.includes('Ethiopian')) return 'bg-green-600';
    if (league.includes('Premier')) return 'bg-purple-600';
    return 'bg-blue-600';
  };

  if (loading) {
    return (
      <section id="sports" className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Sports Betting</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sports" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">
            <Trophy className="w-4 h-4 mr-2" />
            Live Sports Betting
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sports Betting
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Bet on Ethiopian Premier League and international football matches with competitive odds
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {events.map((event) => (
            <Card 
              key={event.id} 
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className={`${getLeagueBadgeColor(event.league)} text-white text-xs`}>
                    {event.league}
                  </Badge>
                  {event.status === 'live' && (
                    <Badge className="bg-red-600 text-white animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                      LIVE
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Teams */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-lg">{event.home_team}</span>
                    <span className="text-slate-400 text-sm">VS</span>
                    <span className="text-white font-semibold text-lg">{event.away_team}</span>
                  </div>
                  
                  <div className="flex items-center justify-center text-slate-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(event.event_date), 'MMM dd, yyyy')}
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    {format(new Date(event.event_date), 'HH:mm')}
                  </div>
                </div>

                {/* Odds */}
                {event.odds && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <Button variant="outline" className="border-slate-600 hover:border-yellow-500 hover:bg-yellow-500/10 flex flex-col py-3">
                      <span className="text-xs text-slate-400 mb-1">Home</span>
                      <span className="text-white font-bold">{event.odds.home}</span>
                    </Button>
                    <Button variant="outline" className="border-slate-600 hover:border-yellow-500 hover:bg-yellow-500/10 flex flex-col py-3">
                      <span className="text-xs text-slate-400 mb-1">Draw</span>
                      <span className="text-white font-bold">{event.odds.draw}</span>
                    </Button>
                    <Button variant="outline" className="border-slate-600 hover:border-yellow-500 hover:bg-yellow-500/10 flex flex-col py-3">
                      <span className="text-xs text-slate-400 mb-1">Away</span>
                      <span className="text-white font-bold">{event.odds.away}</span>
                    </Button>
                  </div>
                )}

                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Place Bet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sports Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Ethiopian League</h3>
            <p className="text-slate-400 text-sm">Local team coverage</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Live Betting</h3>
            <p className="text-slate-400 text-sm">Real-time odds</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Fast Settlement</h3>
            <p className="text-slate-400 text-sm">Quick payouts</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">24/7 Events</h3>
            <p className="text-slate-400 text-sm">Always something to bet</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SportsSection;
