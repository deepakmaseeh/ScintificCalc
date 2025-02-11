import { z } from "zod";

export type Operation = {
  type: 'number' | 'operator' | 'scientific' | 'memory';
  value: string;
};

export type History = {
  expression: string;
  result: string;
  timestamp: Date;
};

export type Settings = {
  degreeMode: boolean;
  memoryValue?: string;
  lastOperation?: string;
};

export const insertHistorySchema = z.object({
  expression: z.string(),
  result: z.string(),
  timestamp: z.coerce.date()
});

export const insertSettingsSchema = z.object({
  degreeMode: z.boolean().default(false),
  memoryValue: z.string().optional(),
  lastOperation: z.string().optional()
});

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;