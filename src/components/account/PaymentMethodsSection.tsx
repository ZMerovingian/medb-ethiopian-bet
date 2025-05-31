
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CreditCard, Smartphone } from "lucide-react";

interface PaymentMethodsSectionProps {
  session: Session | null;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  code: string;
  is_active: boolean;
}

interface UserPaymentMethod {
  id: string;
  payment_method_code: string;
  account_number: string;
  account_name: string;
  is_default: boolean;
  created_at: string;
}

const PaymentMethodsSection = ({ session }: PaymentMethodsSectionProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userMethods, setUserMethods] = useState<UserPaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    payment_method_code: '',
    account_number: '',
    account_name: ''
  });

  useEffect(() => {
    fetchPaymentMethods();
    fetchUserPaymentMethods();
  }, [session]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchUserPaymentMethods = async () => {
    try {
      // For now, we'll store user payment methods in a simple way
      // In a real implementation, you'd want a separate table for user_payment_methods
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single();

      if (error) throw error;
      
      // This is a simplified approach - in production you'd have a proper table
      const savedMethods = data?.kyc_documents?.payment_methods || [];
      setUserMethods(savedMethods);
    } catch (error) {
      console.error('Error fetching user payment methods:', error);
    }
  };

  const addPaymentMethod = async () => {
    if (!formData.payment_method_code || !formData.account_number || !formData.account_name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newMethod = {
        id: crypto.randomUUID(),
        ...formData,
        is_default: userMethods.length === 0,
        created_at: new Date().toISOString()
      };

      const updatedMethods = [...userMethods, newMethod];

      // Update the profile with the new payment method
      const { error } = await supabase
        .from('profiles')
        .update({ 
          kyc_documents: { 
            ...(await getExistingDocs()), 
            payment_methods: updatedMethods 
          }
        })
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      toast({
        title: "Payment method added",
        description: "Your payment method has been added successfully.",
      });

      setUserMethods(updatedMethods);
      setFormData({ payment_method_code: '', account_number: '', account_name: '' });
      setShowAddForm(false);
    } catch (error: any) {
      toast({
        title: "Error adding payment method",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getExistingDocs = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('kyc_documents')
        .eq('user_id', session?.user?.id)
        .single();
      
      return data?.kyc_documents || {};
    } catch {
      return {};
    }
  };

  const removePaymentMethod = async (methodId: string) => {
    setLoading(true);
    try {
      const updatedMethods = userMethods.filter(method => method.id !== methodId);

      const { error } = await supabase
        .from('profiles')
        .update({ 
          kyc_documents: { 
            ...(await getExistingDocs()), 
            payment_methods: updatedMethods 
          }
        })
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      toast({
        title: "Payment method removed",
        description: "Your payment method has been removed successfully.",
      });

      setUserMethods(updatedMethods);
    } catch (error: any) {
      toast({
        title: "Error removing payment method",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'mobile_money':
        return <Smartphone className="w-5 h-5" />;
      case 'bank':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Methods</CardTitle>
          <CardDescription className="text-slate-400">
            Manage your payment methods for deposits and withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-300">Your saved payment methods</p>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Method
            </Button>
          </div>

          {showAddForm && (
            <Card className="mb-4 bg-slate-700 border-slate-600">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Payment Method</Label>
                    <Select 
                      value={formData.payment_method_code} 
                      onValueChange={(value) => setFormData({ ...formData, payment_method_code: value })}
                    >
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-600 border-slate-500">
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.code} className="text-white">
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Account Number</Label>
                    <Input
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Enter account number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Account Name</Label>
                    <Input
                      value={formData.account_name}
                      onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Enter account name"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={addPaymentMethod}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? 'Adding...' : 'Add Method'}
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {userMethods.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No payment methods added yet</p>
            ) : (
              userMethods.map((method) => {
                const paymentMethod = paymentMethods.find(pm => pm.code === method.payment_method_code);
                return (
                  <div key={method.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getMethodIcon(paymentMethod?.type || 'bank')}
                      <div>
                        <div className="text-white font-medium">{paymentMethod?.name}</div>
                        <div className="text-slate-400 text-sm">
                          {method.account_number} - {method.account_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.is_default && (
                        <Badge className="bg-yellow-500 text-slate-900">Default</Badge>
                      )}
                      <Button
                        onClick={() => removePaymentMethod(method.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Available Payment Methods</CardTitle>
          <CardDescription className="text-slate-400">
            These payment methods are supported for deposits and withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                {getMethodIcon(method.type)}
                <div>
                  <div className="text-white font-medium">{method.name}</div>
                  <div className="text-slate-400 text-sm capitalize">{method.type.replace('_', ' ')}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodsSection;
