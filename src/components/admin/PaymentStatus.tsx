import { useState, useEffect } from "react";
import ReceiptDialog from "@/components/admin/PaymentReceiptModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, Receipt, Send, Download, Image, Check, ReceiptIndianRupee } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  paymentMode: string | null;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  img: string | null;
  flat: {
    id: string;
    flatNumber: string;
    ownerName: string;
    ownerEmail: string;
    user?: {
      name: string;
      email: string;
      role?: string;
    } | null;
  };
  maintenanceMonth: {
    id: string;
    month: number;
    year: number;
  };
  receipt?: {
    id: string;
    receiptNumber: string;
  } | null;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PaymentStatus = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);
  const [confirmingPaymentId, setConfirmingPaymentId] = useState<string | null>(null);
  const { toast } = useToast();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchAllPayments();
  }, []);

    const fetchAllPayments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/payments/all');
      
      // Sort payments: FAILED first, then PENDING, then PAID
      // const sortedPayments = response.data.sort((a: Payment, b: Payment) => {
      //   const statusOrder = { PAID: 0, PENDING: 1, FAILED: 2 };
      //   return statusOrder[a.status] - statusOrder[b.status];
      // });
          
      // Sort payments by flat number
      const sortedPayments = response.data.sort((a: Payment, b: Payment) => {
        const flatA = parseInt(a.flat.flatNumber.replace(/\D/g, '')) || 0;
        const flatB = parseInt(b.flat.flatNumber.replace(/\D/g, '')) || 0;
        return flatA - flatB;
      });
      
      setPayments(sortedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      setConfirmingPaymentId(paymentId);
      
      // Call the ADMIN confirm payment endpoint
      await api.post('/payments/admin-confirm', {
        paymentId: paymentId,
      });

      toast({
        title: "Success",
        description: "Payment confirmed successfully",
      });

      // Close dialog and refresh
      setSelectedPayment(null);
      await fetchAllPayments();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment",
        variant: "destructive",
      });
    } finally {
      setConfirmingPaymentId(null);
    }
  };

  const handleDownloadImage = async (imageUrl: string, flatNumber: string, month: number, year: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-${flatNumber}-${monthNames[month - 1]}-${year}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Image downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      
      const params = {
        month: currentMonth.toString(),
        year: currentYear.toString(),
      };

      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/export/payments/csv?${new URLSearchParams(params)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'text/csv',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${currentMonth}-${currentYear}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "CSV exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export CSV",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendReminder = async (payment: Payment) => {
    try {
      await api.post(`/payments/${payment.id}/remind`);
      toast({
        title: "Reminder Sent",
        description: `Reminder sent to ${payment.flat.user?.name || payment.flat.ownerName}`,
      });
    } catch (error) {
      toast({
        title: "Info",
        description: "Message sending is currently under development",
        variant:"default"
      });
    }
  };

  const paidCount = payments.filter((p) => p.status === "PAID").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const failedCount = payments.filter((p) => p.status === "FAILED").length;

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className=" items-center justify-between">
            <div className="flex sm:flex-row flex-col  justify-between w-full">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Payment Status - {monthNames[currentMonth - 1]} {currentYear}
                </CardTitle>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-muted-foreground">Paid: {paidCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-muted-foreground">Pending: {pendingCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <span className="text-sm text-muted-foreground">Failed: {failedCount}</span>
                  </div>
                </div>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleExportCSV}
                  disabled={isExporting || payments.length === 0}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payment records found
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant Name</TableHead>
                    <TableHead>Owner Name</TableHead>
                    <TableHead>Flat No</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Screenshot</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.flat.user?.name || (
                          <span className="text-muted-foreground">No tenant</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.flat.ownerName || (
                          <span className="text-muted-foreground">No owner</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono">
                        {payment.flat.flatNumber}
                      </TableCell>
                      <TableCell>
                        {monthNames[payment.maintenanceMonth.month - 1]} {payment.maintenanceMonth.year}
                      </TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.img ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Image className="h-3 w-3" />
                            View
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">No image</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.paidAt ? (
                          new Date(payment.paidAt).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.receipt ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Generated
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Generated
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.status !== "PAID" ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleSendReminder(payment)}
                          >
                            <Send className="h-3 w-3" />
                            Remind
                          </Button>
                        ):(
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => setSelectedReceiptPayment(payment)}
                          >
                            <ReceiptIndianRupee className="h-3 w-3" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      <ReceiptDialog
        payment={selectedReceiptPayment}
        isOpen={!!selectedReceiptPayment}
        onClose={() => setSelectedReceiptPayment(null)}
      />

      {/* Image Preview Dialog with Confirm and Download Buttons */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col items-center gap-4">
            {selectedPayment && selectedPayment.img && (
              <>
                <img
                  src={selectedPayment.img}
                  alt="Payment screenshot"
                  className="w-96 h-auto rounded-lg border"
                />
                
                <div className="flex flex-col gap-2 w-full max-w-md">
                  {/* Show Confirm Button only if payment is not PAID */}
                  {selectedPayment.status !== "PAID" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2 w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleConfirmPayment(selectedPayment.id)}
                      disabled={confirmingPaymentId === selectedPayment.id}
                    >
                      <Check className="h-4 w-4" />
                      {confirmingPaymentId === selectedPayment.id ? 'Confirming...' : 'Confirm Payment'}
                    </Button>
                  )}
                  
                  {/* Download Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full"
                    onClick={() => handleDownloadImage(
                      selectedPayment.img!,
                      selectedPayment.flat.flatNumber,
                      selectedPayment.maintenanceMonth.month,
                      selectedPayment.maintenanceMonth.year
                    )}
                  >
                    <Download className="h-4 w-4" />
                    Download Image
                  </Button>
                </div>

                {/* Payment Details */}
                <div className="w-full max-w-md p-4 bg-muted rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenant:</span>
                    <span className="font-medium">{selectedPayment.flat.user?.name || selectedPayment.flat.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flat:</span>
                    <span className="font-medium font-mono">{selectedPayment.flat.flatNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">₹{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{getStatusBadge(selectedPayment.status)}</span>
                  </div>
                  {selectedPayment.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-medium text-xs">{selectedPayment.transactionId}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentStatus;