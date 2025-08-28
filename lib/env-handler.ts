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

/**
 * Validate environment configuration and provide guidance
 */
export async function validateEnvironmentSetup(): Promise<{
  isValid: boolean;
  warnings: string[];
  required: string[];
  optional: string[];
}> {
  const warnings: string[] = [];
  const required: string[] = [];
  const optional: string[] = [];
  
  // Check for .env file
  if (!existsSync(".env")) {
    warnings.push("No .env file found - some MCP servers may not work");
    return { isValid: false, warnings, required: ['Create .env file'], optional };
  }
  
  // Read .env file
  const envContent = await readFile(".env", "utf-8");
  const envVars = parseEnvVars(envContent);
  
  // Check critical environment variables
  const criticalVars = {
    'GITHUB_TOKEN': 'GitHub integration (required for GitHub MCP server)',
    'SUPABASE_ACCESS_TOKEN': 'Supabase integration (required for Supabase MCP server)'
  };
  
  const optionalVars = {
    'POSTGRES_CONNECTION_STRING': 'PostgreSQL database access',
    'BRAVE_API_KEY': 'Brave search capabilities'
  };
  
  // Check critical vars
  for (const [varName, description] of Object.entries(criticalVars)) {
    const value = envVars[varName];
    if (!value || value.includes('your_') || value.includes('_here')) {
      required.push(`${varName} - ${description}`);
    }
  }
  
  // Check optional vars
  for (const [varName, description] of Object.entries(optionalVars)) {
    const value = envVars[varName];
    if (!value || value.includes('your_') || value.includes('_here')) {
      optional.push(`${varName} - ${description}`);
    }
  }
  
  // Generate warnings
  if (required.length > 0) {
    warnings.push(`${required.length} critical environment variables need configuration`);
  }
  
  if (optional.length > 0) {
    warnings.push(`${optional.length} optional environment variables could be configured`);
  }
  
  return {
    isValid: required.length === 0,
    warnings,
    required,
    optional
  };
}

/**
 * Parse environment variables from content into key-value pairs
 */
function parseEnvVars(content: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([A-Z_]+[A-Z0-9_]*)=(.*)$/);
      if (match) {
        vars[match[1]] = match[2];
      }
    }
  }
  
  return vars;
}

/**
 * Display environment setup guidance
 */
export async function displayEnvironmentGuidance(): Promise<void> {
  const validation = await validateEnvironmentSetup();
  
  if (validation.isValid) {
    console.log("✅ Environment configuration complete");
    return;
  }
  
  console.log("\n🔧 Environment Configuration Needed");
  console.log("=====================================");
  
  if (validation.required.length > 0) {
    console.log("\n🚨 Required (MCP servers won't work without these):");
    validation.required.forEach(item => {
      console.log(`   ❌ ${item}`);
    });
  }
  
  if (validation.optional.length > 0) {
    console.log("\n💡 Optional (enhanced functionality):");
    validation.optional.forEach(item => {
      console.log(`   ⚪ ${item}`);
    });
  }
  
  console.log("\n📝 Next Steps:");
  console.log("   1. Edit your .env file with your API keys");
  console.log("   2. Update YOUR_PROJECT_REF_HERE in .mcp.json (for Supabase)");
  console.log("   3. Run: ai-agent-hub doctor (to validate setup)");
  console.log("   4. Start your first session: ai-agent-hub session start");
}