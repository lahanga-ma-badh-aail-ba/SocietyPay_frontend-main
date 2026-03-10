// import { CheckCircle2, IndianRupee, ClockAlert, CircleX } from "lucide-react";

// interface PaymentHistoryItemProps {
//   date: string;
//   amount: number;
//   receiptNumber: string;
// }

// const PaymentHistoryItem = ({ date, amount, receiptNumber }: PaymentHistoryItemProps) => {
//   return (
//     <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
//       {/* Left: Status & Date */}
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
//           <CheckCircle2 className="h-6 w-6 text-accent" />
//           <ClockAlert className="h-6 w-6 text-accent" />
//           <CircleX className="h-6 w-6 text-accent" />
//         </div>
//         <div>
//           <p className="text-sm font-medium text-card-foreground">{date}</p>
//           <p className="text-xs text-muted-foreground">Ref: {receiptNumber}</p>
//         </div>
//       </div>

//       {/* Right: Amount */}
//       <div className="flex items-center gap-1 text-primary font-semibold">
//         <IndianRupee className="h-4 w-4" />
//         <span>{amount.toLocaleString("en-IN")}</span>
//       </div>
//     </div>
//   );
// };

// export default PaymentHistoryItem;

import { CheckCircle2, IndianRupee, ClockAlert, CircleX } from "lucide-react";

interface PaymentHistoryItemProps {
  date: string;
  amount: number;
  receiptNumber: string;
  status: "PAID" | "PENDING" | "FAILED";
}

const PaymentHistoryItem = ({
  date,
  amount,
  receiptNumber,
  status,
}: PaymentHistoryItemProps) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center ">
          {status === "PAID" && <CheckCircle2 className="h-7 w-7 text-green-600" />}
          {status === "PENDING" && (
            <ClockAlert className="h-7 w-7 text-yellow-500" />
          )}
          {status === "FAILED" && <CircleX className="h-7 w-7 text-red-600" />}
        </div>

        <div>
          <p className="text-sm font-medium text-card-foreground">{date}</p>
          <p className="text-xs text-muted-foreground">Ref: {receiptNumber}</p>
          <p className="text-xs text-muted-foreground">Status: {status}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 text-primary font-semibold">
        <IndianRupee className="h-4 w-4" />
        <span>{amount.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
};

export default PaymentHistoryItem;
