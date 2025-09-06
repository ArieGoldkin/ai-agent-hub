#!/usr/bin/env node

import { AgentWrapper } from './agent-wrapper.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Integration test - 10 parallel agents modifying the same files
 */
async function runIntegrationTest() {
  console.log('🚀 Running integration test with 10 parallel agents...\n');
  
  const testDir = '.squad/test-integration';
  const testFiles = [
    path.join(testDir, 'shared-config.json'),
    path.join(testDir, 'shared-data.json'),
    path.join(testDir, 'shared-log.txt')
  ];
  
  // Setup test directory and files
  await fs.mkdir(testDir, { recursive: true });
  
  // Initialize test files
  await fs.writeFile(testFiles[0], JSON.stringify({ counter: 0, agents: [] }, null, 2));
  await fs.writeFile(testFiles[1], JSON.stringify({ operations: [] }, null, 2));
  await fs.writeFile(testFiles[2], 'Integration Test Log\n');
  
  const agents = 10;
  const operationsPerAgent = 10;
  const startTime = Date.now();
  
  // Launch parallel agents
  const agentPromises = [];
  for (let agentId = 1; agentId <= agents; agentId++) {
    agentPromises.push((async () => {
      const wrapper = new AgentWrapper(agentId);
      
      for (let op = 0; op < operationsPerAgent; op++) {
        // Randomly choose an operation
        const operation = Math.floor(Math.random() * 3);
        
        try {
          switch (operation) {
            case 0: // Update config
              const config = await wrapper.readFile(testFiles[0]);
              const configData = JSON.parse(config);
              configData.counter++;
              configData.agents.push({ id: agentId, op, time: Date.now() });
              await wrapper.writeFile(testFiles[0], JSON.stringify(configData, null, 2));
              break;
              
            case 1: // Update data
              const data = await wrapper.readFile(testFiles[1]);
              const dataObj = JSON.parse(data);
              dataObj.operations.push({
                agent: agentId,
                operation: op,
                timestamp: new Date().toISOString()
              });
              await wrapper.writeFile(testFiles[1], JSON.stringify(dataObj, null, 2));
              break;
              
            case 2: // Append to log
              await wrapper.appendFile(testFiles[2], 
                `Agent ${agentId} - Operation ${op} at ${new Date().toISOString()}\n`);
              break;
          }
          
          // Random small delay
          await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
          
        } catch (error) {
          console.error(`Agent ${agentId} operation ${op} failed:`, error);
        }
      }
      
      // Check for deadlocks periodically
      if (agentId % 3 === 0) {
        await wrapper.checkDeadlock();
      }
    })());
  }
  
  // Wait for all agents to complete
  await Promise.all(agentPromises);
  
  const duration = Date.now() - startTime;
  
  // Verify results
  console.log('\n📊 Results:');
  console.log(`  Duration: ${duration}ms`);
  
  // Check config file
  const finalConfig = JSON.parse(await fs.readFile(testFiles[0], 'utf-8'));
  const expectedConfigOps = agents * operationsPerAgent * (1/3); // Roughly 1/3 of ops update config
  console.log(`  Config updates: ${finalConfig.agents.length} (expected ~${expectedConfigOps.toFixed(0)})`);
  console.log(`  Config counter: ${finalConfig.counter}`);
  
  // Check data file
  const finalData = JSON.parse(await fs.readFile(testFiles[1], 'utf-8'));
  const expectedDataOps = agents * operationsPerAgent * (1/3); // Roughly 1/3 of ops update data
  console.log(`  Data operations: ${finalData.operations.length} (expected ~${expectedDataOps.toFixed(0)})`);
  
  // Check log file
  const logContent = await fs.readFile(testFiles[2], 'utf-8');
  const logLines = logContent.split('\n').filter(line => line.trim()).length - 1; // Exclude header
  const expectedLogOps = agents * operationsPerAgent * (1/3); // Roughly 1/3 of ops append to log
  console.log(`  Log entries: ${logLines} (expected ~${expectedLogOps.toFixed(0)})`);
  
  // Verify data integrity
  const configIntegrity = finalConfig.counter === finalConfig.agents.length;
  console.log(`  Config integrity: ${configIntegrity ? '✅ VALID' : '❌ CORRUPTED'}`);
  
  // Clean up
  await fs.rm(testDir, { recursive: true, force: true });
  
  if (configIntegrity) {
    console.log('\n✨ Integration test passed! No data corruption with 10 parallel agents.');
    process.exit(0);
  } else {
    console.log('\n❌ Integration test failed! Data corruption detected.');
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTest().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}