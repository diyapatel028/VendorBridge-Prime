import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, quotationsTable, rfqsTable } from "@workspace/db";
import {
  CreateQuotationBody,
  UpdateQuotationBody,
  GetQuotationParams,
  UpdateQuotationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/quotations", async (_req, res): Promise<void> => {
  const quotations = await db.select().from(quotationsTable).orderBy(quotationsTable.createdAt);
  res.json(quotations);
});

router.post("/quotations", async (req, res): Promise<void> => {
  const parsed = CreateQuotationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [quotation] = await db.insert(quotationsTable).values({
    ...parsed.data,
    submittedAt: new Date().toISOString(),
  }).returning();

  // Increment quotation count on the RFQ
  await db
    .update(rfqsTable)
    .set({ quotationCount: (await db.select().from(rfqsTable).where(eq(rfqsTable.id, parsed.data.rfqId)))[0]?.quotationCount + 1 || 1 })
    .where(eq(rfqsTable.id, parsed.data.rfqId));

  res.status(201).json(quotation);
});

router.get("/quotations/:id", async (req, res): Promise<void> => {
  const params = GetQuotationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [quotation] = await db.select().from(quotationsTable).where(eq(quotationsTable.id, params.data.id));
  if (!quotation) {
    res.status(404).json({ error: "Quotation not found" });
    return;
  }
  res.json(quotation);
});

router.patch("/quotations/:id", async (req, res): Promise<void> => {
  const params = UpdateQuotationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateQuotationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [quotation] = await db.update(quotationsTable).set(parsed.data).where(eq(quotationsTable.id, params.data.id)).returning();
  if (!quotation) {
    res.status(404).json({ error: "Quotation not found" });
    return;
  }
  res.json(quotation);
});

export default router;
