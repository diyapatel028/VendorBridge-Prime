import {
  useGetVendorPerformance, getGetVendorPerformanceQueryKey,
  useGetProcurementPipeline, getGetProcurementPipelineQueryKey,
  useGetSpendByMonth, getGetSpendByMonthQueryKey,
  useGetSpendByCategory, getGetSpendByCategoryQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const CATEGORY_COLORS = ["#0ea5e9", "#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#f43f5e"];

export default function Reports() {
  const { data: performance, isLoading: perfLoading } = useGetVendorPerformance({ query: { queryKey: getGetVendorPerformanceQueryKey() } });
  const { data: pipeline, isLoading: pipelineLoading } = useGetProcurementPipeline({ query: { queryKey: getGetProcurementPipelineQueryKey() } });
  const { data: spendByMonth, isLoading: spendLoading } = useGetSpendByMonth({ query: { queryKey: getGetSpendByMonthQueryKey() } });
  const { data: spendByCategory, isLoading: catLoading } = useGetSpendByCategory({ query: { queryKey: getGetSpendByCategoryQueryKey() } });

  const pipelineData = pipeline
    ? [
        { name: "Draft RFQs", value: pipeline.draftRfqs },
        { name: "Active RFQs", value: pipeline.activeRfqs },
        { name: "Pending Quotes", value: pipeline.pendingQuotations },
        { name: "Pending Approvals", value: pipeline.pendingApprovals },
        { name: "Active POs", value: pipeline.activePOs },
        { name: "Pending Invoices", value: pipeline.pendingInvoices },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Spend vs Budget</CardTitle>
          </CardHeader>
          <CardContent>
            {spendLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={spendByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                  <Bar dataKey="budget" fill="hsl(var(--muted))" radius={[3, 3, 0, 0]} name="Budget" />
                  <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name="Spend" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Spend by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spend by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {catLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={spendByCategory}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ category, percentage }) => `${percentage.toFixed(0)}%`}
                    labelLine={false}
                  >
                    {spendByCategory?.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} />
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Procurement Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Procurement Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart layout="vertical" data={pipelineData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Vendor Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vendor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {perfLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>On-Time</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance?.map((p) => (
                    <TableRow key={p.vendorId} data-testid={`row-perf-${p.vendorId}`}>
                      <TableCell className="font-medium text-sm">{p.vendorName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.onTimeRate} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground">{p.onTimeRate.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.qualityScore} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground">{p.qualityScore.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.totalOrders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
