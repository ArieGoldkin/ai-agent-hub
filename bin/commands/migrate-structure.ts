/**
 * Structure migration utility
 * Migrates existing installations to the new v3.5.9+ file structure
 */

import fs from "fs";
import path from "path";
import chalk from "chalk";

interface MigrationResult {
  success: boolean;
  moved: string[];
  errors: string[];
  skipped: string[];
}

/**
 * Migrate from old structure to new v3.5.9+ structure
 *
 * Changes:
 * - Move skills/ to .claude/skills/
 * - Move .claude/*.md (squad files) to .claude/instructions/
 */
export async function migrateFileStructure(): Promise<MigrationResult> {
  const moved: string[] = [];
  const errors: string[] = [];
  const skipped: string[] = [];

  console.log(chalk.cyan("\n🔄 Migrating to v3.5.9+ file structure...\n"));

  try {
    // Step 1: Migrate skills from root to .claude/skills/
    await migrateSkills(moved, errors, skipped);

    // Step 2: Migrate squad files to .claude/instructions/
    await migrateSquadFiles(moved, errors, skipped);

    // Print summary
    console.log(chalk.green("\n✅ Migration complete!\n"));

    if (moved.length > 0) {
      console.log(chalk.cyan("📦 Files moved:"));
      moved.forEach(file => console.log(chalk.gray(`   ✓ ${file}`)));
    }

    if (skipped.length > 0) {
      console.log(chalk.yellow("\n⏭️  Skipped (already migrated):"));
      skipped.forEach(file => console.log(chalk.gray(`   • ${file}`)));
    }

    if (errors.length > 0) {
      console.log(chalk.red("\n❌ Errors:"));
      errors.forEach(error => console.log(chalk.gray(`   ✗ ${error}`)));
    }

    console.log(chalk.cyan("\n📖 New structure:"));
    console.log(chalk.gray("   .claude/"));
    console.log(chalk.gray("   ├── agents/"));
    console.log(chalk.gray("   ├── instructions/  (includes squad rules)"));
    console.log(chalk.gray("   ├── skills/        ← moved from root"));
    console.log(chalk.gray("   ├── context/"));
    console.log(chalk.gray("   └── settings.local.json"));

    return {
      success: errors.length === 0,
      moved,
      errors,
      skipped
    };

  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return {
      success: false,
      moved,
      errors,
      skipped
    };
  }
}

/**
 * Migrate skills from root to .claude/skills/
 */
async function migrateSkills(
  moved: string[],
  errors: string[],
  skipped: string[]
): Promise<void> {
  const rootSkillsPath = path.join(process.cwd(), "skills");
  const claudeSkillsPath = path.join(process.cwd(), ".claude", "skills");

  // Check if root skills exists
  if (!fs.existsSync(rootSkillsPath)) {
    skipped.push("skills/ (not found in root)");
    return;
  }

  // Check if already migrated
  if (fs.existsSync(claudeSkillsPath)) {
    skipped.push("skills/ (already in .claude/)");

    // Check if root skills should be removed
    console.log(chalk.yellow("\n⚠️  Found skills in both locations:"));
    console.log(chalk.gray(`   • ${rootSkillsPath}`));
    console.log(chalk.gray(`   • ${claudeSkillsPath}`));
    console.log(chalk.yellow("\n   You may want to remove the root skills/ folder manually."));

    return;
  }

  try {
    // Create .claude directory if it doesn't exist
    const claudeDir = path.join(process.cwd(), ".claude");
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    // Move skills directory
    console.log(chalk.cyan("📦 Moving skills/ to .claude/skills/..."));
    fs.renameSync(rootSkillsPath, claudeSkillsPath);
    moved.push("skills/ → .claude/skills/");
    console.log(chalk.green("   ✓ Skills migrated successfully"));

  } catch (error) {
    errors.push(`Failed to migrate skills: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Migrate squad infrastructure files to .claude/instructions/
 */
async function migrateSquadFiles(
  moved: string[],
  errors: string[],
  skipped: string[]
): Promise<void> {
  const squadFiles = [
    'supervisor-rules.md',
    'squad-roster.md',
    'communication-protocol.md',
    'architecture-decisions.md',
    'parallel-execution-rules.md'
  ];

  const claudeDir = path.join(process.cwd(), ".claude");
  const instructionsDir = path.join(claudeDir, "instructions");

  // Create instructions directory if it doesn't exist
  if (!fs.existsSync(instructionsDir)) {
    fs.mkdirSync(instructionsDir, { recursive: true });
  }

  let foundSquadFiles = false;

  for (const file of squadFiles) {
    const sourcePath = path.join(claudeDir, file);
    const destPath = path.join(instructionsDir, file);

    // Check if file exists in old location
    if (!fs.existsSync(sourcePath)) {
      // Check if already in new location
      if (fs.existsSync(destPath)) {
        skipped.push(`${file} (already in instructions/)`);
      }
      continue;
    }

    foundSquadFiles = true;

    // Check if destination already exists
    if (fs.existsSync(destPath)) {
      skipped.push(`${file} (already exists in instructions/)`);

      // Remove old file
      try {
        fs.unlinkSync(sourcePath);
        console.log(chalk.gray(`   • Removed duplicate: .claude/${file}`));
      } catch (error) {
        errors.push(`Failed to remove duplicate ${file}: ${error instanceof Error ? error.message : error}`);
      }

      continue;
    }

    try {
      // Move file to instructions
      fs.renameSync(sourcePath, destPath);
      moved.push(`.claude/${file} → .claude/instructions/${file}`);
      console.log(chalk.green(`   ✓ Moved ${file} to instructions/`));
    } catch (error) {
      errors.push(`Failed to migrate ${file}: ${error instanceof Error ? error.message : error}`);
    }
  }

  if (!foundSquadFiles && skipped.filter(s => squadFiles.some(f => s.includes(f))).length === 0) {
    console.log(chalk.gray("\n   No squad infrastructure files found (squad mode not installed)"));
  }
}

/**
 * Check if migration is needed
 */
export function checkMigrationNeeded(): { needed: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check for root-level skills
  if (fs.existsSync(path.join(process.cwd(), "skills"))) {
    const claudeSkills = path.join(process.cwd(), ".claude", "skills");
    if (!fs.existsSync(claudeSkills)) {
      reasons.push("skills/ folder in root should be moved to .claude/skills/");
    }
  }

  // Check for squad files in .claude/ root
  const squadFiles = [
    'supervisor-rules.md',
    'squad-roster.md',
    'communication-protocol.md',
    'architecture-decisions.md',
    'parallel-execution-rules.md'
  ];

  const claudeDir = path.join(process.cwd(), ".claude");
  for (const file of squadFiles) {
    if (fs.existsSync(path.join(claudeDir, file))) {
      reasons.push(`.claude/${file} should be in .claude/instructions/`);
      break; // Only add reason once
    }
  }

  return {
    needed: reasons.length > 0,
    reasons
  };
}
