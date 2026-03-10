// import { Receipt, HelpCircle, MessageSquare } from "lucide-react";
// import { motion } from "framer-motion";
// import PaymentReceipt from "../payment/PaymentReceipt"; 

// interface QuickActionProps {
//   icon: React.ReactNode;
//   label: string;
//   onClick?: () => void;
// }

// const QuickAction = ({ icon, label, onClick }: QuickActionProps) => (
//   <button
//     onClick={onClick}
//     className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-card transition-all duration-200 active:scale-[0.98]"
//   >
//     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
//       {icon}
//     </div>
//     <span className="text-xs font-medium text-card-foreground">{label}</span>
//   </button>
// );

// const QuickActions = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//     >
//       <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Quick Actions</h3>
//       <div className="grid grid-cols-3 gap-3">
//         <QuickAction
//           icon={<Receipt className="h-6 w-6 text-accent" />}
//           label="View Receipts"
//         />
//         <QuickAction
//           icon={<MessageSquare className="h-6 w-6 text-accent" />}
//           label="Contact Admin"
//         />
//         <QuickAction
//           icon={<HelpCircle className="h-6 w-6 text-accent" />}
//           label="Help & FAQ"
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default QuickActions;

import { Receipt, HelpCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickAction = ({ icon, label, onClick }: QuickActionProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-card transition-all duration-200 active:scale-[0.98]"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
      {icon}
    </div>
    <span className="text-xs font-medium text-card-foreground">{label}</span>
  </button>
);

interface QuickActionsProps {
  onViewReceipt: () => void; // Callback to show receipt
  latestPayment?: {
    amount: number;
    transactionId: string;
    createdAt: string;
    receiptNo?: string;
    billNo?: string;
  } | null;
}

const QuickActions = ({ onViewReceipt, latestPayment }: QuickActionsProps) => {
  const handleViewReceipt = () => {
    if (!latestPayment) {
      alert("No payment receipts available");
      return;
    }
    onViewReceipt();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        Quick Actions
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <QuickAction
          icon={<Receipt className="h-6 w-6 text-accent" />}
          label="View Receipts"
          onClick={handleViewReceipt}
        />
        <QuickAction
          icon={<MessageSquare className="h-6 w-6 text-accent" />}
          label="Contact Admin"
          onClick={() => {
            window.location.href = "mailto:admin@societypay.com";
          }}
        />
        <QuickAction
          icon={<HelpCircle className="h-6 w-6 text-accent" />}
          label="Help & FAQ"
          onClick={() => alert("Help & FAQ coming soon!")}
        />
      </div>
    </motion.div>
  );
};

export default QuickActions;