import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, approvalsTable } from "@workspace/db";
import {
  ApproveRequestBody,
  ApproveRequestParams,
  RejectRequestBody,
  RejectRequestParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/approvals", async (_req, res): Promise<void> => {
  const approvals = await db.select().from(approvalsTable).orderBy(approvalsTable.createdAt);
  res.json(approvals);
});

router.post("/approvals/:id/approve", async (req, res): Promise<void> => {
  const params = ApproveRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = ApproveRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [approval] = await db
    .update(approvalsTable)
    .set({
      status: "approved",
      approvedBy: parsed.data.approverName,
      notes: parsed.data.notes ?? null,
      resolvedAt: new Date().toISOString(),
    })
    .where(eq(approvalsTable.id, params.data.id))
    .returning();
  if (!approval) {
    res.status(404).json({ error: "Approval not found" });
    return;
  }
  res.json(approval);
});

router.post("/approvals/:id/reject", async (req, res): Promise<void> => {
  const params = RejectRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = RejectRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [approval] = await db
    .update(approvalsTable)
    .set({
      status: "rejected",
      approvedBy: parsed.data.approverName,
      notes: parsed.data.notes ?? null,
      resolvedAt: new Date().toISOString(),
    })
    .where(eq(approvalsTable.id, params.data.id))
    .returning();
  if (!approval) {
    res.status(404).json({ error: "Approval not found" });
    return;
  }
  res.json(approval);
});

export default router;
