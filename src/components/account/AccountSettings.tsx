
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, Bell } from "lucide-react";

interface AccountSettingsProps {
  session: Session | null;
}

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  login_alerts: boolean;
}

const AccountSettings = ({ session }: AccountSettingsProps) => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    push: true,
    email: true,
    sms: false
  });
  const [security, setSecurity] = useState<SecuritySettings>({
    two_factor_enabled: false,
    login_alerts: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_settings, security_settings')
        .eq('user_id', session?.user?.id)
        .single();

      if (error) throw error;

      if (data?.notification_settings && typeof data.notification_settings === 'object') {
        const notifSettings = data.notification_settings as any;
        setNotifications({
          push: notifSettings.push || false,
          email: notifSettings.email || false,
          sms: notifSettings.sms || false
        });
      }

      if (data?.security_settings && typeof data.security_settings === 'object') {
        const secSettings = data.security_settings as any;
        setSecurity({
          two_factor_enabled: secSettings.two_factor_enabled || false,
          login_alerts: secSettings.login_alerts || false
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateNotificationSettings = async (newSettings: NotificationSettings) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_settings: newSettings })
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setNotifications(newSettings);
      toast({
        title: "Notification settings updated",
        description: "Your preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSecuritySettings = async (newSettings: SecuritySettings) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ security_settings: newSettings })
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setSecurity(newSettings);
      toast({
        title: "Security settings updated",
        description: "Your security preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.deleteUser(session?.user?.id || '');
      
      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-slate-400">
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300">Push Notifications</Label>
              <p className="text-sm text-slate-500">Receive push notifications in your browser</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => 
                updateNotificationSettings({ ...notifications, push: checked })
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300">Email Notifications</Label>
              <p className="text-sm text-slate-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => 
                updateNotificationSettings({ ...notifications, email: checked })
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300">SMS Notifications</Label>
              <p className="text-sm text-slate-500">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) => 
                updateNotificationSettings({ ...notifications, sms: checked })
              }
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage your account security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300">Two-Factor Authentication</Label>
              <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={security.two_factor_enabled}
              onCheckedChange={(checked) => 
                updateSecuritySettings({ ...security, two_factor_enabled: checked })
              }
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300">Login Alerts</Label>
              <p className="text-sm text-slate-500">Get notified of new login attempts</p>
            </div>
            <Switch
              checked={security.login_alerts}
              onCheckedChange={(checked) => 
                updateSecuritySettings({ ...security, login_alerts: checked })
              }
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-900/20 border-red-700">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-300">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={deleteAccount}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
