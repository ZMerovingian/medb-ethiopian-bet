
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Eye, Lock } from "lucide-react";

const LiveSection = () => {
  const liveStreams = [
    {
      id: 1,
      title: "Ethiopian Premier League Live",
      description: "Saint George vs Ethiopia Bunna",
      viewers: 1250,
      category: "Football",
      thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=225&fit=crop"
    },
    {
      id: 2,
      title: "International Football",
      description: "Arsenal vs Chelsea",
      viewers: 3400,
      category: "Football",
      thumbnail: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=225&fit=crop"
    },
    {
      id: 3,
      title: "Casino Game Show",
      description: "Live Dealer Games",
      viewers: 890,
      category: "Casino",
      thumbnail: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=225&fit=crop"
    }
  ];

  return (
    <section id="live" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Play className="w-4 h-4 mr-2" />
            Live Streaming
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Streams
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Watch live sports events and casino games while placing your bets
          </p>
        </div>

        {/* Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {liveStreams.map((stream) => (
            <Card 
              key={stream.id} 
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <img 
                  src={stream.thumbnail} 
                  alt={stream.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="lg" className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30">
                    <Play className="w-6 h-6 mr-2" />
                    Watch Live
                  </Button>
                </div>
                <Badge className="absolute top-3 right-3 bg-red-600 text-white animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  LIVE
                </Badge>
                <Badge className="absolute top-3 left-3 bg-black/60 text-white">
                  {stream.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg line-clamp-1">{stream.title}</CardTitle>
                <p className="text-slate-400 text-sm">{stream.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {stream.viewers.toLocaleString()} viewers
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    HD Quality
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Stream
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Access Notice */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Premium Content</h3>
              <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                Live streaming is available exclusively for registered users. Sign up now to access 
                high-quality sports streams and live casino games.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold">
                  Create Account
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveSection;
