import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, rfqsTable } from "@workspace/db";
import {
  CreateRfqBody,
  UpdateRfqBody,
  GetRfqParams,
  UpdateRfqParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/rfqs", async (_req, res): Promise<void> => {
  const rfqs = await db.select().from(rfqsTable).orderBy(rfqsTable.createdAt);
  res.json(rfqs);
});

router.post("/rfqs", async (req, res): Promise<void> => {
  const parsed = CreateRfqBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [rfq] = await db.insert(rfqsTable).values(parsed.data).returning();
  res.status(201).json(rfq);
});

router.get("/rfqs/:id", async (req, res): Promise<void> => {
  const params = GetRfqParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [rfq] = await db.select().from(rfqsTable).where(eq(rfqsTable.id, params.data.id));
  if (!rfq) {
    res.status(404).json({ error: "RFQ not found" });
    return;
  }
  res.json(rfq);
});

router.patch("/rfqs/:id", async (req, res): Promise<void> => {
  const params = UpdateRfqParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateRfqBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [rfq] = await db.update(rfqsTable).set(parsed.data).where(eq(rfqsTable.id, params.data.id)).returning();
  if (!rfq) {
    res.status(404).json({ error: "RFQ not found" });
    return;
  }
  res.json(rfq);
});

export default router;
