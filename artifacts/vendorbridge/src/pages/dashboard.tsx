import {
  useGetDashboardSummary, getGetDashboardSummaryQueryKey,
  useGetSpendByMonth, getGetSpendByMonthQueryKey,
  useGetSpendByCategory, getGetSpendByCategoryQueryKey,
  useGetRecentActivity, getGetRecentActivityQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Users, FileText, CheckSquare, ShoppingCart, Receipt, DollarSign,
  Percent, TrendingUp, Building2, Package, BarChart3, Sparkles,
  AlertTriangle, Lightbulb, Star, ArrowRight, ShieldAlert
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const CATEGORY_COLORS = ["#0ea5e9", "#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#f43f5e"];

const WORKFLOW_STEPS = [
  { label: "Vendor Registration", icon: Building2, status: "done", color: "bg-emerald-500", count: 7 },
  { label: "RFQ Creation", icon: FileText, status: "done", color: "bg-blue-500", count: 5 },
  { label: "Quotation Submission", icon: Package, status: "done", color: "bg-indigo-500", count: 6 },
  { label: "Quote Comparison", icon: TrendingUp, status: "active", color: "bg-violet-500", count: 4 },
  { label: "Approval Process", icon: CheckSquare, status: "active", color: "bg-amber-500", count: 3 },
  { label: "Purchase Order", icon: ShoppingCart, status: "done", color: "bg-orange-500", count: 4 },
  { label: "Invoice Tracking", icon: Receipt, status: "active", color: "bg-rose-500", count: 5 },
  { label: "Reports", icon: BarChart3, status: "done", color: "bg-teal-500", count: null },
];

const AI_INSIGHTS = [
  {
    type: "recommendation",
    icon: Star,
    iconColor: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    title: "Best Vendor: TechCore Solutions",
    desc: "Based on 42 orders, TechCore ranks #1 with a 98% on-time rate and 4.8 quality score. Recommend as preferred supplier for Q3 hardware.",
  },
  {
    type: "saving",
    icon: Lightbulb,
    iconColor: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    title: "Cost Saving Opportunity: $24K",
    desc: "Consolidating Office Supplies orders from 2 vendors into GlobalOffice Co. could save ~$24,000 annually through volume discounts.",
  },
  {
    type: "risk",
    icon: AlertTriangle,
    iconColor: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    title: "Risk Alert: INV-0005 Overdue",
    desc: "ProServices Group invoice ($58,800) is 5 days overdue. Payment delay risk may impact active PO fulfillment and vendor relations.",
  },
  {
    type: "performance",
    icon: ShieldAlert,
    iconColor: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    title: "Vendor Score Drop: BuildParts Mfg",
    desc: "BuildParts Manufacturing performance score dropped from 4.2 to 3.9 over 30 days. Consider alternate sourcing for manufacturing needs.",
  },
];

function activityStatusBadge(status: string) {
  if (status === "success") return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">Success</Badge>;
  if (status === "warning") return <Badge variant="secondary" className="text-xs">Pending</Badge>;
  return <Badge variant="outline" className="text-xs capitalize">{status}</Badge>;
}

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  const { data: spendByMonth, isLoading: spendLoading } = useGetSpendByMonth({ query: { queryKey: getGetSpendByMonthQueryKey() } });
  const { data: spendByCategory, isLoading: catLoading } = useGetSpendByCategory({ query: { queryKey: getGetSpendByCategoryQueryKey() } });
  const { data: recentActivity, isLoading: activityLoading } = useGetRecentActivity({ query: { queryKey: getGetRecentActivityQueryKey() } });

  const kpis = summary ? [
    { title: "Total Vendors", value: summary.totalVendors, icon: Users, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/20" },
    { title: "Active RFQs", value: summary.activeRfqs, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { title: "Pending Approvals", value: summary.pendingApprovals, icon: CheckSquare, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { title: "Open POs", value: summary.openPurchaseOrders, icon: ShoppingCart, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "Unpaid Invoices", value: summary.unpaidInvoices, icon: Receipt, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { title: "MTD Spend", value: `$${summary.totalSpendMtd.toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { title: "Savings Rate", value: `${summary.savingsPercent}%`, icon: Percent, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "On-time Delivery", value: `${summary.onTimeDeliveryRate}%`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ] : [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
          : kpis.map((kpi, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow" data-testid={`card-kpi-${i}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground">{kpi.title}</p>
                  <div className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Procurement Workflow */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            Procurement Workflow Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={i} className="flex items-center shrink-0">
                <div className="flex flex-col items-center gap-2 w-[90px]">
                  <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center shadow-sm relative`}>
                    <step.icon className="w-4 h-4 text-white" />
                    {step.status === "active" && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-background animate-pulse" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-foreground leading-tight">{step.label}</p>
                    {step.count !== null && (
                      <p className="text-[10px] text-muted-foreground">{step.count} active</p>
                    )}
                  </div>
                  <Badge
                    variant={step.status === "active" ? "secondary" : "outline"}
                    className={`text-[9px] px-1.5 py-0 ${step.status === "done" ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" : "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"}`}
                  >
                    {step.status === "active" ? "In Progress" : "Active"}
                  </Badge>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div className="w-6 h-px bg-border mx-1 mb-8 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Monthly Spend vs Budget</CardTitle>
          </CardHeader>
          <CardContent>
            {spendLoading ? <Skeleton className="h-52 w-full" /> : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={spendByMonth} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
                  />
                  <Bar dataKey="budget" fill="hsl(var(--muted))" radius={[3, 3, 0, 0]} name="Budget" maxBarSize={22} />
                  <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name="Spend" maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Spend by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {catLoading ? <Skeleton className="h-52 w-full" /> : (
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={spendByCategory} dataKey="amount" nameKey="category" cx="50%" cy="45%" outerRadius={68} innerRadius={32}>
                    {spendByCategory?.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card className="border-violet-200 dark:border-violet-800/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              AI Procurement Insights
              <Badge className="ml-auto text-[10px] bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-100">Beta</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} className={`flex gap-3 rounded-xl p-3 ${insight.bg}`}>
                <div className="shrink-0 mt-0.5">
                  <insight.icon className={`w-4 h-4 ${insight.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5">{insight.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : recentActivity?.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No recent activity.</p>
            ) : (
              <div className="space-y-0 divide-y divide-border">
                {recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3" data-testid={`activity-item-${activity.id}`}>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{activity.description}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="shrink-0 ml-3">{activityStatusBadge(activity.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
