// import { useEffect, useState } from "react";
// import { History } from "lucide-react";
// import PaymentHistoryItem from "./PaymentHistoryItem";
// import { motion } from "framer-motion";
// import { api } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// interface Payment {
//   id: string;
//   amount: number;
//   createdAt: string;
//   transactionId: string | null;
// }

// const PaymentHistory = () => {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchPaymentHistory();
//   }, []);

//   const fetchPaymentHistory = async () => {
//     try {
//       setIsLoading(true);
//       const response = await api.get("/payments/my");
//       setPayments(response.data);
//     } catch (error) {
//       console.error("Error fetching payment history:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load payment history",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.1 }}
//       className="card-elevated"
//     >
//       {/* Header */}
//       <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
//         <History className="h-5 w-5 text-primary" />
//         <h3 className="text-lg font-semibold text-card-foreground">
//           Payment History
//         </h3>
//       </div>

//       {/* List */}
//       <div className="px-6">
//         {isLoading ? (
//           <div className="py-8 text-center text-muted-foreground">
//             Loading payment history...
//           </div>
//         ) : payments.length > 0 ? (
//           payments.map((payment) => (
//             <PaymentHistoryItem
//               key={payment.id}
//               date={new Date(payment.createdAt).toLocaleDateString()}
//               amount={payment.amount}
//               receiptNumber={payment.transactionId || "N/A"}
//             />
//           ))
//         ) : (
//           <div className="py-8 text-center text-muted-foreground">
//             <p className="text-sm">No payment history yet</p>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default PaymentHistory;

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import PaymentHistoryItem from "./PaymentHistoryItem";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  amount: number;
  createdAt: string;
  transactionId: string | null;
  status: "PAID" | "PENDING" | "FAILED";
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/payments/my");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card-elevated"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <History className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">
          Payment History
        </h3>
      </div>

      {/* List */}
      <div className="px-6">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading payment history...
          </div>
        ) : payments.length > 0 ? (
          payments.map((payment) => (
            <PaymentHistoryItem
              key={payment.id}
              date={new Date(payment.createdAt).toLocaleDateString()}
              amount={payment.amount}
              receiptNumber={payment.transactionId || "N/A"}
              status={payment.status || "PENDING"}
            />
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-sm">No payment history yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentHistory;
