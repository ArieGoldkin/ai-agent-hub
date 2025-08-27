/**
 * Detection utilities for project and Claude Desktop
 */

import { existsSync } from "fs";
import { getClaudeDesktopConfigPath } from "../../lib/paths.js";

export function isInProject(): boolean {
  return existsSync("package.json") || existsSync(".git");
}

export function hasClaudeDesktop(): boolean {
  return existsSync(getClaudeDesktopConfigPath());
}