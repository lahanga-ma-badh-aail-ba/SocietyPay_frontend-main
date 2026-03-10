import { useState, useEffect } from "react";
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
import { CheckCircle, XCircle, Clock, Receipt, Send, Download } from "lucide-react";
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
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PaymentStatus = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
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
      setPayments(response.data);
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

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      
      // Export payments for current month
      const params = {
        month: currentMonth.toString(),
        year: currentYear.toString(),
      };

      // Get the token from wherever your app stores it
      // Option 1: If stored in localStorage
      const token = localStorage.getItem('token');
      
      // Option 2: If you're using AuthContext, you might need to get it from there
      // const { token } = useAuth(); // Add this at the component level if needed

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/export/payments/csv?${new URLSearchParams(params)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'text/csv',
            'Authorization': `Bearer ${token}`, // Add the token here
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
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No payment records found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Flat</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.flat.user?.name || payment.flat.ownerName}
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
                      {payment.paidAt ? (
                        new Date(payment.paidAt).toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.status !== "PAID" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleSendReminder(payment)}
                        >
                          <Send className="h-3 w-3" />
                          Remind
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
  );
};

export default PaymentStatus;