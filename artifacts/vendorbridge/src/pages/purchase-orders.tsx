import { useState } from "react";
import {
  useListPurchaseOrders, getListPurchaseOrdersQueryKey,
  useUpdatePurchaseOrder
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Truck, CheckCircle2, Clock, FileCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type LineItem = { description: string; quantity: number; unitPrice: number; totalPrice: number };

function statusVariant(status: string) {
  if (status === "delivered") return "default";
  if (status === "approved") return "secondary";
  if (status === "cancelled") return "destructive";
  return "outline";
}

function statusIcon(status: string) {
  if (status === "delivered") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "approved") return <FileCheck className="w-4 h-4 text-primary" />;
  if (status === "in_transit") return <Truck className="w-4 h-4 text-amber-500" />;
  return <Clock className="w-4 h-4 text-muted-foreground" />;
}

export default function PurchaseOrders() {
  const { data: orders, isLoading } = useListPurchaseOrders({ query: { queryKey: getListPurchaseOrdersQueryKey() } });
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const updatePO = useUpdatePurchaseOrder();
  const { toast } = useToast();

  const handleMarkDelivered = (id: number) => {
    updatePO.mutate(
      { id, data: { status: "delivered", deliveredAt: new Date().toISOString() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
          toast({ title: "PO marked as delivered" });
        },
      }
    );
  };

  const filtered = orders?.filter((o) =>
    o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    o.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
              data-testid="input-search-orders"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No purchase orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered?.map((order) => {
                      const items = (order.items as LineItem[]) ?? [];
                      return (
                        <TableRow key={order.id} data-testid={`row-po-${order.id}`}>
                          <TableCell className="font-mono font-medium">{order.poNumber}</TableCell>
                          <TableCell>{order.vendorName || "—"}</TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {items.length} line item{items.length !== 1 ? "s" : ""}
                            </div>
                            {items.slice(0, 2).map((item, i) => (
                              <div key={i} className="text-xs text-muted-foreground">{item.description}</div>
                            ))}
                          </TableCell>
                          <TableCell className="font-mono font-semibold">${order.totalAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                              {order.deliveryDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {statusIcon(order.status)}
                              <Badge variant={statusVariant(order.status)} className="capitalize">
                                {order.status.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {order.status === "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                data-testid={`button-deliver-${order.id}`}
                                onClick={() => handleMarkDelivered(order.id)}
                                disabled={updatePO.isPending}
                              >
                                Mark Delivered
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
