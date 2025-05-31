
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Bell, Globe, AlertTriangle } from "lucide-react";

interface AccountSettingsProps {
  session: Session | null;
}

interface UserSettings {
  notification_preferences: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  language: string;
  timezone: string;
  two_fa_enabled: boolean;
  deposit_limit: number | null;
  loss_limit: number | null;
  self_exclusion_until: string | null;
}

const AccountSettings = ({ session }: AccountSettingsProps) => {
  const [settings, setSettings] = useState<UserSettings>({
    notification_preferences: {
      push: true,
      email: true,
      sms: false
    },
    language: 'en',
    timezone: 'UTC',
    two_fa_enabled: false,
    deposit_limit: null,
    loss_limit: null,
    self_exclusion_until: null
  });
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          notification_preferences: data.notification_preferences || {
            push: true,
            email: true,
            sms: false
          },
          language: data.language || 'en',
          timezone: data.timezone || 'UTC',
          two_fa_enabled: false, // This would come from profile
          deposit_limit: data.deposit_limit,
          loss_limit: data.loss_limit,
          self_exclusion_until: data.self_exclusion_until
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session?.user?.id,
          notification_preferences: settings.notification_preferences,
          language: settings.language,
          timezone: settings.timezone,
          deposit_limit: settings.deposit_limit,
          loss_limit: settings.loss_limit,
          self_exclusion_until: settings.self_exclusion_until,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Your account settings have been updated successfully.",
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

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error: any) {
      toast({
        title: "Error changing password",
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
            <div>
              <Label className="text-slate-300">Push Notifications</Label>
              <p className="text-slate-400 text-sm">Receive notifications in your browser</p>
            </div>
            <Switch
              checked={settings.notification_preferences.push}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  notification_preferences: {
                    ...settings.notification_preferences,
                    push: checked
                  }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">Email Notifications</Label>
              <p className="text-slate-400 text-sm">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.notification_preferences.email}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  notification_preferences: {
                    ...settings.notification_preferences,
                    email: checked
                  }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">SMS Notifications</Label>
              <p className="text-slate-400 text-sm">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={settings.notification_preferences.sms}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  notification_preferences: {
                    ...settings.notification_preferences,
                    sms: checked
                  }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Regional Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Language</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="en" className="text-white">English</SelectItem>
                  <SelectItem value="am" className="text-white">አማርኛ (Amharic)</SelectItem>
                  <SelectItem value="or" className="text-white">Oromiffa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="Africa/Addis_Ababa" className="text-white">Ethiopia Time (EAT)</SelectItem>
                  <SelectItem value="UTC" className="text-white">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Current Password</Label>
              <Input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">New Password</Label>
              <Input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Confirm Password</Label>
              <Input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <Button
            onClick={changePassword}
            disabled={loading || !passwordData.new_password}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Responsible Gaming
          </CardTitle>
          <CardDescription className="text-slate-400">
            Set limits to help manage your gaming activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Daily Deposit Limit (ETB)</Label>
              <Input
                type="number"
                value={settings.deposit_limit || ''}
                onChange={(e) => setSettings({...settings, deposit_limit: e.target.value ? Number(e.target.value) : null})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter daily limit"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Daily Loss Limit (ETB)</Label>
              <Input
                type="number"
                value={settings.loss_limit || ''}
                onChange={(e) => setSettings({...settings, loss_limit: e.target.value ? Number(e.target.value) : null})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter loss limit"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Self-Exclusion Until</Label>
            <Input
              type="date"
              value={settings.self_exclusion_until || ''}
              onChange={(e) => setSettings({...settings, self_exclusion_until: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-slate-400 text-sm">
              Temporarily exclude yourself from the platform until this date
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={updateSettings}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
