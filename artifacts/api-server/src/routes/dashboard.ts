import { Router, type IRouter } from "express";
import { db, vendorsTable, rfqsTable, approvalsTable, purchaseOrdersTable, invoicesTable, quotationsTable } from "@workspace/db";
import { count, sum, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [vendorCount] = await db.select({ count: count() }).from(vendorsTable);
  const [rfqCount] = await db.select({ count: count() }).from(rfqsTable).where(eq(rfqsTable.status, "active"));
  const [pendingApprovals] = await db.select({ count: count() }).from(approvalsTable).where(eq(approvalsTable.status, "pending"));
  const [openPOs] = await db.select({ count: count() }).from(purchaseOrdersTable).where(eq(purchaseOrdersTable.status, "approved"));
  const [unpaidInvoices] = await db.select({ count: count() }).from(invoicesTable).where(eq(invoicesTable.status, "unpaid"));
  const [spendResult] = await db.select({ total: sum(invoicesTable.amount) }).from(invoicesTable).where(eq(invoicesTable.status, "paid"));

  res.json({
    totalVendors: vendorCount?.count ?? 0,
    activeRfqs: rfqCount?.count ?? 0,
    pendingApprovals: pendingApprovals?.count ?? 0,
    openPurchaseOrders: openPOs?.count ?? 0,
    unpaidInvoices: unpaidInvoices?.count ?? 0,
    totalSpendMtd: Number(spendResult?.total ?? 0),
    savingsPercent: 8.4,
    onTimeDeliveryRate: 91.2,
  });
});

router.get("/dashboard/spend-by-month", async (_req, res): Promise<void> => {
  res.json([
    { month: "Jan", spend: 142000, budget: 160000 },
    { month: "Feb", spend: 138000, budget: 155000 },
    { month: "Mar", spend: 165000, budget: 170000 },
    { month: "Apr", spend: 152000, budget: 160000 },
    { month: "May", spend: 189000, budget: 185000 },
    { month: "Jun", spend: 174000, budget: 180000 },
    { month: "Jul", spend: 161000, budget: 175000 },
    { month: "Aug", spend: 193000, budget: 190000 },
    { month: "Sep", spend: 178000, budget: 185000 },
    { month: "Oct", spend: 205000, budget: 200000 },
    { month: "Nov", spend: 212000, budget: 210000 },
    { month: "Dec", spend: 198000, budget: 215000 },
  ]);
});

router.get("/dashboard/spend-by-category", async (_req, res): Promise<void> => {
  res.json([
    { category: "IT & Technology", amount: 487000, percentage: 28.5 },
    { category: "Office Supplies", amount: 215000, percentage: 12.6 },
    { category: "Professional Services", amount: 341000, percentage: 20.0 },
    { category: "Facilities", amount: 198000, percentage: 11.6 },
    { category: "Manufacturing", amount: 263000, percentage: 15.4 },
    { category: "Logistics", amount: 204000, percentage: 11.9 },
  ]);
});

router.get("/dashboard/recent-activity", async (_req, res): Promise<void> => {
  const recentVendors = await db.select().from(vendorsTable).orderBy(vendorsTable.createdAt).limit(3);
  const recentPOs = await db.select().from(purchaseOrdersTable).orderBy(purchaseOrdersTable.createdAt).limit(3);
  const recentInvoices = await db.select().from(invoicesTable).orderBy(invoicesTable.createdAt).limit(3);

  const activities = [
    ...recentVendors.map((v, i) => ({
      id: i + 1,
      type: "vendor",
      description: `New vendor "${v.name}" registered`,
      timestamp: v.createdAt.toISOString(),
      status: "success",
    })),
    ...recentPOs.map((po, i) => ({
      id: i + 10,
      type: "purchase_order",
      description: `Purchase order ${po.poNumber} created for ${po.vendorName}`,
      timestamp: po.createdAt.toISOString(),
      status: po.status === "approved" ? "success" : "pending",
    })),
    ...recentInvoices.map((inv, i) => ({
      id: i + 20,
      type: "invoice",
      description: `Invoice ${inv.invoiceNumber} from ${inv.vendorName}`,
      timestamp: inv.createdAt.toISOString(),
      status: inv.status === "paid" ? "success" : "warning",
    })),
  ];

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(activities.slice(0, 10));
});

router.get("/reports/vendor-performance", async (_req, res): Promise<void> => {
  const vendors = await db.select().from(vendorsTable).limit(10);
  const performance = vendors.map((v) => ({
    vendorId: v.id,
    vendorName: v.name,
    onTimeRate: Math.min(100, 70 + v.rating * 6 + Math.random() * 5),
    qualityScore: Math.min(100, 65 + v.rating * 7 + Math.random() * 5),
    totalOrders: v.totalOrders,
    totalSpend: v.totalSpend,
  }));
  res.json(performance);
});

router.get("/reports/procurement-pipeline", async (_req, res): Promise<void> => {
  const [draftRfqs] = await db.select({ count: count() }).from(rfqsTable).where(eq(rfqsTable.status, "draft"));
  const [activeRfqs] = await db.select({ count: count() }).from(rfqsTable).where(eq(rfqsTable.status, "active"));
  const [pendingQuotations] = await db.select({ count: count() }).from(quotationsTable).where(eq(quotationsTable.status, "pending"));
  const [pendingApprovals] = await db.select({ count: count() }).from(approvalsTable).where(eq(approvalsTable.status, "pending"));
  const [activePOs] = await db.select({ count: count() }).from(purchaseOrdersTable).where(eq(purchaseOrdersTable.status, "approved"));
  const [pendingInvoices] = await db.select({ count: count() }).from(invoicesTable).where(eq(invoicesTable.status, "unpaid"));

  res.json({
    draftRfqs: draftRfqs?.count ?? 0,
    activeRfqs: activeRfqs?.count ?? 0,
    pendingQuotations: pendingQuotations?.count ?? 0,
    pendingApprovals: pendingApprovals?.count ?? 0,
    activePOs: activePOs?.count ?? 0,
    pendingInvoices: pendingInvoices?.count ?? 0,
  });
});

export default router;
