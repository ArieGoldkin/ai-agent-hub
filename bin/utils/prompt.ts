/**
 * Interactive prompt utilities for CLI
 */

import * as readline from 'readline';
import chalk from 'chalk';

export interface InstallationTarget {
  desktop: boolean;
  project: boolean;
}

export type ExecutionMode = 'classic' | 'squad';

/**
 * Prompt user for installation targets
 */
export async function promptForInstallationTargets(): Promise<InstallationTarget> {
  console.log(chalk.blue('\n📍 Where would you like to install?'));
  
  const options = [
    { key: '1', label: 'Claude Desktop only', value: { desktop: true, project: false } },
    { key: '2', label: 'Current directory (Claude Code)', value: { desktop: false, project: true } },
    { key: '3', label: 'Both Claude Desktop and current directory', value: { desktop: true, project: true } }
  ];

  // All options are always available
  const availableOptions = options;
  
  // Display options
  console.log();
  availableOptions.forEach(opt => {
    console.log(`   ${opt.key}. ${opt.label}`);
  });
  
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
 * Prompt user for execution mode
 */
export async function promptForExecutionMode(): Promise<ExecutionMode> {
  console.log(chalk.blue('\n🚀 Select installation mode:'));
  console.log();
  console.log(chalk.gray('   Classic Mode:'));
  console.log('   • Full agent definitions (educational)');
  console.log('   • Complete documentation');
  console.log('   • Best for learning and small projects');
  console.log();
  console.log(chalk.gray('   Squad Mode:'));
  console.log('   • 97% fewer tokens (cost-efficient)');
  console.log('   • Parallel execution');
  console.log('   • Best for production and large projects');
  
  const options = [
    { key: '1', label: 'Classic - Full agents with detailed documentation', value: 'classic' as ExecutionMode },
    { key: '2', label: 'Squad - Optimized for parallel execution (recommended)', value: 'squad' as ExecutionMode }
  ];
  
  console.log();
  options.forEach(opt => {
    console.log(`   ${opt.key}. ${opt.label}`);
  });
  console.log();
  
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const askQuestion = () => {
      rl.question(chalk.green('Please select mode (1-2): '), (answer) => {
        const selected = options.find(opt => opt.key === answer.trim());
        
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