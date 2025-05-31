
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GamesSection from "@/components/GamesSection";
import SportsSection from "@/components/SportsSection";
import LiveSection from "@/components/LiveSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import Wallet from "@/components/Wallet";
import GamePlay from "@/components/GamePlay";
import InternationalBetting from "@/components/InternationalBetting";
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Gamepad2, Wallet as WalletIcon, Trophy, Settings } from "lucide-react";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // Redirect to home page after successful authentication
      if (session && window.location.pathname === '/auth') {
        window.location.href = '/';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setActiveTab("home");
      
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Header 
          session={session} 
          onAuthClick={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
        />
        
        <main className="pt-16">
          <Hero onGetStarted={() => window.location.href = '/auth'} />
          <GamesSection />
          <SportsSection />
          <LiveSection />
        </main>

        <Footer />

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header 
        session={session} 
        onAuthClick={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800 mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2 text-slate-300">
                <Home className="w-4 h-4" />
                Home
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-2 text-slate-300">
                <Gamepad2 className="w-4 h-4" />
                Games
              </TabsTrigger>
              <TabsTrigger value="sports" className="flex items-center gap-2 text-slate-300">
                <Trophy className="w-4 h-4" />
                Sports Betting
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2 text-slate-300">
                <WalletIcon className="w-4 h-4" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2 text-slate-300">
                <Settings className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <div className="space-y-16">
                <GamesSection />
                <SportsSection />
                <LiveSection />
              </div>
            </TabsContent>

            <TabsContent value="games">
              <GamePlay session={session} />
            </TabsContent>

            <TabsContent value="sports">
              <InternationalBetting session={session} />
            </TabsContent>

            <TabsContent value="wallet">
              <Wallet session={session} />
            </TabsContent>

            <TabsContent value="admin">
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">Access the full admin dashboard for advanced management.</p>
                <a 
                  href="/admin" 
                  className="inline-flex items-center px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Go to Admin Dashboard
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
