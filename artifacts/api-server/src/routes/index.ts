import { Router, type IRouter } from "express";
import healthRouter from "./health";
import vendorsRouter from "./vendors";
import rfqsRouter from "./rfqs";
import quotationsRouter from "./quotations";
import approvalsRouter from "./approvals";
import purchaseOrdersRouter from "./purchase_orders";
import invoicesRouter from "./invoices";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(vendorsRouter);
router.use(rfqsRouter);
router.use(quotationsRouter);
router.use(approvalsRouter);
router.use(purchaseOrdersRouter);
router.use(invoicesRouter);
router.use(dashboardRouter);

export default router;
