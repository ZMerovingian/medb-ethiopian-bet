
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface AccountSettingsProps {
  session: Session;
}

interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  two_factor_enabled?: boolean;
}

export const AccountSettings = ({ session }: AccountSettingsProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [session]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load account settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotificationSettings = async (field: string, value: boolean) => {
    if (!profile) return;

    setIsUpdating(true);
    try {
      const updates = { [field]: value };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      toast({
        title: "Success",
        description: "Notification settings updated",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateSecuritySettings = async (field: string, value: boolean) => {
    if (!profile) return;

    setIsUpdating(true);
    try {
      const updates = { [field]: value };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      toast({
        title: "Success",
        description: "Security settings updated",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(session.user.id);
      if (error) throw error;

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-50">Notification Settings</CardTitle>
          <CardDescription className="text-slate-400">
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="text-slate-300">
              Email Notifications
            </Label>
            <Switch
              id="email-notifications"
              checked={profile?.email_notifications || false}
              onCheckedChange={(checked) => updateNotificationSettings('email_notifications', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications" className="text-slate-300">
              SMS Notifications
            </Label>
            <Switch
              id="sms-notifications"
              checked={profile?.sms_notifications || false}
              onCheckedChange={(checked) => updateNotificationSettings('sms_notifications', checked)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-50">Security Settings</CardTitle>
          <CardDescription className="text-slate-400">
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="two-factor" className="text-slate-300">
              Two-Factor Authentication
            </Label>
            <Switch
              id="two-factor"
              checked={profile?.two_factor_enabled || false}
              onCheckedChange={(checked) => updateSecuritySettings('two_factor_enabled', checked)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-slate-900 border-red-800 border-2">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-slate-400">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-slate-50">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount} className="bg-red-600 hover:bg-red-700">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
