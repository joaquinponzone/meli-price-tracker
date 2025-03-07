import { promises as fs } from 'fs';
import path from 'path';
import type { LogEntry, LoggerService } from './types';

export class FileLogger implements LoggerService {
  private readonly filePath: string;
  private readonly logsDir: string;

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.filePath = path.join(this.logsDir, 'scraping.json');
  }

  private async ensureLogFile(): Promise<void> {
    try {
      // Create logs directory if it doesn't exist
      await fs.mkdir(this.logsDir, { recursive: true });
      
      // Check if file exists
      try {
        await fs.access(this.filePath);
      } catch {
        // File doesn't exist, create it with empty array
        await fs.writeFile(this.filePath, '[]', 'utf-8');
      }
    } catch (error) {
      console.error('Failed to ensure log file:', error);
    }
  }

  async log(entry: Omit<LogEntry, "timestamp">): Promise<void> {
    try {
      // Ensure file exists before trying to read it
      await this.ensureLogFile();

      // Read existing logs
      const content = await fs.readFile(this.filePath, 'utf-8');
      const logs: LogEntry[] = content ? JSON.parse(content) : [];

      // Add new log entry
      const newEntry: LogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
      };
      logs.push(newEntry);

      // Write back to file
      await fs.writeFile(
        this.filePath,
        JSON.stringify(logs, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  async getLogs(): Promise<LogEntry[]> {
    try {
      const content = await fs.readFile(
        path.join(process.cwd(), 'logs', 'scraping.json'), 
        'utf-8'
      );
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to read logs:', error);
      return [];
    }
  }
  
  async getLastSuccessfulLog(): Promise<LogEntry | null> {
    const logs = await this.getLogs();
    return logs.find(log => log.success) || null;
  }
} 