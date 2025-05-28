
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
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header 
        session={session} 
        onAuthClick={() => setShowAuthModal(true)}
      />
      
      <main className="pt-16">
        <Hero onGetStarted={() => setShowAuthModal(true)} />
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
};

export default Index;
