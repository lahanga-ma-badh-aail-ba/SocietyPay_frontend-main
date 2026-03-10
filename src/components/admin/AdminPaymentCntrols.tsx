import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, AlertCircle, RefreshCw, Info, AlertTriangle } from "lucide-react";

const AdminPaymentControls = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  const handleCreateMonthlyPayments = async () => {
    try {
      setIsCreating(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/payments/create-monthly-payments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Created ${data.successful} payments for ${data.total} users`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create payments",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleMarkOverdue = async () => {
    try {
      setIsMarking(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/payments/mark-overdue-payments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark overdue payments",
        variant: "destructive",
      });
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <RefreshCw className="h-5 w-5 text-primary" />
          Payment Automation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Panel */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-primary flex items-center gap-2">
            <Info className="h-4 w-4" />
            Automatic Schedule
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-6">
            <li>• <span className="font-medium text-foreground">1st of month:</span> Creates payments automatically</li>
            <li>• <span className="font-medium text-foreground">After 10th:</span> Marks unpaid as FAILED automatically</li>
            <li>• <span className="font-medium text-foreground">Runs:</span> Daily at midnight</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
            <Button
              onClick={handleCreateMonthlyPayments}
              disabled={isCreating}
              variant="action"
              className="w-full"
              size="lg"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isCreating ? "Creating..." : "Create Monthly Payments"}
            </Button>
            <p className="text-xs text-muted-foreground px-1">
              Manually create PENDING payments for all users with assigned flats. 
              Use this if the automatic scheduler failed or for testing.
            </p>
            </div>

            <div className="flex flex-col gap-2">
            <Button
              onClick={handleMarkOverdue}
              disabled={isMarking}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {isMarking ? "Processing..." : "Mark Overdue Payments"}
            </Button>
            <p className="text-xs text-muted-foreground px-1">
              Manually mark PENDING payments as FAILED after the 10th. 
              Only works after the deadline has passed.
            </p>
          </div>
          </div>
        </div>

        {/* Warning Panel */}
        <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg mt-4">
          <p className="text-xs text-foreground flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <span>
              <span className="font-medium">Note:</span> These buttons are for manual control only. 
              The system runs automatically - you don't need to click these unless 
              testing or if automation fails.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPaymentControls;
