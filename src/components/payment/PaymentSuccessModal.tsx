import { CheckCircle2, IndianRupee, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewReceipt: () => void; // Callback to show receipt
  amount: number;
  transactionRef: string;
  date: string;
  receiptNo?: string;
  billNo?: string;
}

const PaymentSuccessModal = ({ 
  isOpen, 
  onClose,
  onViewReceipt,
  amount,
  transactionRef,
  date,
  // receiptNo,
  // billNo
}: PaymentSuccessModalProps) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Payment Receipt - SocietyPay',
      text: `Payment of ₹${amount.toLocaleString('en-IN')} successful!\nTransaction ID: ${transactionRef}\nDate: ${date}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `Payment Receipt\nAmount: ₹${amount.toLocaleString('en-IN')}\nTransaction ID: ${transactionRef}\nDate: ${date}`
        );
        alert('Receipt details copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Success Header */}
            <div className="gradient-success px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1, duration: 0.5 }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent-foreground/20 mb-4"
              >
                <CheckCircle2 className="h-12 w-12 text-accent-foreground" />
              </motion.div>
              <h2 className="text-2xl font-bold text-accent-foreground mb-1">Payment Successful!</h2>
              <p className="text-sm text-accent-foreground/80">Your dues have been cleared</p>
            </div>

            {/* Payment Details */}
            <div className="p-6">
              {/* Amount */}
              <div className="text-center mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="h-6 w-6 text-accent" />
                  <span className="text-3xl font-bold text-accent">
                    {amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="text-sm font-medium text-card-foreground font-mono">{transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm font-medium text-card-foreground">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="text-sm font-medium text-card-foreground">UPI</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={onViewReceipt}
                >
                  <Download className="h-4 w-4" />
                  Receipt
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
              
              <Button
                variant="action"
                size="lg"
                className="w-full"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccessModal;