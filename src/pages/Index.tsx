// import { useEffect, useState } from "react";
// import Header from "@/components/layout/Header";
// import DuesCard from "@/components/dashboard/DuesCard";
// import PaymentHistory from "@/components/dashboard/PaymentHistory";
// import QuickActions from "@/components/dashboard/QuickActions";
// import UPIPaymentModal from "@/components/payment/UPIPaymentModal";
// import PaymentSuccessModal from "@/components/payment/PaymentSuccessModal";

// // Sample payment history data
// const initialPayments = [
//   { id: "1", date: "Dec 15, 2025", amount: 1500, receiptNumber: "U-9876543210" },
//   { id: "2", date: "Nov 15, 2025", amount: 1500, receiptNumber: "U-8765432109" },
//   { id: "3", date: "Oct 15, 2025", amount: 1500, receiptNumber: "U-7654321098" },
// ];

// const Index = () => {
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [payments, setPayments] = useState(initialPayments);
//   const [isPaid, setIsPaid] = useState(false);
  
//   const currentAmount = 1500;
//   const dueDate = "25th January, 2026";
//   const transactionRef = `U-${Date.now().toString().slice(-10)}`;

//   const [upiConfig, setUpiConfig] = useState<{
//     upiId: string;
//     receiverName: string;
//   } | null>(null);

//   useEffect(() => {
//     fetch("http://localhost:8080/api/payment/upi-config")
//       .then(res => res.json())
//       .then(data => setUpiConfig(data));
//   }, []);


//   const handlePayClick = () => {
//     setShowPaymentModal(true);
//   };

//   const handlePaymentSuccess = () => {
//     setShowPaymentModal(false);
//     setShowSuccessModal(true);
//     setIsPaid(true);
    
//     // Add new payment to history
//     const today = new Date();
//     const newPayment = {
//       id: Date.now().toString(),
//       date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       amount: currentAmount,
//       receiptNumber: transactionRef,
//     };
//     setPayments([newPayment, ...payments]);
//   };

//   const handleSuccessClose = () => {
//     setShowSuccessModal(false);
//   };

//   //userName="Resident" flatNumber="A-101"

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
      
//       <main className="container py-6 space-y-6 max-w-lg mx-auto">
//         {/* Dues Card */}
//         <DuesCard
//           amount={currentAmount}
//           dueDate={dueDate}
//           onPayClick={handlePayClick}
//           isPaid={isPaid}
//         />

//         {/* Quick Actions */}
//         <QuickActions />

//         {/* Payment History */}
//         <PaymentHistory payments={payments} />
//       </main>

//       {/* Payment Modal */}
//       {/* <UPIPaymentModal
//         isOpen={showPaymentModal}
//         onClose={() => setShowPaymentModal(false)}
//         amount={currentAmount}
//         transactionRef={transactionRef}
//         onPaymentSuccess={handlePaymentSuccess}
//       /> */}
//         <UPIPaymentModal
//           isOpen={showPaymentModal}
//           onClose={() => setShowPaymentModal(false)}
//           amount={currentAmount}
//           transactionRef={transactionRef}
//           onPaymentSuccess={handlePaymentSuccess}
//           upiId={upiConfig?.upiId ?? ""}                // ✅ NOW FILLED
//           receiverName={upiConfig?.receiverName ?? ""}   // ✅ NOW FILLED
//         />

//       {/* Success Modal */}
//       <PaymentSuccessModal
//         isOpen={showSuccessModal}
//         onClose={handleSuccessClose}
//         amount={currentAmount}
//         transactionRef={transactionRef}
//         date={new Date().toLocaleDateString('en-US', { 
//           month: 'short', 
//           day: 'numeric', 
//           year: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit'
//         })}
//       />
//     </div>
//   );
// };

// export default Index;

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import DuesCard from "@/components/dashboard/DuesCard";
import PaymentHistory from "@/components/dashboard/PaymentHistory";
import QuickActions from "@/components/dashboard/QuickActions";
import UPIPaymentModal from "@/components/payment/UPIPaymentModal";
import PaymentSuccessModal from "@/components/payment/PaymentSuccessModal";
import PaymentReceipt from "@/components/payment/PaymentReceipt";
import { api } from "@/lib/api";


// Sample payment history data (still static for now)
const initialPayments = [
  { id: "1", date: "Dec 15, 2025", amount: 1500, receiptNumber: "U-9876543210" },
  { id: "2", date: "Nov 15, 2025", amount: 1500, receiptNumber: "U-8765432109" },
  { id: "3", date: "Oct 15, 2025", amount: 1500, receiptNumber: "U-7654321098" },
];

const Index = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [payments, setPayments] = useState(initialPayments);
  const [isPaid, setIsPaid] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Amount from /flats/me
  const [amount, setAmount] = useState(0);

  const transactionRef = `U-${Date.now().toString().slice(-10)}`;

  const [upiConfig, setUpiConfig] = useState<{
    upiId: string;
    receiverName: string;
  } | null>(null);

  /* ---------------- FETCH FLAT ONCE ---------------- */
  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const res = await api.get("/flats/me");
        if (res.data) {
          setAmount(res.data.monthlyMaintenance);
        }
      } catch (err) {
        console.error("Failed to fetch flat:", err);
      }
    };

    fetchFlat();
  }, []);

  /* ---------------- FETCH UPI CONFIG ---------------- */
  useEffect(() => {
    const fetchUpi = async () => {
      try {
        const res = await api.get("/payments/upi-config");
        setUpiConfig(res.data);
      } catch (err) {
        console.error("Failed to fetch UPI config:", err);
      }
    };
    fetchUpi();
  }, []);

    // Static data for demo
  // const duesAmount = 1500;
  const latestPayment = {
    amount: 1500,
    transactionId: "UPI123456789",
    createdAt: new Date().toISOString(),
    receiptNo: "BR/329/25-26",
    billNo: "BILL/25-26/354"
  };

  const handlePayClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
    setIsPaid(true);

    const today = new Date();
    const newPayment = {
      id: Date.now().toString(),
      date: today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      amount,
      receiptNumber: transactionRef,
    };
    setPayments([newPayment, ...payments]);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  const handleViewReceipt = () => {
    setShowSuccessModal(false); // Close success modal if open
    setShowReceipt(true); // Show receipt
  };

  // If receipt is being shown, display only the receipt component
  if (showReceipt) {
    return <PaymentReceipt onBack={() => setShowReceipt(false)}/>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 space-y-6 max-w-lg mx-auto">
        {/* Dues Card */}
        <DuesCard amount={amount} onPayClick={handlePayClick} isPaid={isPaid}/>

        {/* Quick Actions */}
        <QuickActions onViewReceipt={handleViewReceipt} latestPayment={latestPayment}/>

        {/* Payment History */}
        <PaymentHistory payments={payments} />
      </main>

      {/* Payment Modal */}
      <UPIPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={amount}                       // 👈 from /flats/me
        transactionRef={transactionRef}
        onPaymentSuccess={handlePaymentSuccess}
        upiId={upiConfig?.upiId ?? ""}
        receiverName={upiConfig?.receiverName ?? ""}
      />

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        amount={amount}
        onViewReceipt={handleViewReceipt}
        transactionRef={transactionRef}
        date={new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    </div>
  );
};

export default Index;
