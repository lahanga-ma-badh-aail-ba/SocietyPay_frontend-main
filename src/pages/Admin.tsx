import { useState } from "react";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TenantManagement from "@/components/admin/TenantManagement";
import PaymentStatus from "@/components/admin/PaymentStatus";
import OccupancyOverview from "@/components/admin/OccupancyOverview";
import AdminPaymentControls from "@/components/admin/AdminPaymentCntrols";
import { Users, Receipt, Building, RefreshCw } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("tenants");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage tenants, payments, and occupancy</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tenants" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Tenants</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="occupancy" className="gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Occupancy</span>
            </TabsTrigger>
            <TabsTrigger value="controls" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Controls</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenants">
            <TenantManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentStatus />
          </TabsContent>

          <TabsContent value="occupancy">
            <OccupancyOverview />
          </TabsContent>

          <TabsContent value="controls">
            <AdminPaymentControls />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
