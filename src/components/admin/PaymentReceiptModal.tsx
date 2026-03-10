import { Building2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Payment {
  id: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  paymentMode: string | null;
  transactionId: string | null;
  paidAt: string | null;
  flat: {
    flatNumber: string;
    ownerName: string;
    user?: {
      name: string;
    } | null;
  };
  maintenanceMonth: {
    month: number;
    year: number;
  };
  receipt?: {
    receiptNumber: string;
  } | null;
}

interface ReceiptDialogProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ReceiptDialog = ({ payment, isOpen, onClose }: ReceiptDialogProps) => {
  if (!payment) return null;

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

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-print-content');
    if (!printContent) return;

    // Get all stylesheets from the current document
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          // Handle cross-origin stylesheets
          const link = styleSheet.href;
          return link ? `@import url('${link}');` : '';
        }
      })
      .join('\n');

    const printWindow = window.open('', '', 'height=800,width=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            ${styles}
            
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 1cm;
                padding: 0;

              }
              * {
                page-break-inside: avoid;
              }
              .space-y-6 > * {
                margin-bottom: 1rem !important;
              }
              .mb-6 {
                margin-bottom: 1rem !important;
              }
              .p-6 {
                padding: 1rem !important;
              }
              .md\\:p-6 {
                padding: 1rem !important;
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
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const receiptDate = payment.paidAt
    ? new Date(payment.paidAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const billPeriod = payment.maintenanceMonth
    ? `${monthNames[payment.maintenanceMonth.month - 1]} ${payment.maintenanceMonth.year}`
    : "";

  const tenantName = payment.flat.user?.name || payment.flat.ownerName || "-";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end gap-2 mb-4">
          <Button onClick={handlePrint} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>

        <div id="receipt-print-content" className="bg-white p-6 border-2 border-primary/20 rounded-sm print:border-grey print:shadow-none ">
          {/* Header with Logo */}
          <div className="bg-primary text-primary-foreground rounded-t-sm p-3 print:bg-slate-700">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-accent p-2 rounded-full">
                <Building2 className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold md:text-xl tracking-wide text-white">SocietyPay</h1>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="space-y-6">
            <div className="text-right">
              <span className="font-semibold text-foreground">{receiptDate}</span>
            </div>

            {/* Society Name */}
            <div className="text-center">
              <h2 className="text-2xl md:text-2xl font-bold text-foreground">Hill View Residency</h2>
              <p className="text-sm text-muted-foreground mt-1">Baner Road, Pune, Maharashtra 411045</p>
              <p className="text-sm text-foreground mt-1">PAN: NA, GSTIN: NA</p>
            </div>

            {/* Receipt Details */}
            <div className="rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center border-b border-border pb-3 mb-3">
                <span className="text-secondary-foreground text-sm">Receipt Number:</span>
                <span className="font-semibold text-sm text-foreground">{payment.receipt?.receiptNumber || "-"}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary-foreground">Owner Name:</span>
                  <p className="font-semibold text-foreground">{payment.flat.ownerName || "-"}</p>
                </div>
                <div className="text-right">
                  <span className="text-secondary-foreground">Tenant Name:</span>
                  <p className="font-semibold text-foreground">{tenantName}</p>
                </div>
                <div>
                  <span className="text-secondary-foreground">Flat Number:</span>
                  <p className="font-semibold text-foreground">{payment.flat.flatNumber || "-"}</p>
                </div>
                <div className="text-right">
                  <span className="text-secondary-foreground">Transaction ID:</span>
                  <p className="font-semibold text-foreground font-mono text-xs">{payment.transactionId || "-"}</p>
                </div>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="bg-muted/50 rounded-lg p-4 md:p-6 mb-6 print:bg-gray-200">
              <p className="text-foreground leading-relaxed">
                Received with thanks from <span className="font-semibold">{tenantName}</span> for Flat{" "}
                <span className="font-semibold">{payment.flat.flatNumber}</span> the sum of{" "}
                <span className="font-bold text-primary">₹{payment.amount.toLocaleString("en-IN")}</span> ({amountInWords(payment.amount)}) via{" "}
                <span className="font-semibold">{payment.paymentMode || "UPI"}</span> Transaction ID{" "}
                <span className="font-mono text-sm bg-primary/10 px-1 rounded">{payment.transactionId || "-"}</span> towards maintenance charges for{" "}
                <span className="font-semibold">{billPeriod}</span>.
              </p>
            </div>

            {/* Amount Highlight */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 text-foreground px-6 py-4 text-center border border-primary/30 rounded-lg print:bg-gray-200">
                <p className="text-base opacity-80">Amount Paid</p>
                <p className="text-2xl md:text-3xl font-bold">₹{payment.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Footer */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;