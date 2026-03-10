// import {
//   X,
//   QrCode,
//   IndianRupee,
//   Smartphone,
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
//   const [paymentInitiated, setPaymentInitiated] = useState(false);
//   const [activeTab, setActiveTab] = useState<"app" | "qr">("app");
//   const [qrDataUrl, setQrDataUrl] = useState("");

//   const generateUPIUrl = () => {
//     const params = new URLSearchParams({
//       pa: upiId,
//       pn: (receiverName ?? "UPI Receiver").replace(/[^a-zA-Z0-9 ]/g, ""),
//       am: amount.toFixed(2),
//       tr: transactionRef,
//       cu: "INR",
//       // mode: "02",
//       tn: `Maintenance Payment - ${transactionRef}`
//     });
//     return `upi://pay?${params.toString()}`;
//   };

//   /* ---------- QR CODE GENERATION ---------- */
//   useEffect(() => {
//     if (isOpen && activeTab === "qr") {
//       QRCode.toDataURL(generateUPIUrl(), {
//         width: 300,
//         margin: 2
//       })
//         .then(setQrDataUrl)
//         .catch(console.error);
//     }
//   }, [isOpen, activeTab, amount, upiId, receiverName, transactionRef]);

//   /* ---------- UPI APP FLOW ---------- */
//   const handleUPIPayment = () => {
//     setPaymentInitiated(true);
//     window.location.href = generateUPIUrl();

//     setTimeout(() => {
//       const confirmed = window.confirm(
//         "Have you completed the payment in your UPI app?\n\nClick OK if successful."
//       );
//       if (confirmed) onPaymentSuccess();
//       else setPaymentInitiated(false);
//     }, 3000);
//   };

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
//                 UPI Payment
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
//                 <p className="text-xs text-muted-foreground mb-1">Transaction Reference</p>
//                 <p className="text-sm font-medium text-card-foreground font-mono">{transactionRef}</p>
//               </div>

//               {/* TAB SWITCH */}
//               <div className="flex gap-2 mb-6">
//                 <Button
//                   className="flex-1"
//                   variant={activeTab === "app" ? "default" : "outline"}
//                   onClick={() => setActiveTab("app")}
//                 >
//                   <Smartphone className="mr-2 h-4 w-4" /> Pay with App
//                 </Button>
//                 <Button
//                   className="flex-1"
//                   variant={activeTab === "qr" ? "default" : "outline"}
//                   onClick={() => setActiveTab("qr")}
//                 >
//                   <QrCode className="mr-2 h-4 w-4" /> Scan QR
//                 </Button>
//               </div>

//               {/* APP TAB */}
//               {activeTab === "app" && (
//                 <Button
//                   className="w-full"
//                   onClick={handleUPIPayment}
//                   disabled={paymentInitiated}
//                 >
//                   {paymentInitiated ? "Opening UPI App..." : "Pay with UPI App"}
//                 </Button>
//               )}

//               {/* QR TAB */}
//               {activeTab === "qr" && (
//                 <div className="flex flex-col items-center">
//                   {qrDataUrl ? (
//                     <img src={qrDataUrl} className="w-64 h-64" />
//                   ) : (
//                     <p>Generating QR...</p>
//                   )}
//                   <Button
//                     className="w-full mt-4"
//                     onClick={() => {
//                       if (window.confirm("Payment completed?")) {
//                         onPaymentSuccess();
//                       }
//                     }}
//                   >
//                     I've Completed Payment
//                   </Button>
//                 </div>
//               )}
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
  QrCode,
  IndianRupee,
  ArrowLeft,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

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

  const generateUPIUrl = () => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: (receiverName ?? "UPI Receiver").replace(/[^a-zA-Z0-9 ]/g, ""),
      am: amount.toFixed(2),
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
              <button onClick={onClose}>
                <ArrowLeft className="h-5 w-5 text-primary-foreground" />
              </button>
              <h2 className="text-lg font-semibold text-primary-foreground">
                Scan to Pay
              </h2>
              <button onClick={onClose}>
                <X className="h-5 w-5 text-primary-foreground" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              {/* AMOUNT */}
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <div className="flex justify-center items-center gap-1">
                  <IndianRupee className="h-8 w-8 text-primary" />
                  <span className="text-4xl font-bold text-primary">
                    {amount.toLocaleString("en-IN")}
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
                    {copied ? <Check /> : <Copy />}
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
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <QrCode className="h-4 w-4" />
                  Scan using any UPI app
                </div>

                {qrDataUrl ? (
                  <img src={qrDataUrl} className="w-64 h-64" />
                ) : (
                  <p>Generating QR...</p>
                )}

                <Button
                  className="w-full mt-6"
                  onClick={() => {
                    if (window.confirm("Payment completed?")) {
                      onPaymentSuccess();
                    }
                  }}
                >
                  I've Completed Payment
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UPIPaymentModal;
