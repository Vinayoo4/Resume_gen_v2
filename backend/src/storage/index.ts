import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../../data');

export class JsonStorage<T extends { id?: string, userId?: string }> {
  private filepath: string;
  private isWriting = false;

  constructor(collection: string) {
    // When run via tsx in dev: __dirname is /app/backend/src/storage
    // When run via node in dist: __dirname is /app/dist/backend/src/storage
    // We want to point to /app/data.
    const rootDir = process.cwd().endsWith('backend') ? path.resolve(process.cwd(), '../data') : path.resolve(process.cwd(), 'data');
    this.filepath = path.join(rootDir, `${collection}.json`);
  }

  private async ensureFile(): Promise<void> {
    try {
      await fs.access(this.filepath);
    } catch {
      await fs.mkdir(path.dirname(this.filepath), { recursive: true });
      await fs.writeFile(this.filepath, '[]', 'utf-8');
    }
  }

  // Simple mutex lock to prevent concurrent write collisions
  private async acquireLock(): Promise<void> {
    while (this.isWriting) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.isWriting = true;
  }

  private releaseLock(): void {
    this.isWriting = false;
  }

  async readAll(): Promise<T[]> {
    await this.ensureFile();
    try {
      const data = await fs.readFile(this.filepath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  async writeAll(data: T[]): Promise<void> {
    await this.ensureFile();
    await this.acquireLock();
    try {
      const tempFile = `${this.filepath}.tmp`;
      await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      await fs.rename(tempFile, this.filepath);
    } finally {
      this.releaseLock();
    }
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
    await this.acquireLock();
    try {
      const all = await this.readAll();
      const index = all.findIndex(item => item.id === id || item.userId === id);
      if (index === -1) {
        this.releaseLock();
        return undefined;
      }

      all[index] = { ...all[index], ...updates };
      const tempFile = `${this.filepath}.tmp`;
      await fs.writeFile(tempFile, JSON.stringify(all, null, 2), 'utf-8');
      await fs.rename(tempFile, this.filepath);
      this.releaseLock();
      return all[index];
    } catch (e) {
      this.releaseLock();
      throw e;
    }
  }
}
