import { useState } from "react";
import {
  useListInvoices, getListInvoicesQueryKey,
  useUpdateInvoice
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function statusBadge(status: string, dueDate: string) {
  if (status === "paid") return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Paid</Badge>;
  const isOverdue = new Date(dueDate) < new Date();
  if (status === "unpaid" && isOverdue) return <Badge variant="destructive">Overdue</Badge>;
  return <Badge variant="secondary">Unpaid</Badge>;
}

function statusIcon(status: string, dueDate: string) {
  if (status === "paid") return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  const isOverdue = new Date(dueDate) < new Date();
  if (isOverdue) return <AlertCircle className="w-4 h-4 text-destructive" />;
  return <Clock className="w-4 h-4 text-amber-500" />;
}

export default function Invoices() {
  const { data: invoices, isLoading } = useListInvoices({ query: { queryKey: getListInvoicesQueryKey() } });
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const updateInvoice = useUpdateInvoice();
  const { toast } = useToast();

  const handleMarkPaid = (id: number) => {
    updateInvoice.mutate(
      { id, data: { status: "paid", paidAt: new Date().toISOString() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListInvoicesQueryKey() });
          toast({ title: "Invoice marked as paid" });
        },
      }
    );
  };

  const filtered = invoices?.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    inv.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnpaid = invoices?.filter((i) => i.status === "unpaid").reduce((s, i) => s + i.amount, 0) ?? 0;
  const totalPaid = invoices?.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">Total Outstanding</p>
              <p className="text-2xl font-bold text-amber-600">${totalUnpaid.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">Paid This Cycle</p>
              <p className="text-2xl font-bold text-emerald-600">${totalPaid.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-destructive">
                {invoices?.filter((i) => i.status === "unpaid" && new Date(i.dueDate) < new Date()).length ?? 0}
              </p>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
              data-testid="input-search-invoices"
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
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>PO</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered?.map((inv) => (
                      <TableRow key={inv.id} data-testid={`row-invoice-${inv.id}`}>
                        <TableCell className="font-mono font-medium">{inv.invoiceNumber}</TableCell>
                        <TableCell>{inv.vendorName || "—"}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{inv.poNumber || "—"}</TableCell>
                        <TableCell className="font-mono font-semibold">${inv.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">{inv.issuedAt.slice(0, 10)}</TableCell>
                        <TableCell className="text-sm">{inv.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {statusIcon(inv.status, inv.dueDate)}
                            {statusBadge(inv.status, inv.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {inv.status === "unpaid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                              data-testid={`button-pay-${inv.id}`}
                              onClick={() => handleMarkPaid(inv.id)}
                              disabled={updateInvoice.isPending}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
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
