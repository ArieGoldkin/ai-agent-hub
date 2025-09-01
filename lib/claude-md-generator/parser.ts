/**
 * Parser functions for agent metadata and CLAUDE.md content
 */

import { existsSync, readdirSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import { AgentMetadata, ClaudeMdSection } from "./types.js";
import { isStandardSection } from "./utils.js";

/**
 * Extract metadata from agent markdown files
 */
export async function extractAgentMetadata(agentsDir: string = ".claude/agents"): Promise<AgentMetadata[]> {
  const agents: AgentMetadata[] = [];
  
  if (!existsSync(agentsDir)) {
    return agents;
  }
  
  const files = readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = join(agentsDir, file);
    const content = await readFile(filePath, 'utf-8');
    
    // Extract frontmatter between --- markers
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (frontmatterMatch) {
      try {
        // Parse the frontmatter manually for better handling of multiline strings
        const metadata = parseAgentFrontmatter(frontmatterMatch[1]);
        if (metadata) {
          agents.push(metadata);
        }
      } catch (error) {
        console.warn(`Failed to parse metadata from ${file}:`, error);
      }
    }
  }
  
  // Sort agents: orchestrator first, then alphabetically
  agents.sort((a, b) => {
    if (a.orchestrator && !b.orchestrator) return -1;
    if (!a.orchestrator && b.orchestrator) return 1;
    return a.name.localeCompare(b.name);
  });
  
  return agents;
}

/**
 * Parse agent frontmatter manually to handle complex multiline descriptions
 */
function parseAgentFrontmatter(frontmatter: string): AgentMetadata | null {
  const metadata: any = {};
  const lines = frontmatter.split('\n');
  let currentKey: string | null = null;
  let currentValue: string[] = [];
  let inDescription = false;
  
  for (const line of lines) {
    // Check if this is a new key
    const keyMatch = line.match(/^([a-z_]+):\s*(.*)/);
    
    if (keyMatch && !inDescription) {
      // Save previous key-value if exists
      if (currentKey) {
        const value = currentValue.join('\n').trim();
        metadata[currentKey] = parseValue(value, currentKey);
      }
      
      currentKey = keyMatch[1];
      const initialValue = keyMatch[2];
      
      // Handle description specially as it's often multiline
      if (currentKey === 'description') {
        inDescription = true;
        currentValue = [initialValue];
      } else {
        currentValue = [initialValue];
        inDescription = false;
      }
    } else if (inDescription) {
      // Check if we've hit another key (simple heuristic)
      if (line.match(/^(tools|model|color|context_aware|orchestrator|manages|reads_from|writes_to|depends_on|provides_context):/)) {
        // End description and process new key
        if (currentKey) {
          const value = currentValue.join(' ').trim();
          metadata[currentKey] = value;
        }
        
        const newKeyMatch = line.match(/^([a-z_]+):\s*(.*)/);
        if (newKeyMatch) {
          currentKey = newKeyMatch[1];
          currentValue = [newKeyMatch[2]];
          inDescription = false;
        }
      } else {
        // Continue description
        currentValue.push(line);
      }
    } else {
      // Continue current value
      currentValue.push(line);
    }
  }
  
  // Save last key-value
  if (currentKey) {
    const value = currentValue.join(inDescription ? ' ' : '\n').trim();
    metadata[currentKey] = parseValue(value, currentKey);
  }
  
  return metadata as AgentMetadata;
}

/**
 * Parse a value from frontmatter (could be string, array, boolean, etc.)
 */
function parseValue(value: string, key?: string): any {
  // Handle boolean values
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Handle arrays (enclosed in brackets)
  if (value.startsWith('[') && value.endsWith(']')) {
    const items = value.slice(1, -1);
    if (items.trim() === '') return [];
    return items.split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
  }
  
  // Special handling for 'tools' field - it's comma-separated without brackets
  if (key === 'tools' && value.includes(',')) {
    return value.split(',').map(item => item.trim());
  }
  
  // Handle quoted strings
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  // Handle comma-separated lists for array-type fields
  const arrayFields = ['tools', 'manages', 'reads_from', 'writes_to', 'depends_on', 'provides_context'];
  if (key && arrayFields.includes(key) && value.includes(',')) {
    return value.split(',').map(item => item.trim());
  }
  
  // Return as string
  return value;
}

/**
 * Parse existing CLAUDE.md to identify sections
 */
export async function parseExistingClaudeMd(filePath: string): Promise<ClaudeMdSection[]> {
  const sections: ClaudeMdSection[] = [];
  
  if (!existsSync(filePath)) {
    return sections;
  }
  
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let currentSection: ClaudeMdSection | null = null;
  let sectionContent: string[] = [];
  
  for (const line of lines) {
    // Detect section headers (# or ##)
    if (line.match(/^#{1,2}\s+/)) {
      // Save previous section
      if (currentSection) {
        currentSection.content = sectionContent.join('\n');
        sections.push(currentSection);
      }
      
      // Start new section
      const title = line.replace(/^#{1,2}\s+/, '').trim();
      const isCustom = !isStandardSection(title);
      
      currentSection = {
        title,
        content: '',
        isCustom
      };
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection) {
    currentSection.content = sectionContent.join('\n');
    sections.push(currentSection);
  }
  
  return sections;
}