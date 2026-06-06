import { useState } from "react";
import {
  useListQuotations, getListQuotationsQueryKey,
  useUpdateQuotation
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function statusVariant(status: string) {
  if (status === "accepted") return "default";
  if (status === "rejected") return "destructive";
  return "secondary";
}

function statusIcon(status: string) {
  if (status === "accepted") return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  if (status === "rejected") return <XCircle className="w-4 h-4 text-destructive" />;
  return <Clock className="w-4 h-4 text-amber-500" />;
}

export default function Quotations() {
  const { data: quotations, isLoading } = useListQuotations({ query: { queryKey: getListQuotationsQueryKey() } });
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const updateQuotation = useUpdateQuotation();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    updateQuotation.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListQuotationsQueryKey() });
          toast({ title: `Quotation ${status}`, description: `Quotation has been ${status}.` });
        },
      }
    );
  };

  const filtered = quotations?.filter((q) =>
    q.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    (q.rfqTitle ?? "").toLowerCase().includes(search.toLowerCase()) ||
    q.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Quotations</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search quotations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
              data-testid="input-search-quotations"
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
                    <TableHead>Vendor</TableHead>
                    <TableHead>RFQ</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No quotations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered?.map((q) => (
                      <TableRow key={q.id} data-testid={`row-quotation-${q.id}`}>
                        <TableCell className="font-medium">{q.vendorName}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{q.rfqTitle}</TableCell>
                        <TableCell className="font-mono">${q.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="font-mono font-medium">${q.totalPrice.toLocaleString()}</TableCell>
                        <TableCell>{q.deliveryDays} days</TableCell>
                        <TableCell className="text-sm">{q.paymentTerms}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {statusIcon(q.status)}
                            <Badge variant={statusVariant(q.status)} className="capitalize">{q.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {q.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                data-testid={`button-accept-quotation-${q.id}`}
                                onClick={() => handleStatusChange(q.id, "accepted")}
                                disabled={updateQuotation.isPending}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                data-testid={`button-reject-quotation-${q.id}`}
                                onClick={() => handleStatusChange(q.id, "rejected")}
                                disabled={updateQuotation.isPending}
                              >
                                Reject
                              </Button>
                            </div>
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
