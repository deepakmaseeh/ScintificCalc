import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHistorySchema, insertSettingsSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Calculator History Routes
  app.post("/api/history", async (req, res) => {
    try {
      const calculation = insertHistorySchema.parse(req.body);
      const history = await storage.addCalculation(calculation);
      res.json(history);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid calculation data" });
        return;
      }
      res.status(500).json({ message: "Failed to save calculation" });
    }
  });

  app.get("/api/history", async (_req, res) => {
    try {
      const history = await storage.getCalculationHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calculation history" });
    }
  });

  // Settings Routes
  app.post("/api/settings", async (req, res) => {
    try {
      const settings = insertSettingsSchema.parse(req.body);
      const savedSettings = await storage.createSettings(settings);
      res.json(savedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid settings data" });
        return;
      }
      res.status(500).json({ message: "Failed to save settings" });
    }
  });

  app.patch("/api/settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }

      const settings = await storage.updateSettings(id, req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  app.get("/api/settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }

      const settings = await storage.getSettings(id);
      if (!settings) {
        res.status(404).json({ message: "Settings not found" });
        return;
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}