/**
 * Session Archive Functions
 * 
 * Handles archiving and retrieving session history
 */

import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

/**
 * Archive a session for history
 */
export async function archiveSession(context: any): Promise<void> {
  const archivePath = join(process.cwd(), ".claude", "session-archive.json");
  const dir = dirname(archivePath);
  
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  
  let archives = [];
  if (existsSync(archivePath)) {
    const content = await readFile(archivePath, "utf-8");
    archives = JSON.parse(content) || [];
  }
  
  // Convert Map to object for serialization
  const serialized = {
    ...context,
    agents: Object.fromEntries(context.agents),
    archivedAt: new Date().toISOString()
  };
  
  archives.push(serialized);
  
  // Keep only last 10 sessions
  if (archives.length > 10) {
    archives = archives.slice(-10);
  }
  
  await writeFile(archivePath, JSON.stringify(archives, null, 2));
}

/**
 * Get archived sessions
 */
export async function getArchivedSessions(): Promise<any[]> {
  const archivePath = join(process.cwd(), ".claude", "session-archive.json");
  
  if (!existsSync(archivePath)) {
    return [];
  }
  
  try {
    const content = await readFile(archivePath, "utf-8");
    return JSON.parse(content) || [];
  } catch (error) {
    console.error("Failed to load archived sessions:", error);
    return [];
  }
}