// import {
//   X,
//   QrCode,
//   IndianRupee,
//   ArrowLeft,
//   Copy,
//   Check
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState } from "react";
// import QRCode from "qrcode";

// interface UPIPaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   amount: number;
//   transactionRef: string;
//   onPaymentSuccess: () => void;
//   upiId: string;
//   receiverName: string;
// }

// const UPIPaymentModal = ({
//   isOpen,
//   onClose,
//   amount,
//   transactionRef,
//   onPaymentSuccess,
//   upiId,
//   receiverName
// }: UPIPaymentModalProps) => {
//   const [copied, setCopied] = useState(false);
//   const [qrDataUrl, setQrDataUrl] = useState("");

//   const generateUPIUrl = () => {
//     const params = new URLSearchParams({
//       pa: upiId,
//       pn: (receiverName ?? "UPI Receiver").replace(/[^a-zA-Z0-9 ]/g, ""),
//       am: amount.toFixed(2),
//       tr: transactionRef,
//       cu: "INR",
//       tn: `Maintenance Payment - ${transactionRef}`
//     });
//     return `upi://pay?${params.toString()}`;
//   };

//   /* ---------- QR CODE GENERATION ---------- */
//   useEffect(() => {
//     if (isOpen) {
//       QRCode.toDataURL(generateUPIUrl(), {
//         width: 300,
//         margin: 2
//       })
//         .then(setQrDataUrl)
//         .catch(console.error);
//     }
//   }, [isOpen, amount, upiId, receiverName, transactionRef]);

//   const copyUPIId = () => {
//     navigator.clipboard.writeText(upiId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             transition={{ type: "spring", duration: 0.3 }}
//             className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
//           >
//             {/* HEADER */}
//             <div className="gradient-trust px-6 py-4 flex items-center justify-between">
//               <button onClick={onClose}>
//                 <ArrowLeft className="h-5 w-5 text-primary-foreground" />
//               </button>
//               <h2 className="text-lg font-semibold text-primary-foreground">
//                 Scan to Pay
//               </h2>
//               <button onClick={onClose}>
//                 <X className="h-5 w-5 text-primary-foreground" />
//               </button>
//             </div>

//             {/* CONTENT */}
//             <div className="p-6">
//               {/* AMOUNT */}
//               <div className="text-center mb-6">
//                 <p className="text-sm text-muted-foreground">Amount to Pay</p>
//                 <div className="flex justify-center items-center gap-1">
//                   <IndianRupee className="h-8 w-8 text-primary" />
//                   <span className="text-4xl font-bold text-primary">
//                     {amount.toLocaleString("en-IN")}
//                   </span>
//                 </div>
//               </div>

//               {/* UPI INFO */}
//               <div className="bg-secondary/50 rounded-lg px-4 py-3 mb-4">
//                 <div className="flex justify-between items-center">
//                   <p className="font-mono text-sm">
//                     {upiId && upiId.length > 0 ? upiId : "UPI ID not available"}
//                   </p>
//                   <button onClick={copyUPIId}>
//                     {copied ? <Check /> : <Copy />}
//                   </button>
//                 </div>
//                 <p className="text-xs text-muted-foreground">{receiverName}</p>
//               </div>

//               <div className="bg-secondary/50 rounded-lg px-4 py-3 mb-6">
//                 <p className="text-xs text-muted-foreground mb-1">
//                   Transaction Reference
//                 </p>
//                 <p className="text-sm font-medium text-card-foreground font-mono">
//                   {transactionRef}
//                 </p>
//               </div>

//               {/* QR CODE */}
//               <div className="flex flex-col items-center">
//                 <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
//                   <QrCode className="h-4 w-4" />
//                   Scan using any UPI app
//                 </div>

//                 {qrDataUrl ? (
//                   <img src={qrDataUrl} className="w-64 h-64" />
//                 ) : (
//                   <p>Generating QR...</p>
//                 )}

//                 <Button
//                   className="w-full mt-6"
//                   onClick={() => {
//                     if (window.confirm("Payment completed?")) {
//                       onPaymentSuccess();
//                     }
//                   }}
//                 >
//                   I've Completed Payment
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default UPIPaymentModal;

import {
  X,
  // QrCode,
  IndianRupee,
  ArrowLeft,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import PaymentScreenshotUpload from "./PaymentScreenshotUpload";

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  transactionRef: string;
  onPaymentSuccess: () => void;
  upiId: string;
  receiverName: string;
}

const UPIPaymentModal = ({
  isOpen,
  onClose,
  amount,
  transactionRef,
  onPaymentSuccess,
  upiId,
  receiverName
}: UPIPaymentModalProps) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const now = new Date();

  const generateUPIUrl = () => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: (receiverName ?? "UPI Receiver").replace(/[^a-zA-Z0-9 ]/g, ""),
      am: (amount ?? 0).toFixed(2),
      tr: transactionRef,
      cu: "INR",
      tn: `Maintenance Payment - ${transactionRef}`
    });
    return `upi://pay?${params.toString()}`;
  };

  /* ---------- QR CODE GENERATION ---------- */
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(generateUPIUrl(), {
        width: 300,
        margin: 2
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [isOpen, amount, upiId, receiverName, transactionRef]);

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentCompleted = () => {
    setShowUpload(true);
  };

  const handleUpload = (file: File) => {
    console.log("Uploaded file:", file.name);
    onPaymentSuccess();
  };

  const handleSkip = () => {
    onPaymentSuccess();
  };

  const handleClose = () => {
    setShowUpload(false);
    onClose();
  };

  const handleBack = () => {
    if (showUpload) {
      setShowUpload(false);
    } else {
      onClose();
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
            {/* HEADER */}
            <div className="gradient-trust px-6 py-4 flex items-center justify-between">
              <button 
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-primary-foreground" />
              </button>
              <h2 className="text-lg font-semibold text-primary-foreground">
                {showUpload ? "Upload Screenshot" : "UPI Payment"}
              </h2>
              <button 
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <X className="h-5 w-5 text-primary-foreground" />
              </button>
            </div>

            {/* CONTENT */}
            <AnimatePresence mode="wait">
            {!showUpload ? (
              <div className="p-6">
                {/* AMOUNT */}
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <div className="flex justify-center items-center gap-1">
                    <IndianRupee className="h-8 w-8 text-primary" />
                    <span className="text-4xl font-bold text-primary">
                      {(amount ?? 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* UPI INFO */}
                <div className="bg-secondary/50 rounded-lg px-4 py-3 mb-4">
                  <div className="flex justify-between items-center">
                    <p className="font-mono text-sm">
                      {upiId && upiId.length > 0 ? upiId : "UPI ID not available"}
                    </p>
                    <button onClick={copyUPIId}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">{receiverName}</p>
                </div>

                <div className="bg-secondary/50 rounded-lg px-4 py-3 mb-6">
                  <p className="text-xs text-muted-foreground mb-1">
                    Transaction Reference
                  </p>
                  <p className="text-sm font-medium text-card-foreground font-mono">
                    {transactionRef}
                  </p>
                </div>

                {/* QR CODE */}
                <div className="flex flex-col items-center">
                  {/* <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <QrCode className="h-4 w-4" />
                    <span>Scan using any UPI app</span>
                  </div> */}

                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="UPI QR Code" className="w-64 h-64" />
                  ) : (
                    <p>Generating QR...</p>
                  )}

                  <Button
                    className="w-full mt-6"
                    onClick={handlePaymentCompleted}
                  >
                    I've Completed Payment
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PaymentScreenshotUpload
                  onUpload={handleUpload}
                  onSkip={handleSkip}
                  month={now.getMonth() + 1}   // JS months are 0-based
                  year={now.getFullYear()}
                />
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UPIPaymentModal;
