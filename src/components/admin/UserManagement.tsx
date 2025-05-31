
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit, Ban, CheckCircle } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface User {
  id: string;
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  balance: number;
  country: string;
  kyc_status: string;
  is_active: boolean;
  created_at: string;
  total_wagered: number;
}

interface UserManagementProps {
  session: Session;
}

export const UserManagement = ({ session }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, is_active: isActive } : user
      ));

      toast({
        title: "Success",
        description: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateKYCStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ kyc_status: status })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, kyc_status: status } : user
      ));

      toast({
        title: "Success",
        description: "KYC status updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">User Management</CardTitle>
          <CardDescription className="text-slate-400">
            Manage registered users and their accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">User</TableHead>
                <TableHead className="text-slate-300">Balance</TableHead>
                <TableHead className="text-slate-300">Wagered</TableHead>
                <TableHead className="text-slate-300">KYC Status</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <div className="text-white font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-slate-400 text-sm">@{user.username}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {user.balance?.toFixed(2) || '0.00'} ETB
                  </TableCell>
                  <TableCell className="text-white">
                    {user.total_wagered?.toFixed(2) || '0.00'} ETB
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getKYCStatusColor(user.kyc_status)} text-white`}>
                      {user.kyc_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.is_active ? 'bg-green-500' : 'bg-red-500'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Manage User</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div>
                                <Label className="text-slate-300">KYC Status</Label>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    onClick={() => updateKYCStatus(selectedUser.user_id, 'verified')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => updateKYCStatus(selectedUser.user_id, 'rejected')}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label className="text-slate-300">Account Status</Label>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    onClick={() => updateUserStatus(selectedUser.user_id, true)}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={selectedUser.is_active}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Activate
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => updateUserStatus(selectedUser.user_id, false)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={!selectedUser.is_active}
                                  >
                                    <Ban className="w-4 h-4 mr-1" />
                                    Deactivate
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
