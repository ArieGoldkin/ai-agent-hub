/**
 * Environment Handler
 * 
 * Safe handling of environment variables and .env files
 */

import { readTextFile, writeTextFile, fileExists } from "./file-ops.js";
import { join } from "path";

/**
 * Get the package root to find .env.example
 */
async function findEnvExamplePath(startDir: string): Promise<string | null> {
  // Try multiple possible locations
  const possiblePaths = [
    join(startDir, ".env.example"),
    join(startDir, "..", ".env.example"),
    join(startDir, "../..", ".env.example"),
    join(startDir, "../../..", ".env.example"),
  ];
  
  for (const path of possiblePaths) {
    if (fileExists(path)) {
      return path;
    }
  }
  
  return null;
}

/**
 * Parse environment variable keys from content
 */
export function parseEnvKeys(content: string): string[] {
  const keys: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip comments and empty lines
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([A-Z_]+[A-Z0-9_]*)=/);
      if (match) {
        keys.push(match[1]);
      }
    }
  }
  
  return keys;
}

/**
 * Extract lines for specific keys from env content
 */
function extractEnvLines(content: string, keys: string[]): string[] {
  const lines = content.split('\n');
  const result: string[] = [];
  let includeNext = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Include comment lines that precede our target keys
    if (trimmed.startsWith('#')) {
      includeNext = true;
      continue;
    }
    
    // Check if this line contains one of our keys
    const hasKey = keys.some(key => line.startsWith(key + '='));
    
    if (hasKey) {
      // Include the preceding comment if we had one
      if (includeNext && result.length > 0) {
        const lastIndex = result.length - 1;
        if (!result[lastIndex].startsWith('#')) {
          result.push('');
        }
      }
      result.push(line);
      includeNext = false;
    } else if (!trimmed) {
      includeNext = false;
    }
  }
  
  return result;
}

/**
 * Safe environment file handling
 */
export async function safeHandleEnvFile(__dirname: string): Promise<void> {
  const envPath = ".env";
  
  // Find .env.example
  const envExamplePath = await findEnvExamplePath(__dirname);
  
  if (!envExamplePath) {
    // Fallback to basic template if no .env.example found
    if (!fileExists(envPath)) {
      const basicTemplate = `# Environment Configuration
# Add your API keys here

# GitHub Integration
# GITHUB_TOKEN=your_github_token_here

# Supabase Integration  
# SUPABASE_ACCESS_TOKEN=your_supabase_token_here

# Brave Search (optional)
# BRAVE_API_KEY=your_brave_api_key_here
`;
      await writeTextFile(envPath, basicTemplate);
      console.log("✅ Created basic .env file");
    }
    return;
  }
  
  // Check if .env already exists
  if (fileExists(envPath)) {
    console.log("📄 Found existing .env file");
    
    // Read both files
    const existingContent = await readTextFile(envPath);
    const exampleContent = await readTextFile(envExamplePath);
    
    if (!existingContent || !exampleContent) {
      return;
    }
    
    // Parse both files to find missing keys
    const existingKeys = parseEnvKeys(existingContent);
    const exampleKeys = parseEnvKeys(exampleContent);
    const missingKeys = exampleKeys.filter(key => !existingKeys.includes(key));
    
    if (missingKeys.length > 0) {
      console.log("📝 Missing environment variables detected:");
      missingKeys.forEach(key => console.log(`   - ${key}`));
      
      // Extract the missing lines from .env.example
      const missingLines = extractEnvLines(exampleContent, missingKeys);
      
      if (missingLines.length > 0) {
        console.log("\n💡 Add these to your .env file:");
        console.log(missingLines.join('\n'));
      }
    } else {
      console.log("✅ .env file has all required variables");
    }
  } else {
    // No .env exists, create from example
    const exampleContent = await readTextFile(envExamplePath);
    if (exampleContent) {
      await writeTextFile(envPath, exampleContent);
      console.log("✅ Created .env file from template");
      console.log("⚠️  Important: Update the following in your .env file:");
      console.log("   - GITHUB_TOKEN - Your GitHub personal access token");
      console.log("   - SUPABASE_ACCESS_TOKEN - Your Supabase access token");
      console.log("   - Other API keys as needed");
    }
  }
}

/**
 * Check if required environment variables are set
 */
export function checkRequiredEnvVars(): { missing: string[]; optional: string[] } {
  const required = ['GITHUB_TOKEN', 'SUPABASE_ACCESS_TOKEN'];
  const optional = ['BRAVE_API_KEY', 'POSTGRES_CONNECTION_STRING', 'OPENAI_API_KEY'];
  
  const missing = required.filter(key => !process.env[key]);
  const optionalMissing = optional.filter(key => !process.env[key]);
  
  return {
    missing,
    optional: optionalMissing
  };
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback;
}