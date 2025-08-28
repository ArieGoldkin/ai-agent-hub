/**
 * Doctor Command - Health check for installation
 */

import { validateSetup, displayResults } from "../../lib/validate-setup.js";

/**
 * Run health check
 */
export async function runDoctorCommand(): Promise<void> {
  console.log("🏥 AI Agent Hub Doctor");
  console.log("━".repeat(40));
  
  try {
    const results = await validateSetup();
    displayResults(results);
  } catch (error) {
    console.error("❌ Health check failed:", error);
  }
}