export async function handleDebugMode(
  hasSquadDebug: boolean,
  hasSquadDebugParallel: boolean,
  debugReplaySession: string | null
): Promise<{ debugEnabled: boolean; selectedMode: string }> {
  // Handle debug replay
  if (debugReplaySession) {
    const { DebugCommands } = await import('../../bin/squad/debug-commands.js');
    const debugCommands = new DebugCommands();
    await debugCommands.replaySession(debugReplaySession);
    return { debugEnabled: false, selectedMode: '' }; // Exit after replay
  }
  
  // Handle debug mode
  if (hasSquadDebug || hasSquadDebugParallel) {
    const { DebugMode } = await import('../../bin/squad/debug-mode.js');
    const { DebugLogger } = await import('../../bin/squad/debug-logger.js');
    
    const debugMode = DebugMode.getInstance();
    await debugMode.initialize({
      enabled: true,
      sequential: hasSquadDebug, // Force sequential if --squad-debug
      verboseLogging: true,
      saveContext: true,
      tokenTracking: true
    });
    
    const logger = DebugLogger.getInstance();
    await logger.initialize();
    
    console.log(`\n🔍 Squad Debug Mode Enabled`);
    console.log(`   Session ID: ${debugMode.getSessionId()}`);
    console.log(`   Execution: ${hasSquadDebug ? 'Sequential' : 'Parallel (dangerous)'}`);
    console.log(`   Debug Dir: ${debugMode.getDebugDir()}`);
    console.log(`   Tail Logs: ${logger.getTailCommand()}\n`);
    
    return { debugEnabled: true, selectedMode: 'squad' };
  }
  
  return { debugEnabled: false, selectedMode: '' };
}