/**
 * File Operations
 * 
 * Essential file I/O operations for configuration management
 */

import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { dirname } from "path";

/**
 * Load configuration from JSON file
 */
export async function loadConfig(path: string): Promise<unknown> {
  try {
    if (!existsSync(path)) {
      return null;
    }
    const content = await readFile(path, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to load config from ${path}:`, error);
    return null;
  }
}

/**
 * Save configuration to JSON file
 */
export async function saveConfig(path: string, config: unknown): Promise<void> {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await writeFile(path, JSON.stringify(config, null, 2));
}

/**
 * Check if file exists
 */
export function fileExists(path: string): boolean {
  return existsSync(path);
}

/**
 * Read text file content
 */
export async function readTextFile(path: string): Promise<string | null> {
  try {
    if (!existsSync(path)) {
      return null;
    }
    return await readFile(path, "utf-8");
  } catch (error) {
    console.error(`Failed to read file ${path}:`, error);
    return null;
  }
}

/**
 * Write text file content
 */
export async function writeTextFile(path: string, content: string): Promise<void> {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await writeFile(path, content);
}