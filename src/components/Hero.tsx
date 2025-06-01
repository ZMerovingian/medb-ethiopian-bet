import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Trophy, Shield } from "lucide-react";
interface HeroProps {
  onGetStarted: () => void;
}
const Hero = ({
  onGetStarted
}: HeroProps) => {
  return <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Welcome Badge */}
          <Badge className="mb-8 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/30 text-sm px-4 py-2">Welcome to Ethiopia's Premier Betting Platform</Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-yellow-400 bg-clip-text text-transparent leading-tight">Medb</h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
            High-Performance Betting Platform
          </p>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the future of online betting with provably fair games, live sports betting, 
            and secure payments tailored for Ethiopia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" onClick={onGetStarted} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-yellow-500/25 transition-all duration-300">
              <Play className="w-5 h-5 mr-2" />
              Start Playing
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg transition-all duration-300">
              <Shield className="w-5 h-5 mr-2" />
              Provably Fair
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-2xl font-bold text-white">10,000+</span>
              </div>
              <p className="text-slate-400">Active Players</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-2xl font-bold text-white">₹50M+</span>
              </div>
              <p className="text-slate-400">Total Payouts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-2xl font-bold text-white">99.9%</span>
              </div>
              <p className="text-slate-400">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;