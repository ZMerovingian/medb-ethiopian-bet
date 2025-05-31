
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
import { Upload, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface VerificationSectionProps {
  session: Session | null;
}

interface Profile {
  kyc_status: string;
  kyc_documents: any;
}

const VerificationSection = ({ session }: VerificationSectionProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('kyc_status, kyc_documents')
        .eq('user_id', session?.user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const uploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a document to upload.');
      }

      if (!documentType) {
        throw new Error('Please select a document type.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${session?.user?.id}_${documentType}_${Date.now()}.${fileExt}`;
      const filePath = `kyc-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const currentDocs = profile?.kyc_documents || {};
      const updatedDocs = {
        ...currentDocs,
        [documentType]: {
          url: data.publicUrl,
          uploaded_at: new Date().toISOString(),
          status: 'pending'
        }
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          kyc_documents: updatedDocs,
          kyc_status: 'pending'
        })
        .eq('user_id', session?.user?.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded for verification.",
      });

      fetchProfile();
      setDocumentType('');
    } catch (error: any) {
      toast({
        title: "Error uploading document",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {getStatusIcon(profile?.kyc_status || 'not_verified')}
            Verification Status
          </CardTitle>
          <CardDescription className="text-slate-400">
            Complete your identity verification to increase your account limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Current Status</p>
              <p className="text-slate-400 text-sm">
                {profile?.kyc_status === 'verified' && 'Your identity has been verified'}
                {profile?.kyc_status === 'pending' && 'Your documents are under review'}
                {profile?.kyc_status === 'rejected' && 'Please resubmit your documents'}
                {!profile?.kyc_status && 'Please upload your documents for verification'}
              </p>
            </div>
            <Badge className={`${getStatusColor(profile?.kyc_status || 'not_verified')} text-white`}>
              {profile?.kyc_status || 'Not Verified'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Upload Documents</CardTitle>
          <CardDescription className="text-slate-400">
            Upload your identity documents for verification. Accepted formats: JPG, PNG, PDF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="national_id" className="text-white">National ID</SelectItem>
                  <SelectItem value="passport" className="text-white">Passport</SelectItem>
                  <SelectItem value="drivers_license" className="text-white">Driver's License</SelectItem>
                  <SelectItem value="utility_bill" className="text-white">Utility Bill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document" className="text-slate-300">Upload File</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="document" className="cursor-pointer flex-1">
                  <div className="flex items-center justify-center gap-2 bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-400">
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </span>
                  </div>
                </Label>
                <Input
                  id="document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={uploadDocument}
                  disabled={uploading || !documentType}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {profile?.kyc_documents && (
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Uploaded Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(profile.kyc_documents).map(([type, doc]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium capitalize">{type.replace('_', ' ')}</p>
                      <p className="text-slate-400 text-sm">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(doc.status)} text-white`}>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Verification Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Unverified Account</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Deposit limit: 1,000 ETB</li>
                <li>• Withdrawal limit: 500 ETB</li>
                <li>• Basic features only</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-medium">Verified Account</h4>
              <ul className="text-green-400 text-sm space-y-1">
                <li>• Deposit limit: 50,000 ETB</li>
                <li>• Withdrawal limit: 25,000 ETB</li>
                <li>• Access to VIP features</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationSection;
