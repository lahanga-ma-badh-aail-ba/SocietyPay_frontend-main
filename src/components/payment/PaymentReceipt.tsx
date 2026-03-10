import { useEffect, useState } from "react";
import { Building2, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Flat {
  flatNumber: string;
  ownerName: string;
}

interface MaintenanceMonth {
  month: number;
  year: number;
}

interface User {
  name: string;
}

interface Receipt {
  receiptNumber: string;
}

interface PaymentData {
  id: string;
  amount: number;
  paidAt: string;
  transactionId: string;
  paymentMode: string;
  maintenanceMonth: MaintenanceMonth;
  flat: Flat;
  user?: User;
  receipt?: Receipt;
}
  interface PaymentReceiptProps {
    onBack?: () => void;
  }

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Receipt = ({ onBack }: PaymentReceiptProps) => {
  const [receiptData, setReceiptData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchReceiptData();
  }, []);

  const fetchReceiptData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/receipts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch payment");

      const data = await response.json();
      if (!data.length || !data[0].payment) throw new Error("No payments found");

      setReceiptData(data[0].payment);
    } catch (err) {
      console.error("Error fetching receipt:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const amountInWords = (num: number): string => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    };

    if (num < 1000) return convert(num) + " Rupees Only";
    if (num < 100000)
      return convert(Math.floor(num / 1000)) + " Thousand" +
        (num % 1000 ? " " + convert(num % 1000) : "") + " Rupees Only";

    return convert(Math.floor(num / 100000)) + " Lakh" +
      (num % 100000 ? " " + convert(Math.floor((num % 100000) / 1000)) + " Thousand" : "") +
      (num % 1000 ? " " + convert(num % 1000) : "") + " Rupees Only";
  };

  // const handleBack = () => window.history.back();
    const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };
  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (hasError || !receiptData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">Receipt not found</p>
          <Button variant="outline" onClick={handleBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const receiptDate = receiptData.paidAt
    ? new Date(receiptData.paidAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const billPeriod = receiptData.maintenanceMonth
    ? `${monthNames[receiptData.maintenanceMonth.month - 1]} ${receiptData.maintenanceMonth.year}`
    : "";

    const tenantName = receiptData.user?.name || receiptData.flat?.ownerName || "-";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            margin: 0;
          }
          body {
            margin: 1cm;
          }
          .print\\:bg-slate-700 {
            background-color: rgb(51, 65, 85) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:bg-green-500 {
            background-color: rgb(34, 197, 94) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
            .print\\:bg-gray-200 {
            background-color: rgb(243, 244, 246) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Action Buttons - Hidden on print */}
      <div className="max-w-2xl mx-auto mb-4 flex gap-2 print:hidden">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handlePrint} className="ml-auto">
          <Download className="w-4 h-4 mr-2" />
          Download / Print
        </Button>
      </div>

      {/* Receipt Card */}
      <Card className="max-w-2xl mx-auto bg-card border-2 border-primary/20 print:border-grey print:shadow-none overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-primary text-primary-foreground p-3 print:bg-slate-700">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-accent p-2 rounded-full">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl md:text-xl font-bold text-white tracking-wide">SocietyPay</h1>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 md:p-6 ">
          <div className="text-right">
            <span className="font-semibold text-foreground">{receiptDate}</span>
          </div>
          {/* <span className="text-secondary-foreground">Receipt Date:</span> */}
          {/* Society Name */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-2xl font-bold text-foreground">Hill View Residency</h2>
            <p className="text-sm text-muted-foreground mt-1">Baner Road, Pune, Maharashtra 411045</p>
            <p className="text-sm text-foreground mt-1">PAN: NA, GSTIN: NA</p>
          </div>

          {/* Receipt Details Grid */}
          <div className=" rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center border-b border-border pb-3 mb-3">
              <span className="text-secondary-foreground text-sm">Receipt Number:</span>
              <span className="font-semibold text-foreground text-sm">{receiptData.receipt?.receiptNumber || "-"}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary-foreground">Owner Name:</span>
                <p className="font-semibold text-foreground">{receiptData.flat?.ownerName || "-"}</p>
              </div>
              <div className="text-right">
                <span className="text-secondary-foreground">Tenant Name:</span>
                <p className="font-semibold text-foreground">{tenantName}</p>
              </div>
              <div>
                <span className="text-secondary-foreground">Flat Number:</span>
                <p className="font-semibold text-foreground">{receiptData.flat?.flatNumber || "-"}</p>
              </div>
              <div className="text-right">
                <span className="text-secondary-foreground">Transaction ID:</span>
                <p className="font-semibold text-foreground font-mono text-sm">{receiptData.transactionId || "-"}</p>
              </div>
              {/* <div className="text-right">
              </div> */}
            </div>
          </div>

          {/* Receipt Body Text */}
          <div className="bg-muted/50 rounded-lg p-4 md:p-6 mb-6 print:bg-gray-200">
            <p className="text-foreground leading-relaxed">
              Received with thanks from <span className="font-semibold">{tenantName || "-"}</span> for Flat{" "}
              <span className="font-semibold">{receiptData.flat?.flatNumber || "-"}</span> the sum of{" "}
              <span className="font-bold text-primary">₹{receiptData.amount.toLocaleString("en-IN")}</span> ({amountInWords(receiptData.amount)}) via{" "}
              <span className="font-semibold">{receiptData.paymentMode || "-"}</span> Transaction ID{" "}
              <span className="font-mono text-sm bg-primary/10 px-1 rounded">{receiptData.transactionId || "-"}</span> towards maintenance charges for{" "}
              <span className="font-semibold">{billPeriod}</span>.
            </p>
          </div>

          {/* Amount Highlight */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 text-foreground px-6 py-4 text-center border border-primary/30 rounded-lg print:bg-gray-200">
              <p className="text-base opacity-80">Amount Paid</p>
              <p className="text-2xl md:text-3xl font-bold">₹{receiptData.amount.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="border-t-2 border-primary/20 pt-4 print:border-grey">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-muted-foreground italic">
                  Note: Subject to realisation (in case of payment by cheque)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground mb-8">
                  For Hill View Residency
                </p>
                <div className="border-t border-dashed border-muted-foreground/50 pt-2">
                  <p className="text-sm text-secondary-foreground">Authorised Signatory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Electronic Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground italic">
              This is an electronically generated document, hence does not require signature
            </p>
            <p className="text-xs text-primary font-semibold mt-2">
              Powered by SocietyPay
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Receipt;