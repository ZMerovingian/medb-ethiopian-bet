
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, CreditCard, Settings } from "lucide-react";
import { ProfileSection } from "@/components/account/ProfileSection";
import { VerificationSection } from "@/components/account/VerificationSection";
import { PaymentMethodsSection } from "@/components/account/PaymentMethodsSection";
import { AccountSettings } from "@/components/account/AccountSettings";

const Account = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function getSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (error) {
        console.error('Error getting session:', error);
        toast({
          title: "Error",
          description: "Failed to load session",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    getSession();

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

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Access Denied</CardTitle>
            <CardDescription className="text-slate-400">Please sign in to access your account</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-4 bg-slate-900 border-slate-800">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Verification</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Payments</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSection session={session} />
            </TabsContent>

            <TabsContent value="verification">
              <VerificationSection session={session} />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentMethodsSection session={session} />
            </TabsContent>

            <TabsContent value="settings">
              <AccountSettings session={session} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Account;
