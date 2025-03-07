import type { ScrapedProduct } from "../scraper";

export interface LogEntry {
  timestamp: string;
  url: string;
  success: boolean;
  data?: ScrapedProduct;
  error?: string;
  ip?: string;
}

export interface LoggerService {
  log(entry: Omit<LogEntry, "timestamp">): Promise<void>;
} 