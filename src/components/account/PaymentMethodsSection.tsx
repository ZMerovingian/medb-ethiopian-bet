
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Plus, Trash2, Smartphone, Building } from "lucide-react";

interface PaymentMethodsSectionProps {
  session: Session | null;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile' | 'bank';
  name: string;
  details: string;
  is_default: boolean;
}

const PaymentMethodsSection = ({ session }: PaymentMethodsSectionProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newMethod, setNewMethod] = useState({
    type: 'card' as 'card' | 'mobile' | 'bank',
    name: '',
    details: ''
  });

  useEffect(() => {
    if (session?.user) {
      fetchPaymentMethods();
    }
  }, [session]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('payment_methods')
        .eq('user_id', session?.user?.id)
        .single();

      if (error) throw error;

      if (data?.payment_methods && Array.isArray(data.payment_methods)) {
        setPaymentMethods(data.payment_methods as PaymentMethod[]);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const addPaymentMethod = async () => {
    if (!newMethod.name || !newMethod.details) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newPaymentMethod: PaymentMethod = {
        id: crypto.randomUUID(),
        type: newMethod.type,
        name: newMethod.name,
        details: newMethod.details,
        is_default: paymentMethods.length === 0
      };

      const updatedMethods = [...paymentMethods, newPaymentMethod];

      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedMethods })
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setPaymentMethods(updatedMethods);
      setNewMethod({ type: 'card', name: '', details: '' });
      setShowAddForm(false);

      toast({
        title: "Payment method added",
        description: "Your payment method has been successfully added.",
      });
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

  const removePaymentMethod = async (methodId: string) => {
    setLoading(true);
    try {
      const updatedMethods = paymentMethods.filter(method => method.id !== methodId);

      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedMethods })
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setPaymentMethods(updatedMethods);

      toast({
        title: "Payment method removed",
        description: "The payment method has been removed from your account.",
      });
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

  const setDefaultPaymentMethod = async (methodId: string) => {
    setLoading(true);
    try {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        is_default: method.id === methodId
      }));

      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedMethods })
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setPaymentMethods(updatedMethods);

      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been changed.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating default method",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'bank':
        return <Building className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getMethodTypeName = (type: string) => {
    switch (type) {
      case 'card':
        return 'Credit/Debit Card';
      case 'mobile':
        return 'Mobile Money';
      case 'bank':
        return 'Bank Transfer';
      default:
        return 'Payment Method';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Payment Methods</h3>
          <p className="text-sm text-slate-400">Manage your payment methods for deposits and withdrawals</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Method
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Payment Method</CardTitle>
            <CardDescription className="text-slate-400">
              Add a new payment method for transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Payment Type</Label>
              <Select value={newMethod.type} onValueChange={(value: 'card' | 'mobile' | 'bank') => 
                setNewMethod({ ...newMethod, type: value })
              }>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="mobile">Mobile Money (M-Pesa, etc.)</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Method Name</Label>
              <Input
                value={newMethod.name}
                onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                placeholder="e.g., My Visa Card, M-Pesa Number"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">
                {newMethod.type === 'card' ? 'Card Number' : 
                 newMethod.type === 'mobile' ? 'Phone Number' : 'Account Details'}
              </Label>
              <Input
                value={newMethod.details}
                onChange={(e) => setNewMethod({ ...newMethod, details: e.target.value })}
                placeholder={
                  newMethod.type === 'card' ? '**** **** **** 1234' :
                  newMethod.type === 'mobile' ? '+251 9XX XXX XXX' : 'Account Number'
                }
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addPaymentMethod}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
              >
                {loading ? 'Adding...' : 'Add Method'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-8 text-center">
              <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No payment methods added yet</p>
              <p className="text-sm text-slate-500 mt-2">Add a payment method to start making transactions</p>
            </CardContent>
          </Card>
        ) : (
          paymentMethods.map((method) => (
            <Card key={method.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-yellow-500">
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{method.name}</h4>
                      <p className="text-sm text-slate-400">{getMethodTypeName(method.type)}</p>
                      <p className="text-sm text-slate-500">{method.details}</p>
                      {method.is_default && (
                        <span className="text-xs bg-yellow-500 text-slate-900 px-2 py-1 rounded mt-1 inline-block">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        disabled={loading}
                        className="border-slate-600 text-slate-300"
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePaymentMethod(method.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsSection;
