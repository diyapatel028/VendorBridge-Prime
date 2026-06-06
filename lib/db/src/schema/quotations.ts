import { pgTable, text, serial, timestamp, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quotationsTable = pgTable("quotations", {
  id: serial("id").primaryKey(),
  rfqId: integer("rfq_id").notNull(),
  rfqTitle: text("rfq_title").notNull().default(""),
  vendorId: integer("vendor_id").notNull(),
  vendorName: text("vendor_name").notNull(),
  unitPrice: real("unit_price").notNull(),
  totalPrice: real("total_price").notNull(),
  deliveryDays: integer("delivery_days").notNull(),
  paymentTerms: text("payment_terms").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  submittedAt: text("submitted_at").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuotationSchema = createInsertSchema(quotationsTable).omit({ id: true, createdAt: true });
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = typeof quotationsTable.$inferSelect;
