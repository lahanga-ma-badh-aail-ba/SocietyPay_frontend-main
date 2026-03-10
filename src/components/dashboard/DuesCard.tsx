// // import { Calendar, IndianRupee, CreditCard } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { motion } from "framer-motion";

// // interface DuesCardProps {
// //   amount: number;        // 👈 passed from parent (from /flats/me)
// //   onPayClick: () => void;
// // }

// // const DuesCard = ({ amount, onPayClick }: DuesCardProps) => {
// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.5 }}
// //       className="card-elevated overflow-hidden"
// //     >
// //       {/* Header Strip */}
// //       <div className="gradient-trust px-6 py-4">
// //         <h2 className="text-lg font-semibold text-primary-foreground">
// //           Your Monthly Dues
// //         </h2>
// //       </div>

// //       {/* Content */}
// //       <div className="p-6">
// //         {/* Amount Display */}
// //         <div className="text-center mb-6">
// //           <div className="flex items-center justify-center gap-1">
// //             <IndianRupee className="h-8 w-8 text-primary" />
// //             <span className="text-5xl font-bold text-primary tracking-tight">
// //               {amount.toLocaleString("en-IN")}
// //             </span>
// //           </div>
// //         </div>

// //         {/* Static Due Info (Optional UI only) */}
// //         <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
// //           <Calendar className="h-4 w-4" />
// //           <span className="text-sm">Monthly Maintenance</span>
// //         </div>

// //         {/* Pay Button */}
// //         <Button
// //           variant="action"
// //           size="xl"
// //           className="w-full"
// //           onClick={onPayClick}
// //         >
// //           <CreditCard className="h-5 w-5" />
// //           Pay with UPI
// //         </Button>
// //       </div>
// //     </motion.div>
// //   );
// // };

// // export default DuesCard;

// import { Calendar, IndianRupee, CreditCard } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";

// interface DuesCardProps {
//   amount: number;        // from /flats/me
//   onPayClick: () => void;
//   isPaid: boolean;       // 👈 NEW
// }

// const DuesCard = ({ amount, onPayClick, isPaid }: DuesCardProps) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="card-elevated overflow-hidden"
//     >
//       {/* Header Strip */}
//       <div className="gradient-trust px-6 py-4">
//         <h2 className="text-lg font-semibold text-primary-foreground">
//           Your Monthly Dues
//         </h2>
//       </div>

//       <div className="p-6">
//         {isPaid ? (
//           /* ✅ PAID STATE */
//           <div className="text-center py-4">
//             <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
//               <CreditCard className="h-8 w-8 text-accent" />
//             </div>
//             <p className="text-lg font-medium text-accent">
//               All dues cleared!
//             </p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Thank you for your payment
//             </p>
//           </div>
//         ) : (
//           /* ❌ NOT PAID STATE */
//           <>
//             {/* Amount Display */}
//             <div className="text-center mb-6">
//               <div className="flex items-center justify-center gap-1">
//                 <IndianRupee className="h-8 w-8 text-primary" />
//                 <span className="text-5xl font-bold text-primary tracking-tight">
//                   {amount.toLocaleString("en-IN")}
//                 </span>
//               </div>
//             </div>

//             {/* Due Info */}
//             <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
//               <Calendar className="h-4 w-4" />
//               <span className="text-sm">Monthly Maintenance</span>
//             </div>

//             {/* Pay Button */}
//             <Button
//               variant="action"
//               size="xl"
//               className="w-full"
//               onClick={onPayClick}
//             >
//               <CreditCard className="h-5 w-5" />
//               Pay with UPI
//             </Button>
//           </>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default DuesCard;

// import { useEffect, useState } from "react";
// import { Calendar, IndianRupee, CreditCard } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { api } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// interface DuesCardProps {
//   amount: number;
//   onPayClick: () => void;
// }

// const DuesCard = ({ amount, onPayClick }: DuesCardProps) => {
//   const [isPaid, setIsPaid] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchPaymentStatus();
//   }, []);

//   const fetchPaymentStatus = async () => {
//     try {
//       setIsLoading(true);
//       // Fetch the user's flat/dues information
//       const response = await api.get("/flats/me");
      
//       // Assuming the API returns something like { isPaid: boolean } or { dueAmount: number }
//       // Adjust based on your actual API response structure
//       setIsPaid(response.data.isPaid || response.data.dueAmount === 0);
//     } catch (error) {
//       console.error("Error fetching payment status:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load payment status",
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
//       transition={{ duration: 0.5 }}
//       className="card-elevated overflow-hidden"
//     >
//       {/* Header Strip */}
//       <div className="gradient-trust px-6 py-4">
//         <h2 className="text-lg font-semibold text-primary-foreground">
//           Your Monthly Dues
//         </h2>
//       </div>

//       <div className="p-6">
//         {isLoading ? (
//           <div className="text-center py-8 text-muted-foreground">
//             Loading payment status...
//           </div>
//         ) : isPaid ? (
//           /* ✅ PAID STATE */
//           <div className="text-center py-4">
//             <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
//               <CreditCard className="h-8 w-8 text-accent" />
//             </div>
//             <p className="text-lg font-medium text-accent">
//               All dues cleared!
//             </p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Thank you for your payment
//             </p>
//           </div>
//         ) : (
//           /* ❌ NOT PAID STATE */
//           <>
//             {/* Amount Display */}
//             <div className="text-center mb-6">
//               <div className="flex items-center justify-center gap-1">
//                 <IndianRupee className="h-8 w-8 text-primary" />
//                 <span className="text-5xl font-bold text-primary tracking-tight">
//                   {amount.toLocaleString("en-IN")}
//                 </span>
//               </div>
//             </div>

//             {/* Due Info */}
//             <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
//               <Calendar className="h-4 w-4" />
//               <span className="text-sm">Monthly Maintenance</span>
//             </div>

//             {/* Pay Button */}
//             <Button
//               variant="action"
//               size="xl"
//               className="w-full"
//               onClick={onPayClick}
//             >
//               <CreditCard className="h-5 w-5" />
//               Pay with UPI
//             </Button>
//           </>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default DuesCard;

import { useEffect, useState } from "react";
import { Calendar, IndianRupee, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DuesCardProps {
  amount: number;
  onPayClick: () => void;
}

const DuesCard = ({ amount, onPayClick }: DuesCardProps) => {
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  const fetchPaymentStatus = async () => {
    try {
      setIsLoading(true);
      // Fetch payment history from the same endpoint as PaymentHistory component
      const response = await api.get("/payments/my");
      const payments = response.data;
      
      // Check if there's any recent PAID payment
      // You can adjust this logic based on your needs:
      // Option 1: Check if the latest payment is PAID
      if (payments.length > 0) {
        const latestPayment = payments[0]; // Assuming sorted by date (newest first)
        setIsPaid(latestPayment.status === "PAID");
      } else {
        setIsPaid(false);
      }
      
      // Option 2: Check if there's any PAID payment this month
      // const currentMonth = new Date().getMonth();
      // const currentYear = new Date().getFullYear();
      // const paidThisMonth = payments.some((payment: any) => {
      //   const paymentDate = new Date(payment.createdAt);
      //   return payment.status === "PAID" && 
      //          paymentDate.getMonth() === currentMonth &&
      //          paymentDate.getFullYear() === currentYear;
      // });
      // setIsPaid(paidThisMonth);
      
    } catch (error) {
      console.error("Error fetching payment status:", error);
      toast({
        title: "Error",
        description: "Failed to load payment status",
        variant: "destructive",
      });
      setIsPaid(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-elevated overflow-hidden"
    >
      {/* Header Strip */}
      <div className="gradient-trust px-6 py-4">
        <h2 className="text-lg font-semibold text-primary-foreground">
          Your Monthly Dues
        </h2>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading payment status...
          </div>
        ) : isPaid ? (
          /* ✅ PAID STATE */
          <div className="text-center py-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
              <CreditCard className="h-8 w-8 text-accent" />
            </div>
            <p className="text-lg font-medium text-accent">
              All dues cleared!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Thank you for your payment
            </p>
          </div>
        ) : (
          /* ❌ NOT PAID STATE */
          <>
            {/* Amount Display */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-1">
                <IndianRupee className="h-8 w-8 text-primary" />
                <span className="text-5xl font-bold text-primary tracking-tight">
                  {amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Due Info */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Monthly Maintenance</span>
            </div>

            {/* Pay Button */}
            <Button
              variant="action"
              size="xl"
              className="w-full"
              onClick={onPayClick}
            >
              <CreditCard className="h-5 w-5" />
              Pay with UPI
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DuesCard;