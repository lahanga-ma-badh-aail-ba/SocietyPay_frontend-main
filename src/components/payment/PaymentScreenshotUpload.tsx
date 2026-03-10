import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';

interface PaymentUploadProps {
  month: number;
  year: number;
  amount: number;
  onSuccess?: () => void;
}

const PaymentUpload = ({ month, year, amount, onSuccess }: PaymentUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const { toast } = useToast();
  const { token } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ 
        title: 'Invalid File', 
        description: 'Please select an image file', 
        variant: 'destructive' 
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: 'File Too Large', 
        description: 'Max 5MB', 
        variant: 'destructive' 
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<{ publicUrl: string }>('/upload-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.publicUrl;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedFile) {
      toast({ 
        title: 'Missing Screenshot', 
        description: 'Please upload a screenshot', 
        variant: 'destructive' 
      });
      return;
    }

    if (!upiTransactionId.trim()) {
      toast({ 
        title: 'Missing Transaction ID', 
        description: 'Enter UPI transaction ID', 
        variant: 'destructive' 
      });
      return;
    }

    try {
      setIsUploading(true);

      // 1️⃣ Upload screenshot to backend/storage
      const imageUrl = await uploadToBackend(selectedFile);

      // 2️⃣ Call /initiate to create/update PENDING payment with transactionId
      const initiateRes = await api.post('/payments/initiate', {
        month,
        year,
        img: imageUrl,
        paymentMode: 'UPI',
      });

      const paymentId = initiateRes.data.payment.id;

      // 3️⃣ Call /confirm to add upiTransactionId
      await api.post('/payments/confirm', {
        paymentId,
        upiTransactionId,
        img: imageUrl, // Include img again in case it wasn't set in initiate
      });

      toast({ 
        title: 'Success', 
        description: 'Payment screenshot uploaded successfully!' 
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setUpiTransactionId('');

      if (onSuccess) onSuccess();

    } catch (error) {
      let message = 'Failed to submit payment';
      if (error instanceof Error) message = error.message;
      toast({ 
        title: 'Error', 
        description: message, 
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Amount to Pay</p>
          <p className="text-2xl font-bold">₹{(amount || 0).toLocaleString()}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionId">UPI Transaction ID</Label>
          <Input
            id="transactionId"
            placeholder="Enter UPI transaction ID"
            value={upiTransactionId}
            onChange={(e) => setUpiTransactionId(e.target.value)}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenshot">Payment Screenshot</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {previewUrl ? (
              <div className="space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-lg border" 
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  disabled={isUploading}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <label htmlFor="screenshot">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild 
                    disabled={isUploading}
                  >
                    <span className="cursor-pointer">Choose File</span>
                  </Button>
                </label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                <p className="text-sm text-muted-foreground">
                  Upload payment screenshot (Max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmitPayment}
          disabled={isUploading || !selectedFile || !upiTransactionId.trim()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> 
              Submit Payment
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentUpload;