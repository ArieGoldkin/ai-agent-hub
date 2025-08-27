/**
 * Environment Handler
 * 
 * Safe handling of environment variables and .env files.
 */

import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

/**
 * Safe environment file handling
 */
export async function safeHandleEnvFile(envExamplePath: string): Promise<void> {
  const envPath = ".env";
  
  // Check if .env already exists
  if (existsSync(envPath)) {
    console.log("📄 Found existing .env file");
    
    // Read existing .env content
    const existingContent = await readFile(envPath, "utf-8");
    
    // Read .env.example to check for missing keys
    if (existsSync(envExamplePath)) {
      const exampleContent = await readFile(envExamplePath, "utf-8");
      
      // Parse both files to find missing keys
      const existingKeys = parseEnvKeys(existingContent);
      const exampleKeys = parseEnvKeys(exampleContent);
      const missingKeys = exampleKeys.filter(key => !existingKeys.includes(key));
      
      if (missingKeys.length > 0) {
        console.log("📝 Missing environment variables detected:");
        missingKeys.forEach(key => console.log(`   - ${key}`));
        console.log("\n💡 Add these to your .env file:");
        
        // Extract the missing lines from .env.example
        const exampleLines = exampleContent.split('\n');
        const missingLines: string[] = [];
        
        for (const line of exampleLines) {
          const trimmed = line.trim();
          // Include comments and missing keys
          if (trimmed.startsWith('#') || missingKeys.some(key => line.startsWith(key + '='))) {
            missingLines.push(line);
          }
        }
        
        if (missingLines.length > 0) {
          console.log("\n" + missingLines.join('\n'));
        }
      } else {
        console.log("✅ .env file has all required variables");
      }
    }
  } else {
    // No .env exists, safe to create from example
    if (existsSync(envExamplePath)) {
      const exampleContent = await readFile(envExamplePath, "utf-8");
      await writeFile(envPath, exampleContent);
      console.log("✅ Created .env file from template");
      console.log("⚠️  Important: Update the following in your .env file:");
      console.log("   - GITHUB_TOKEN - Your GitHub personal access token");
      console.log("   - SUPABASE_ACCESS_TOKEN - Your Supabase access token");
      console.log("   - Also update YOUR_PROJECT_REF_HERE in .mcp.json");
    }
  }
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