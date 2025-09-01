/**
 * Interactive prompt utilities for CLI
 */

import * as readline from 'readline';
import chalk from 'chalk';

export interface InstallationTarget {
  desktop: boolean;
  project: boolean;
}

/**
 * Prompt user for installation targets
 */
export async function promptForInstallationTargets(hasProject: boolean): Promise<InstallationTarget> {
  console.log(chalk.blue('\n📍 Where would you like to install?'));
  
  const options = [
    { key: '1', label: 'Claude Desktop only', value: { desktop: true, project: false } },
    { key: '2', label: 'Claude Code only (project .mcp.json)', value: { desktop: false, project: true }, disabled: !hasProject },
    { key: '3', label: 'Both Claude Desktop and Claude Code', value: { desktop: true, project: true }, disabled: !hasProject }
  ];

  // Filter out disabled options
  const availableOptions = options.filter(opt => !opt.disabled);
  
  // Display options
  console.log();
  availableOptions.forEach(opt => {
    console.log(`   ${opt.key}. ${opt.label}`);
  });
  
  if (!hasProject) {
    console.log(chalk.dim('\n   (Claude Code options not available - not in a project directory)'));
  }
  
  console.log();
  
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const askQuestion = () => {
      rl.question(chalk.green('Please select (1-' + availableOptions.length + '): '), (answer) => {
        const selected = availableOptions.find(opt => opt.key === answer.trim());
        
        if (selected) {
          rl.close();
          resolve(selected.value);
        } else {
          console.log(chalk.red('Invalid selection. Please try again.'));
          askQuestion();
        }
      });
    };
    
    askQuestion();
  });
}

/**
 * Confirm action with user
 */
export async function confirmAction(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(chalk.yellow(message + ' (y/N): '), (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}