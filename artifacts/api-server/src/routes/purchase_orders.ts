import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, purchaseOrdersTable } from "@workspace/db";
import {
  CreatePurchaseOrderBody,
  UpdatePurchaseOrderBody,
  GetPurchaseOrderParams,
  UpdatePurchaseOrderParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/purchase-orders", async (_req, res): Promise<void> => {
  const pos = await db.select().from(purchaseOrdersTable).orderBy(purchaseOrdersTable.createdAt);
  res.json(pos);
});

router.post("/purchase-orders", async (req, res): Promise<void> => {
  const parsed = CreatePurchaseOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const count = await db.select().from(purchaseOrdersTable);
  const poNumber = `PO-${String(count.length + 1).padStart(4, "0")}`;
  const totalAmount = Array.isArray(parsed.data.items)
    ? (parsed.data.items as Array<{ totalPrice: number }>).reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    : 0;

  const [po] = await db.insert(purchaseOrdersTable).values({
    ...parsed.data,
    poNumber,
    vendorName: "",
    totalAmount,
  }).returning();
  res.status(201).json(po);
});

router.get("/purchase-orders/:id", async (req, res): Promise<void> => {
  const params = GetPurchaseOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [po] = await db.select().from(purchaseOrdersTable).where(eq(purchaseOrdersTable.id, params.data.id));
  if (!po) {
    res.status(404).json({ error: "Purchase order not found" });
    return;
  }
  res.json(po);
});

router.patch("/purchase-orders/:id", async (req, res): Promise<void> => {
  const params = UpdatePurchaseOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePurchaseOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [po] = await db.update(purchaseOrdersTable).set(parsed.data).where(eq(purchaseOrdersTable.id, params.data.id)).returning();
  if (!po) {
    res.status(404).json({ error: "Purchase order not found" });
    return;
  }
  res.json(po);
});

export default router;
