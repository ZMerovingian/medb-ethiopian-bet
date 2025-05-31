
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GamesSection from "@/components/GamesSection";
import SportsSection from "@/components/SportsSection";
import LiveSection from "@/components/LiveSection";
import LiveSportsViewing from "@/components/LiveSportsViewing";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import Wallet from "@/components/Wallet";
import GamePlay from "@/components/GamePlay";
import InternationalBetting from "@/components/InternationalBetting";
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Gamepad2, Wallet as WalletIcon, Trophy, settings, Tv } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();
  const { t } = useLanguage();

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
          <LiveSportsViewing />
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
            <TabsList className="grid w-full grid-cols-6 bg-slate-800 mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2 text-slate-300">
                <Home className="w-4 h-4" />
                {t('home')}
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-2 text-slate-300">
                <Gamepad2 className="w-4 h-4" />
                {t('games')}
              </TabsTrigger>
              <TabsTrigger value="sports" className="flex items-center gap-2 text-slate-300">
                <Trophy className="w-4 h-4" />
                {t('sportsBetting')}
              </TabsTrigger>
              <TabsTrigger value="live-tv" className="flex items-center gap-2 text-slate-300">
                <Tv className="w-4 h-4" />
                {t('liveTV')}
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2 text-slate-300">
                <WalletIcon className="w-4 h-4" />
                {t('wallet')}
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2 text-slate-300">
                <settings className="w-4 h-4" />
                {t('admin')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <div className="space-y-16">
                <GamesSection />
                <SportsSection />
                <LiveSportsViewing />
                <LiveSection />
              </div>
            </TabsContent>

            <TabsContent value="games">
              <GamePlay session={session} />
            </TabsContent>

            <TabsContent value="sports">
              <InternationalBetting session={session} />
            </TabsContent>

            <TabsContent value="live-tv">
              <LiveSportsViewing />
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
