import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../../data');

export class JsonStorage<T extends { id?: string, userId?: string }> {
  private filepath: string;

  constructor(collection: string) {
    this.filepath = path.join(DATA_DIR, `${collection}.json`);
  }

  private async ensureFile(): Promise<void> {
    try {
      await fs.access(this.filepath);
    } catch {
      await fs.mkdir(path.dirname(this.filepath), { recursive: true });
      await fs.writeFile(this.filepath, '[]', 'utf-8');
    }
  }

  private async acquireLock(): Promise<void> {
    // Basic in-memory lock placeholder to prevent multiple writes
  }

  async readAll(): Promise<T[]> {
    await this.ensureFile();
    const data = await fs.readFile(this.filepath, 'utf-8');
    return JSON.parse(data);
  }

  async writeAll(data: T[]): Promise<void> {
    await this.ensureFile();
    const tempFile = `${this.filepath}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempFile, this.filepath);
  }

  async findById(id: string): Promise<T | undefined> {
    const all = await this.readAll();
    return all.find(item => item.id === id);
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | undefined> {
    const all = await this.readAll();
    return all.find(predicate);
  }

  async insert(item: T): Promise<T> {
    const all = await this.readAll();
    all.push(item);
    await this.writeAll(all);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    const all = await this.readAll();
    const index = all.findIndex(item => item.id === id || item.userId === id);
    if (index === -1) return undefined;

    all[index] = { ...all[index], ...updates };
    await this.writeAll(all);
    return all[index];
  }
}
