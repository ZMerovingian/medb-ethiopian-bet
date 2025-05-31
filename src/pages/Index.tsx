
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
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gamepad2, Trophy, Radio, Tv, Settings } from "lucide-react";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function initializeAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (error) {
        console.error('Error getting session:', error);
        toast({
          title: "Error",
          description: "Failed to initialize authentication",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header 
        session={session} 
        onAuthClick={() => setShowAuthModal(true)}
      />
      
      <main className="pt-16">
        <Hero onGetStarted={() => setShowAuthModal(true)} />
        
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="casino" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900 border-slate-800 mb-8">
              <TabsTrigger value="casino" className="flex items-center space-x-2">
                <Gamepad2 className="w-4 h-4" />
                <span>Casino</span>
              </TabsTrigger>
              <TabsTrigger value="sports" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Sports</span>
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center space-x-2">
                <Radio className="w-4 h-4" />
                <span>Live</span>
              </TabsTrigger>
              <TabsTrigger value="livetv" className="flex items-center space-x-2">
                <Tv className="w-4 h-4" />
                <span>Live TV</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="casino">
              <GamesSection />
            </TabsContent>

            <TabsContent value="sports">
              <SportsSection />
            </TabsContent>

            <TabsContent value="live">
              <LiveSection />
            </TabsContent>

            <TabsContent value="livetv">
              <LiveSportsViewing />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Index;
