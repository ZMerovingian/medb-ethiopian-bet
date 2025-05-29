import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Check, X } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  payment_method: string;
  phone_number: string;
  reference_number: string;
  status: string;
  created_at: string;
  profiles?: {
    username: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface TransactionManagementProps {
  session: Session;
}

export const TransactionManagement = ({ session }: TransactionManagementProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles:user_id (
            username,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Transaction interface
      const transformedData: Transaction[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        type: item.type,
        amount: item.amount,
        payment_method: item.payment_method || '',
        phone_number: item.phone_number || '',
        reference_number: item.reference_number || '',
        status: item.status,
        created_at: item.created_at,
        profiles: Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0] : null
      }));
      
      setTransactions(transformedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', transactionId);

      if (error) throw error;

      setTransactions(transactions.map(transaction => 
        transaction.id === transactionId ? { ...transaction, status } : transaction
      ));

      toast({
        title: "Success",
        description: `Transaction ${status} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.phone_number?.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'deposit' ? 'bg-blue-500' : 'bg-purple-500';
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
          <CardTitle className="text-white">Transaction Management</CardTitle>
          <CardDescription className="text-slate-400">
            Monitor and manage user transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by username, reference, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">User</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Amount</TableHead>
                <TableHead className="text-slate-300">Method</TableHead>
                <TableHead className="text-slate-300">Reference</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <div className="text-white font-medium">
                        {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                      </div>
                      <div className="text-slate-400 text-sm">@{transaction.profiles?.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getTypeColor(transaction.type)} text-white`}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {transaction.amount.toFixed(2)} ETB
                  </TableCell>
                  <TableCell className="text-slate-300">{transaction.payment_method}</TableCell>
                  <TableCell className="text-slate-300 font-mono text-sm">
                    {transaction.reference_number}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {transaction.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateTransactionStatus(transaction.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateTransactionStatus(transaction.id, 'failed')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
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
