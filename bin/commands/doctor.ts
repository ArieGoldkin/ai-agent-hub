/**
 * Doctor Command - Health check and validation
 */

import { validateCompleteSetup, displayValidationResults } from "../../lib/setup-validator/index.js";

export async function runDoctorCommand(): Promise<void> {
  console.log("🔍 Running AI Agent Hub diagnostic...\n");
  
  try {
    const validation = await validateCompleteSetup();
    displayValidationResults(validation);
    
    if (!validation.isHealthy) {
      console.log("\n🔧 Quick Fix Commands:");
      console.log("   ai-agent-hub --both    # Complete setup");
      console.log("   ai-agent-hub --help    # Show all commands");
      console.log("   ai-agent-hub doctor    # Run this check again");
      
      // Exit with error code if not healthy
      process.exit(1);
    } else {
      console.log("\n🎉 System is ready for agent orchestration!");
      console.log("   ai-agent-hub session start    # Begin your first session");
    }
  } catch (error) {
    console.error("❌ Failed to run diagnostic:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}