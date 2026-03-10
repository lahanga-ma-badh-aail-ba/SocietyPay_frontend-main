// import { useState, useEffect } from "react";
import { X, CheckCircle2, Clock, XCircle, IndianRupee, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Payment {
  id: string;
  amount: number;
  status: "PAID" | "PENDING" | "FAILED";
  paidAt?: string;
  createdAt: string;
  transactionId?: string | null;
}

interface PaymentHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: Payment[];
  loading?: boolean;
}

const PaymentHistoryModal = ({ 
  open, 
  onOpenChange, 
  payments,
  loading = false 
}: PaymentHistoryModalProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      PAID: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-100" },
      PENDING: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      FAILED: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100" },
    };

    const config = variants[status] || variants.PENDING;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime()
  );

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFailed = payments
    .filter((p) => p.status === "FAILED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <IndianRupee className="h-6 w-6 text-primary" />
            Payment History
          </DialogTitle>
          <DialogDescription>
            View all your payment transactions and their statuses
          </DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 py-4">
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-xs text-green-700 font-medium">Paid</p>
            <p className="text-lg font-bold text-green-800 flex items-center gap-1">
              <IndianRupee className="h-4 w-4" />
              {totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <p className="text-xs text-yellow-700 font-medium">Pending</p>
            <p className="text-lg font-bold text-yellow-800 flex items-center gap-1">
              <IndianRupee className="h-4 w-4" />
              {totalPending.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <p className="text-xs text-red-700 font-medium">Failed</p>
            <p className="text-lg font-bold text-red-800 flex items-center gap-1">
              <IndianRupee className="h-4 w-4" />
              {totalFailed.toLocaleString()}
            </p>
          </div>
        </div>

        <Separator />

        {/* Payment List */}
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading payments...</p>
            </div>
          ) : sortedPayments.length > 0 ? (
            <div className="space-y-3">
              {sortedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border rounded-lg p-4 hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(payment.status)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatDate(payment.paidAt || payment.createdAt)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatTime(payment.paidAt || payment.createdAt)}
                            </span>
                          </div>
                          {getStatusBadge(payment.status)}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          <span>
                            Ref: {payment.transactionId || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="flex items-center gap-1 text-lg font-bold text-primary">
                        <IndianRupee className="h-5 w-5" />
                        <span>{payment.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IndianRupee className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground font-medium">No payment history</p>
              <p className="text-sm text-muted-foreground">
                Your transactions will appear here
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentHistoryModal;