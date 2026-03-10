import { useState, useEffect } from "react";
import { User, Mail, Building2, Phone, Calendar, CreditCard, LogOut, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PaymentHistoryModal from "@/components/dashboard/PaymentHistoryModal";

interface Payment {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  paidAt?: string;
  createdAt?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      console.log('User data:', user); 
      setEditData({
        name: user.name,
        email: user.email,
        phone: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchPayments = async () => {
      try {
        setLoadingPayments(true);
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payments/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setPayments(data);
        } else {
          console.error("Unexpected payments response:", data);
          setPayments([]);
        }
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setPayments([]);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [user]);

  const handleSave = async () => {
    // TODO: Implement update profile API call
    setIsEditing(false);
    await refreshUser();
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        name: user.name,
        email: user.email,
        phone: "",
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingDues = payments
    .filter((p) => p.status === "PENDING" || p.status === "FAILED")
    .reduce((sum, p) => sum + p.amount, 0);

  const lastPayment = payments
    .filter((p) => p.status === "PAID")
    .sort(
      (a, b) =>
        new Date(b.paidAt || "").getTime() -
        new Date(a.paidAt || "").getTime()
    )[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary to-primary/70" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-foreground pt-16">{user.name}</h2>
                <p className="text-muted-foreground">
                  {user.flat ? `Flat ${user.flat.flatNumber}` : "No flat assigned"} • {user.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground font-medium">{user.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-foreground">{user.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-foreground">{user.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <p className="text-foreground font-medium">{user.role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Residence Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Residence Information
              </CardTitle>
              <CardDescription>Your flat details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.flat ? (
                <>
                  <div className="space-y-2">
                    <Label>Flat Number</Label>
                    <p className="text-foreground font-medium">{user.flat.flatNumber}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Owner Name</Label>
                    <p className="text-foreground">{user.flat.ownerName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Monthly Maintenance</Label>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">₹{user.flat.monthlyMaintenance.toLocaleString()}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No flat assigned</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-foreground">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {loadingPayments ? (
                <p className="text-muted-foreground">
                  Loading payments...
                </p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Total Paid</span>
                    <span className="font-semibold">
                      ₹{totalPaid.toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span>Pending Dues</span>
                    <span className="text-destructive font-semibold">
                      ₹{pendingDues.toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span>Last Payment</span>
                    <span>
                      {lastPayment
                        ? new Date(lastPayment.paidAt!).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  {/* <Link to="/payments/history">
                    <Button variant="outline" className="w-full mt-2">
                      View Payment History
                    </Button>
                  </Link> */}
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    View Payment History
                  </Button>

                  <PaymentHistoryModal
                    open={showPaymentModal}
                    onOpenChange={setShowPaymentModal}
                    payments={payments}
                    loading={loadingPayments}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 pb-2">
                {!isEditing ? (
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                )}
              </div>
              <Separator />
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;