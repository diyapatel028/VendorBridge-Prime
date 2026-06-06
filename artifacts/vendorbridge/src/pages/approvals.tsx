import {
  useListApprovals, getListApprovalsQueryKey,
  useApproveRequest, useRejectRequest
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function priorityVariant(priority: string) {
  if (priority === "high" || priority === "urgent") return "destructive";
  if (priority === "medium") return "secondary";
  return "outline";
}

function statusBadge(status: string) {
  if (status === "approved") return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Approved</Badge>;
  if (status === "rejected") return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

export default function Approvals() {
  const { data: approvals, isLoading } = useListApprovals({ query: { queryKey: getListApprovalsQueryKey() } });
  const queryClient = useQueryClient();
  const approveRequest = useApproveRequest();
  const rejectRequest = useRejectRequest();
  const { toast } = useToast();

  const handleApprove = (id: number) => {
    approveRequest.mutate(
      { id, data: { approverName: "Current User", notes: "" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListApprovalsQueryKey() });
          toast({ title: "Request approved", description: "The request has been approved." });
        },
      }
    );
  };

  const handleReject = (id: number) => {
    rejectRequest.mutate(
      { id, data: { approverName: "Current User", notes: "Rejected by reviewer" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListApprovalsQueryKey() });
          toast({ title: "Request rejected", description: "The request has been rejected." });
        },
      }
    );
  };

  const pending = approvals?.filter((a) => a.status === "pending") ?? [];
  const resolved = approvals?.filter((a) => a.status !== "pending") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
        {!isLoading && (
          <Badge variant="secondary" className="text-sm px-3">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {pending.length} pending
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pending Review</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pending.map((a) => (
                        <TableRow key={a.id} data-testid={`row-approval-${a.id}`}>
                          <TableCell>
                            <div className="font-medium">{a.referenceTitle}</div>
                            {a.notes && <div className="text-sm text-muted-foreground">{a.notes}</div>}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{a.type}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{a.requestedBy}</TableCell>
                          <TableCell className="font-mono font-medium">${a.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {(a.priority === "high" || a.priority === "urgent") && (
                                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                              )}
                              <Badge variant={priorityVariant(a.priority)} className="capitalize text-xs">{a.priority}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                data-testid={`button-approve-${a.id}`}
                                onClick={() => handleApprove(a.id)}
                                disabled={approveRequest.isPending}
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                data-testid={`button-reject-${a.id}`}
                                onClick={() => handleReject(a.id)}
                                disabled={rejectRequest.isPending}
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {resolved.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resolved</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Resolved By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resolved.map((a) => (
                        <TableRow key={a.id} className="opacity-75" data-testid={`row-resolved-${a.id}`}>
                          <TableCell className="font-medium">{a.referenceTitle}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{a.type}</Badge></TableCell>
                          <TableCell className="text-sm">{a.requestedBy}</TableCell>
                          <TableCell className="font-mono">${a.amount.toLocaleString()}</TableCell>
                          <TableCell>{statusBadge(a.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{a.approvedBy ?? "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {approvals?.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">All caught up</p>
                <p className="text-sm">No approval requests at this time.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
