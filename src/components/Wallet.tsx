
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, History, CreditCard } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  code: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  payment_method: string;
  phone_number: string;
  reference_number: string;
  status: string;
  created_at: string;
}

interface WalletProps {
  session: Session | null;
}

const Wallet = ({ session }: WalletProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchBalance();
      fetchPaymentMethods();
      fetchTransactions();
    }
  }, [session]);

  const fetchBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', session?.user?.id)
        .single();

      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

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

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !selectedMethod || !phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: session?.user?.id,
          type: 'deposit',
          amount: parseFloat(amount),
          payment_method: selectedMethod,
          phone_number: phoneNumber,
          reference_number: `DEP-${Date.now()}`,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Deposit initiated",
        description: "Your deposit request has been submitted for processing.",
      });

      setAmount("");
      setPhoneNumber("");
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: "Deposit failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!amount || !selectedMethod || !phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: session?.user?.id,
          type: 'withdrawal',
          amount: parseFloat(amount),
          payment_method: selectedMethod,
          phone_number: phoneNumber,
          reference_number: `WTH-${Date.now()}`,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Withdrawal initiated",
        description: "Your withdrawal request has been submitted for processing.",
      });

      setAmount("");
      setPhoneNumber("");
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: "Withdrawal failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Please sign in to access your wallet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="w-6 h-6" />
            Your Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{balance.toFixed(2)} ETB</div>
        </CardContent>
      </Card>

      {/* Deposit/Withdrawal Tabs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Manage Your Funds</CardTitle>
          <CardDescription className="text-slate-400">
            Deposit or withdraw funds using Ethiopian payment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="deposit" className="text-slate-300">
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Deposit
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="text-slate-300">
                <ArrowDownCircle className="w-4 h-4 mr-2" />
                Withdraw
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Amount (ETB)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Payment Method</Label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.code} className="text-white">
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="+251 9XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? "Processing..." : "Deposit Funds"}
              </Button>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Amount (ETB)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-sm text-slate-400">Available: {balance.toFixed(2)} ETB</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Payment Method</Label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.code} className="text-white">
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="+251 9XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={handleWithdrawal}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? "Processing..." : "Withdraw Funds"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No transactions yet</p>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {transaction.type === 'deposit' ? 
                        <ArrowUpCircle className="w-4 h-4 text-white" /> : 
                        <ArrowDownCircle className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div>
                      <div className="text-white font-medium capitalize">{transaction.type}</div>
                      <div className="text-slate-400 text-sm">{transaction.payment_method}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toFixed(2)} ETB
                    </div>
                    <Badge className={`${getStatusColor(transaction.status)} text-white text-xs`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
