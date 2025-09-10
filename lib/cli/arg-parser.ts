export interface ParsedArgs {
  command: string | undefined;
  hasProjectOnly: boolean;
  hasDesktopOnly: boolean;
  hasBoth: boolean;
  requestedMode: string | null;
}

export function parseArguments(args: string[]): ParsedArgs {
  // Check for installation target flags
  const hasProjectOnly = args.includes('--project-only');
  const hasDesktopOnly = args.includes('--desktop-only');
  const hasBoth = args.includes('--both');
  
  // Check for mode flags
  const modeIndex = args.indexOf('--mode');
  const requestedMode = modeIndex !== -1 && args[modeIndex + 1] ? args[modeIndex + 1] : null;
  
  // Extract command (first non-flag argument)
  const command = args.find(arg => !arg.startsWith('--'));
  
  return {
    command,
    hasProjectOnly,
    hasDesktopOnly,
    hasBoth,
    requestedMode
  };
}

export function getInstallTargets(args: ParsedArgs) {
  if (args.hasProjectOnly) {
    return { desktop: false, project: true };
  } else if (args.hasDesktopOnly) {
    return { desktop: true, project: false };
  } else if (args.hasBoth) {
    return { desktop: true, project: true };
  }
  return null;
}