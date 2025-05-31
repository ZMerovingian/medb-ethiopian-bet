
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CreditCard, Shield, settings as SettingsIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProfileSection from "@/components/account/ProfileSection";
import VerificationSection from "@/components/account/VerificationSection";
import PaymentMethodsSection from "@/components/account/PaymentMethodsSection";
import AccountSettings from "@/components/account/AccountSettings";

interface AccountProps {
  session: Session | null;
}

const Account = ({ session }: AccountProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (!session) {
      window.location.href = '/auth';
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Please sign in to access your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('myAccount')}</h1>
          <p className="text-slate-400">Manage your profile, verification, and account settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4" />
              {t('profile')}
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4" />
              {t('verification')}
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2 text-slate-300">
              <CreditCard className="w-4 h-4" />
              {t('paymentMethods')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-slate-300">
              <SettingsIcon className="w-4 h-4" />
              {t('settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection session={session} />
          </TabsContent>

          <TabsContent value="verification">
            <VerificationSection session={session} />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentMethodsSection session={session} />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettings session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
