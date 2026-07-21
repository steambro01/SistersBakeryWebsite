import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, LogOut, Upload, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "./components/ui/alert-dialog";

const BUSINESS_NAME = "Sweet by Sophie";

interface Product {
  id: string;
  name: string;
  price: string;
  ingredients: string;
  photoUrl: string;
}

interface TimeSlot {
  id: string;
  date: string;
  window: string;
  type: "pickup" | "delivery";
  capacity: number;
  booked: number;
}

interface Order {
  id: string;
  items: { name: string; quantity: number; price: string }[];
  total: string;
  slot: string;
  status: "pending" | "paid" | "fulfilled";
  customerEmail: string;
  createdAt: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "product" | "slot";
    id: string;
  } | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    ingredients: "",
    photoUrl: "",
  });

  const [slotForm, setSlotForm] = useState({
    date: "",
    window: "",
    type: "pickup" as "pickup" | "delivery",
    capacity: "10",
  });

  const [filePreview, setFilePreview] = useState<string>("");

  // Cognito Login (Placeholder - replace with actual Cognito integration)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // TODO: Replace with actual Cognito authentication
    // For now, using simple email/password validation as placeholder
    if (authEmail === "admin@sistersbakery.com" && authPassword === "password") {
      setIsAuthenticated(true);
      loadMockData();
    } else {
      setLoginError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthEmail("");
    setAuthPassword("");
  };

  // Load mock data
  const loadMockData = () => {
    setProducts([
      {
        id: "1",
        name: "Chocolate Chip Cookies",
        price: "$3.50 each",
        ingredients: "Flour, butter, sugar, eggs, chocolate chips",
        photoUrl:
          "https://images.unsplash.com/photo-1557310717-d6bea9f36682?w=600&h=600&fit=crop&auto=format",
      },
      {
        id: "2",
        name: "Classic Birthday Cake",
        price: "$48.00",
        ingredients: "Vanilla cake, buttercream, sprinkles",
        photoUrl:
          "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=600&fit=crop&auto=format",
      },
    ]);

    setTimeSlots([
      {
        id: "1",
        date: "2025-08-01",
        window: "10:00 AM - 12:00 PM",
        type: "pickup",
        capacity: 15,
        booked: 8,
      },
      {
        id: "2",
        date: "2025-08-01",
        window: "2:00 PM - 4:00 PM",
        type: "delivery",
        capacity: 10,
        booked: 5,
      },
    ]);

    setOrders([
      {
        id: "ORD-001",
        items: [
          { name: "Chocolate Chip Cookies", quantity: 2, price: "$3.50" },
          { name: "Classic Birthday Cake", quantity: 1, price: "$48.00" },
        ],
        total: "$55.00",
        slot: "2025-08-01 10:00 AM",
        status: "paid",
        customerEmail: "customer@example.com",
        createdAt: "2025-07-25",
      },
    ]);
  };

  // Product Management
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...productForm,
                photoUrl: filePreview || productForm.photoUrl,
              }
            : p
        )
      );
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productForm,
        photoUrl: filePreview || productForm.photoUrl,
      };
      setProducts([...products, newProduct]);

      // TODO: Call Lambda API
      // await fetch('/api/products', { method: 'POST', body: JSON.stringify(newProduct) })
    }

    resetProductForm();
  };

  const resetProductForm = () => {
    setProductForm({ name: "", price: "", ingredients: "", photoUrl: "" });
    setFilePreview("");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      ingredients: product.ingredients,
      photoUrl: product.photoUrl,
    });
    setFilePreview(product.photoUrl);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    setDeleteConfirm(null);

    // TODO: Call Lambda API
    // await fetch(`/api/products/${id}`, { method: 'DELETE' })
  };

  // Time Slot Management
  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlot) {
      setTimeSlots(
        timeSlots.map((s) =>
          s.id === editingSlot.id
            ? {
                ...s,
                ...slotForm,
                capacity: parseInt(slotForm.capacity),
              }
            : s
        )
      );
      setEditingSlot(null);
    } else {
      const newSlot: TimeSlot = {
        id: Date.now().toString(),
        ...slotForm,
        capacity: parseInt(slotForm.capacity),
        booked: 0,
      };
      setTimeSlots([...timeSlots, newSlot]);

      // TODO: Call Lambda API
      // await fetch('/api/time-slots', { method: 'POST', body: JSON.stringify(newSlot) })
    }

    resetSlotForm();
  };

  const resetSlotForm = () => {
    setSlotForm({ date: "", window: "", type: "pickup", capacity: "10" });
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setSlotForm({
      date: slot.date,
      window: slot.window,
      type: slot.type,
      capacity: slot.capacity.toString(),
    });
  };

  const handleDeleteSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((s) => s.id !== id));
    setDeleteConfirm(null);

    // TODO: Call Lambda API
    // await fetch(`/api/time-slots/${id}`, { method: 'DELETE' })
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFilePreview(base64);
        // TODO: Upload to S3 and get URL, or store base64 in DynamoDB
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle
                className="text-center text-2xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Admin Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@sistersbakery.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    {loginError}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Login
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Demo credentials: admin@sistersbakery.com / password
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-semibold tracking-tight text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {BUSINESS_NAME} - Admin
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="slots">Time Slots</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        placeholder="e.g., Chocolate Chip Cookies"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({ ...productForm, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price</Label>
                      <Input
                        id="product-price"
                        placeholder="e.g., $3.50 each"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-ingredients">Ingredients</Label>
                    <Textarea
                      id="product-ingredients"
                      placeholder="List all ingredients..."
                      value={productForm.ingredients}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          ingredients: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-photo">Product Photo</Label>
                    <div className="flex gap-4">
                      <Input
                        id="product-photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload size={16} />
                      </Button>
                    </div>
                    {filePreview && (
                      <div className="relative mt-3 w-32 h-32">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFilePreview("")}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    {productForm.photoUrl && !filePreview && (
                      <p className="text-sm text-muted-foreground">
                        Current: {productForm.photoUrl.substring(0, 50)}...
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex items-center gap-2">
                      <Plus size={16} />
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                    {editingProduct && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(null);
                          resetProductForm();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Menu Items ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Ingredients</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground py-6"
                          >
                            No products yet. Add one to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                              {product.ingredients}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit2 size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: "product",
                                      id: product.id,
                                    })
                                  }
                                >
                                  <Trash2 size={16} className="text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Slots Tab */}
          <TabsContent value="slots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingSlot ? "Edit Time Slot" : "Add New Time Slot"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTimeSlot} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slot-date">Date</Label>
                      <Input
                        id="slot-date"
                        type="date"
                        value={slotForm.date}
                        onChange={(e) =>
                          setSlotForm({ ...slotForm, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slot-window">Time Window</Label>
                      <Input
                        id="slot-window"
                        placeholder="e.g., 10:00 AM - 12:00 PM"
                        value={slotForm.window}
                        onChange={(e) =>
                          setSlotForm({ ...slotForm, window: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slot-type">Type</Label>
                      <select
                        id="slot-type"
                        value={slotForm.type}
                        onChange={(e) =>
                          setSlotForm({
                            ...slotForm,
                            type: e.target.value as "pickup" | "delivery",
                          })
                        }
                        className="w-full px-3 py-2 rounded-md border border-border bg-background"
                      >
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slot-capacity">Capacity</Label>
                      <Input
                        id="slot-capacity"
                        type="number"
                        min="1"
                        value={slotForm.capacity}
                        onChange={(e) =>
                          setSlotForm({ ...slotForm, capacity: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex items-center gap-2">
                      <Plus size={16} />
                      {editingSlot ? "Update Slot" : "Add Slot"}
                    </Button>
                    {editingSlot && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingSlot(null);
                          resetSlotForm();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Time Slots Table */}
            <Card>
              <CardHeader>
                <CardTitle>Available Slots ({timeSlots.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time Window</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground py-6"
                          >
                            No time slots yet. Add one to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        timeSlots.map((slot) => (
                          <TableRow key={slot.id}>
                            <TableCell className="font-medium">
                              {new Date(slot.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{slot.window}</TableCell>
                            <TableCell className="capitalize">{slot.type}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-sm font-medium ${
                                  slot.booked >= slot.capacity
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-accent/10 text-accent"
                                }`}
                              >
                                {slot.booked}/{slot.capacity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditSlot(slot)}
                                >
                                  <Edit2 size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: "slot",
                                      id: slot.id,
                                    })
                                  }
                                >
                                  <Trash2 size={16} className="text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No orders yet.
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.customerEmail}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{order.total}</p>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                                order.status === "paid"
                                  ? "bg-accent/10 text-accent"
                                  : order.status === "fulfilled"
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-yellow-500/10 text-yellow-600"
                              }`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-border pt-2">
                          <p className="text-sm font-medium mb-1">Items:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name} ({item.price})
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex justify-between text-sm">
                          <p className="text-muted-foreground">
                            Slot: {order.slot}
                          </p>
                          <p className="text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteConfirm?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {deleteConfirm?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm?.type === "product") {
                  handleDeleteProduct(deleteConfirm.id);
                } else if (deleteConfirm?.type === "slot") {
                  handleDeleteSlot(deleteConfirm.id);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
