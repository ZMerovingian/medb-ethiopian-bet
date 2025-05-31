
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, Trash2 } from "lucide-react";

interface PaymentMethodsSectionProps {
  session: Session;
}

interface PaymentMethod {
  id: string;
  type: 'bank' | 'mobile' | 'crypto';
  name: string;
  details: any;
  is_primary: boolean;
}

interface UserProfile {
  id: string;
  user_id: string;
}

export const PaymentMethodsSection = ({ session }: PaymentMethodsSectionProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: '',
    name: '',
    accountNumber: '',
    bankName: '',
    mobileProvider: '',
    walletAddress: ''
  });
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
      
      // Load payment methods from profile data or set empty array
      setPaymentMethods([]);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async () => {
    if (!profile || !newMethod.type || !newMethod.name) return;

    try {
      const method: PaymentMethod = {
        id: Date.now().toString(),
        type: newMethod.type as 'bank' | 'mobile' | 'crypto',
        name: newMethod.name,
        details: {
          accountNumber: newMethod.accountNumber,
          bankName: newMethod.bankName,
          mobileProvider: newMethod.mobileProvider,
          walletAddress: newMethod.walletAddress
        },
        is_primary: paymentMethods.length === 0
      };

      const updatedMethods = [...paymentMethods, method];
      setPaymentMethods(updatedMethods);

      // Note: In a real implementation, you'd store this in a payment_methods table
      // For now, we're just managing it in local state
      
      toast({
        title: "Success",
        description: "Payment method added successfully",
      });

      setIsDialogOpen(false);
      setNewMethod({
        type: '',
        name: '',
        accountNumber: '',
        bankName: '',
        mobileProvider: '',
        walletAddress: ''
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method",
        variant: "destructive",
      });
    }
  };

  const removePaymentMethod = async (methodId: string) => {
    try {
      const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
      setPaymentMethods(updatedMethods);

      toast({
        title: "Success",
        description: "Payment method removed successfully",
      });
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: "Error",
        description: "Failed to remove payment method",
        variant: "destructive",
      });
    }
  };

  const setPrimaryMethod = async (methodId: string) => {
    try {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        is_primary: method.id === methodId
      }));
      setPaymentMethods(updatedMethods);

      toast({
        title: "Success",
        description: "Primary payment method updated",
      });
    } catch (error) {
      console.error('Error updating primary method:', error);
      toast({
        title: "Error",
        description: "Failed to update primary method",
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
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-50">Payment Methods</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your payment methods for deposits and withdrawals
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-slate-50">Add Payment Method</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Add a new payment method for transactions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="method-type" className="text-slate-300">Payment Type</Label>
                    <Select value={newMethod.type} onValueChange={(value) => setNewMethod({...newMethod, type: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="method-name" className="text-slate-300">Method Name</Label>
                    <Input
                      id="method-name"
                      value={newMethod.name}
                      onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                      placeholder="e.g., My Bank Account"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  {newMethod.type === 'bank' && (
                    <>
                      <div>
                        <Label htmlFor="bank-name" className="text-slate-300">Bank Name</Label>
                        <Input
                          id="bank-name"
                          value={newMethod.bankName}
                          onChange={(e) => setNewMethod({...newMethod, bankName: e.target.value})}
                          placeholder="e.g., Commercial Bank of Ethiopia"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-number" className="text-slate-300">Account Number</Label>
                        <Input
                          id="account-number"
                          value={newMethod.accountNumber}
                          onChange={(e) => setNewMethod({...newMethod, accountNumber: e.target.value})}
                          placeholder="Enter account number"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </>
                  )}
                  {newMethod.type === 'mobile' && (
                    <>
                      <div>
                        <Label htmlFor="mobile-provider" className="text-slate-300">Mobile Provider</Label>
                        <Select value={newMethod.mobileProvider} onValueChange={(value) => setNewMethod({...newMethod, mobileProvider: value})}>
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="telebirr">TeleBirr</SelectItem>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="cbepay">CBE Pay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="mobile-number" className="text-slate-300">Mobile Number</Label>
                        <Input
                          id="mobile-number"
                          value={newMethod.accountNumber}
                          onChange={(e) => setNewMethod({...newMethod, accountNumber: e.target.value})}
                          placeholder="e.g., +251912345678"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </>
                  )}
                  {newMethod.type === 'crypto' && (
                    <div>
                      <Label htmlFor="wallet-address" className="text-slate-300">Wallet Address</Label>
                      <Input
                        id="wallet-address"
                        value={newMethod.walletAddress}
                        onChange={(e) => setNewMethod({...newMethod, walletAddress: e.target.value})}
                        placeholder="Enter wallet address"
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={addPaymentMethod} className="bg-yellow-600 hover:bg-yellow-700">
                    Add Method
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No payment methods added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="w-8 h-8 text-yellow-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-50">{method.name}</span>
                        {method.is_primary && (
                          <Badge variant="secondary" className="bg-yellow-600 text-white">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 capitalize">{method.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.is_primary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPrimaryMethod(method.id)}
                        className="border-slate-700 text-slate-300"
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePaymentMethod(method.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
