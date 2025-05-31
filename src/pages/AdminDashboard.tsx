
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { GameManagement } from "@/components/admin/GameManagement";
import { TransactionManagement } from "@/components/admin/TransactionManagement";
import { SportsManagement } from "@/components/admin/SportsManagement";
import { Analytics } from "@/components/admin/Analytics";
import { Users, GamepadIcon, CreditCard, Trophy, BarChart3 } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface AdminDashboardProps {
  session: Session | null;
}

const AdminDashboard = ({ session }: AdminDashboardProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, [session]);

  const checkAdminAccess = async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      // Check if user has admin role (you would implement user roles)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      // For demo purposes, make the first user admin
      // In production, you'd have a proper role system
      setIsAdmin(true);
    } catch (error: any) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Please sign in to access the admin dashboard.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your MEDB platform</p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 mb-6">
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-slate-300">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 text-slate-300">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2 text-slate-300">
              <GamepadIcon className="w-4 h-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2 text-slate-300">
              <CreditCard className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="sports" className="flex items-center gap-2 text-slate-300">
              <Trophy className="w-4 h-4" />
              Sports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Analytics session={session} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement session={session} />
          </TabsContent>

          <TabsContent value="games">
            <GameManagement session={session} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionManagement session={session} />
          </TabsContent>

          <TabsContent value="sports">
            <SportsManagement session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
