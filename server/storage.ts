import type { History, InsertHistory, Settings, InsertSettings } from "@shared/schema";

export interface IStorage {
  // History operations
  addCalculation(calculation: InsertHistory): Promise<History>;
  getCalculationHistory(): Promise<History[]>;

  // Settings operations
  getSettings(id: number): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(id: number, settings: Partial<InsertSettings>): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private history: History[] = [];
  private settings: Map<number, Settings> = new Map();
  private currentSettingsId = 1;

  async addCalculation(calculation: InsertHistory): Promise<History> {
    const newHistory: History = {
      ...calculation,
      timestamp: new Date()
    };
    this.history.push(newHistory);
    return newHistory;
  }

  async getCalculationHistory(): Promise<History[]> {
    return [...this.history];
  }

  async getSettings(id: number): Promise<Settings | undefined> {
    return this.settings.get(id);
  }

  async createSettings(settings: InsertSettings): Promise<Settings> {
    const id = this.currentSettingsId++;
    const newSettings: Settings = { ...settings };
    this.settings.set(id, newSettings);
    return newSettings;
  }

  async updateSettings(id: number, settings: Partial<InsertSettings>): Promise<Settings> {
    const existing = this.settings.get(id);
    if (!existing) {
      throw new Error("Settings not found");
    }

    const updated = { ...existing, ...settings };
    this.settings.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();