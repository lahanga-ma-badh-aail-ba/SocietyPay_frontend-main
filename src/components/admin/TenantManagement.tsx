import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, UserPlus, Trash2, Shield, User as UserIcon, SquarePen, Eye, EyeClosed } from "lucide-react";
import { authAPI, User, Flat, flatAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  flatId?: string;
  ownerName?: string;
  monthlyMaintenance?: number;
}

interface UpdateData {
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
  flatId?: string | null;
  ownerName?: string;
  ownerPhone?: string;
  monthlyMaintenance?: number;
}

// Pre-defined list of flats
const FLATS = [
  "A-101", "A-102", "A-103", "A-104",
  "A-201", "A-202", "A-203", "A-204",
  "A-301", "A-302", "A-303", "A-304",
  "A-401", "A-402", "A-403", "A-404",
  "A-501", "A-502", "A-503", "A-504",
  "A-601", "A-602", "A-603", "A-604",
];

const TenantManagement = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "USER" as "ADMIN" | "USER",
    flatNumber: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    monthlyMaintenance: "",
  });

  const fetchFlats = async () => {
    try {
      const data = await flatAPI.getAllFlats();
      setFlats(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch flats",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFlats();
  }, []);

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER" as "ADMIN" | "USER",
    flatId: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    monthlyMaintenance: "",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getAllUsers();
      setUsers(response.users);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast({
          title: "Validation Error",
          description: "Name, email, and password are required",
          variant: "destructive",
        });
        return;
      }

      // Prepare registration data
      const registrationData: RegisterData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      };

      // If flat details are provided
      if (newUser.flatNumber && newUser.flatNumber.trim() !== "") {
        registrationData.flatId = newUser.flatNumber.trim();
        registrationData.ownerName = newUser.ownerName || newUser.name;
        registrationData.monthlyMaintenance = parseFloat(newUser.monthlyMaintenance) || 0;
      }

      await authAPI.register(registrationData);

      toast({
        title: "Success",
        description: "User added successfully",
      });

      // Reset form and close dialog
      setNewUser({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "USER",
        flatNumber: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
        monthlyMaintenance: "",
      });
      setIsAddOpen(false);

      // Refresh users list
      fetchUsers();
    } catch (error) {
      const errorMessage = 
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
        (error as Error).message || 
        "Failed to add user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
  setSelectedUser(user);
  setEditUser({
    name: user.name,
    email: user.email,
    password: user.email,
    phone: user.phone || "",
    role: user.role,
    flatId: user.flat?.id || "",
    ownerName: user.flat?.ownerName || user.name,
    ownerEmail: user.flat?.ownerEmail || "",
    ownerPhone: user.flat?.ownerPhone || "",
    monthlyMaintenance: user.flat?.monthlyMaintenance?.toString() || "",
  });
  setIsEditOpen(true);
};

  const handleUpdateUser = async () => {
  if (!selectedUser) return;

  try {
    setIsLoading(true);

    // Validate required fields
    if (!editUser.name || !editUser.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    // Prepare update data
    const updateData: UpdateData = {
      name: editUser.name,
      email: editUser.email,
      phone: editUser.phone,
      role: editUser.role,
    };

    // ✅ Handle flat assignment using REAL flatId (UUID)
    if (editUser.flatId && editUser.flatId.trim() !== "") {
      updateData.flatId = editUser.flatId; // ✅ UUID from DB
      updateData.ownerName = editUser.ownerName || editUser.name;
      updateData.ownerPhone = editUser.ownerPhone || "";
      updateData.monthlyMaintenance =
        parseFloat(editUser.monthlyMaintenance) || 0;
    } else {
      // Remove flat assignment
      updateData.flatId = null;
    }

    await authAPI.updateUser(selectedUser.id, updateData);

    toast({
      title: "Success",
      description: "User updated successfully",
    });

    setIsEditOpen(false);
    setSelectedUser(null);

    // Refresh users list
    fetchUsers();
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ||
      (error as Error).message ||
      "Failed to update user";

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setIsLoading(true);
      await authAPI.deleteUser(userToDelete.id);
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      const errorMessage = 
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
        (error as Error).message || 
        "Failed to delete user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            User Management
          </CardTitle>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Enter phone number (e.g., +91 9876543210)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "ADMIN" | "USER") => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Flat Details */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Flat Owner Data</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="flatNumber">Flat Number</Label>
                      <Select
                        value={newUser.flatNumber || "none"}
                        onValueChange={(value) => setNewUser({ ...newUser, flatNumber: value === "none" ? "" : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Flat Number" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="none">No Flat</SelectItem>
                          {FLATS.map((flatNumber) => {
                            // Check if this flat is already assigned
                            const existingFlat = flats.find(f => f.flatNumber === flatNumber);
                            const isAssigned = existingFlat?.user != null;
                            
                            return (
                              <SelectItem 
                                key={flatNumber} 
                                value={flatNumber}
                                disabled={isAssigned}
                              >
                                <div className="flex items-center justify-between w-full gap-2">
                                  <span className={isAssigned ? "line-through opacity-60" : ""}>
                                    {flatNumber}
                                  </span>
                                  {isAssigned && (
                                    <span className="ml-auto text-xs px-2 py-0.5 bg-gray-100 rounded">
                                      Assigned to {existingFlat.user?.name}
                                    </span>
                                  )}
                                  {!isAssigned && (
                                    <span className="ml-auto text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                      Available
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Assigned flats are disabled and marked
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        value={newUser.ownerName}
                        onChange={(e) => setNewUser({ ...newUser, ownerName: e.target.value })}
                        placeholder="Property owner name (defaults to user name)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerPhone">Owner Email Address</Label>
                      <Input
                        id="ownerEmail"
                        type="tel"
                        value={newUser.ownerEmail}
                        onChange={(e) => setNewUser({ ...newUser, ownerEmail: e.target.value })}
                        placeholder="Owner's email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerPhone">Owner Phone Number</Label>
                      <Input
                        id="ownerPhone"
                        type="tel"
                        value={newUser.ownerPhone}
                        onChange={(e) => setNewUser({ ...newUser, ownerPhone: e.target.value })}
                        placeholder="Owner's phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maintenance">Monthly Maintenance (₹)</Label>
                      <Input
                        id="maintenance"
                        type="number"
                        value={newUser.monthlyMaintenance}
                        onChange={(e) => setNewUser({ ...newUser, monthlyMaintenance: e.target.value })}
                        placeholder="e.g., 3500"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAddUser} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add User"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading && users.length === 0 ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>  {/* 🆕 Add Phone cell */}
                        {user.phone ? (
                          <span className="text-sm">{user.phone}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">No phone</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.role === 'ADMIN' ? (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <UserIcon className="h-3 w-3 mr-1" />
                            User
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.flat ? (
                          <span className="font-mono text-sm">{user.flat.flatNumber}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">No flat</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.flat ? (
                          <span>₹{user.flat.monthlyMaintenance.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(user)}
                            title="Edit user"
                          >
                            <SquarePen className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[70vh] overflow-y-auto pr-2 ps-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={ editUser.phone}
                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                    placeholder="Enter phone number (e.g., +91 9876543210)"
                  />
                </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select
                value={editUser.role}
                onValueChange={(value: "ADMIN" | "USER") => setEditUser({ ...editUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-flatNumber">Flat Number</Label>
              <Select
                value={editUser.flatId || "none"}
                onValueChange={(value) =>
                  setEditUser({
                    ...editUser,
                    flatId: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Flat" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="none">No Flat</SelectItem>
                  {flats.map((flat) => {
                    // Check if flat is assigned to someone else (not current user)
                    const isAssigned = flat.user != null && flat.user.id !== selectedUser?.id;
                    const isCurrentFlat = flat.user?.id === selectedUser?.id;
                    
                    return (
                      <SelectItem 
                        key={flat.id} 
                        value={flat.id}
                        disabled={isAssigned}
                      >
                        <div className="flex items-center justify-between w-full gap-2">
                          <span className={isAssigned ? "line-through opacity-60" : ""}>
                            {flat.flatNumber}
                          </span>
                          {isAssigned && (
                            <span className="ml-auto text-xs px-2 py-0.5 bg-gray-100 rounded">
                              Assigned to {flat.user?.name}
                            </span>
                          )}
                          {isCurrentFlat && (
                            <span className="ml-auto text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              Current
                            </span>
                          )}
                          {!flat.user && (
                            <span className="ml-auto text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              Available
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Flats assigned to other users are disabled
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-ownerName">Owner Name</Label>
              <Input
                id="edit-ownerName"
                value={editUser.ownerName}
                onChange={(e) => setEditUser({ ...editUser, ownerName: e.target.value })}
                placeholder="Property owner name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Owner Email Address</Label>
              <Input
                id="ownerEmail"
                type="tel"
                value={editUser.ownerEmail}
                onChange={(e) => setEditUser({ ...editUser, ownerEmail: e.target.value })}
                placeholder="Owner's email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Owner Phone Number</Label>
              <Input
                id="ownerPhone"
                type="tel"
                value={editUser.ownerPhone}
                onChange={(e) => setEditUser({ ...editUser, ownerPhone: e.target.value })}
                placeholder="Owner's phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-maintenance">Monthly Maintenance (₹)</Label>
              <Input
                id="edit-maintenance"
                type="number"
                value={editUser.monthlyMaintenance}
                onChange={(e) => setEditUser({ ...editUser, monthlyMaintenance: e.target.value })}
                placeholder="e.g., 3500"
              />
            </div>

          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user <strong>{userToDelete?.name}</strong> ({userToDelete?.email}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TenantManagement;