#!/usr/bin/env node

/**
 * Context Viewer - CLI tool to visualize and browse context data
 * Provides insights into agent decisions, patterns, and project history
 */

const fs = require('fs');
const path = require('path');

class ContextViewer {
  constructor() {
    this.contextPath = path.join(process.cwd(), '.claude/context/shared-context.json');
    this.squadPath = path.join(process.cwd(), '.squad/sessions');
  }

  /**
   * Load and validate context
   */
  loadContext() {
    if (!fs.existsSync(this.contextPath)) {
      console.error('❌ No context file found at', this.contextPath);
      console.log('💡 Run your project with AI agents first to generate context');
      process.exit(1);
    }

    try {
      return JSON.parse(fs.readFileSync(this.contextPath, 'utf8'));
    } catch (error) {
      console.error('❌ Failed to parse context file:', error.message);
      process.exit(1);
    }
  }

  /**
   * Display context summary
   */
  showSummary(context) {
    console.log('\n' + '═'.repeat(60));
    console.log('📊 CONTEXT SUMMARY');
    console.log('═'.repeat(60) + '\n');

    console.log('📅 Session Information:');
    console.log(`   • Session ID: ${context.session_id}`);
    console.log(`   • Mode: ${context.mode?.toUpperCase() || 'CLASSIC'}`);
    console.log(`   • Last Updated: ${this.formatTime(context.timestamp)}`);

    if (context.last_activity) {
      console.log(`   • Last Activity: ${this.formatTime(context.last_activity)}`);
    }

    if (context.active_agent) {
      console.log(`   • Active Agent: ${context.active_agent}`);
    }

    console.log('\n📈 Progress Overview:');
    const completedCount = context.tasks_completed?.length || 0;
    const pendingCount = context.tasks_pending?.length || 0;
    const totalDecisions = Object.values(context.agent_decisions || {})
      .reduce((sum, decisions) => sum + decisions.length, 0);

    console.log(`   • Tasks Completed: ${completedCount}`);
    console.log(`   • Tasks Pending: ${pendingCount}`);
    console.log(`   • Total Decisions: ${totalDecisions}`);
    console.log(`   • Agents Involved: ${Object.keys(context.agent_decisions || {}).length}`);

    if (context.codebase_patterns && Object.keys(context.codebase_patterns).length > 0) {
      console.log('\n🔍 Detected Patterns:');
      for (const [pattern, value] of Object.entries(context.codebase_patterns)) {
        if (value) {
          console.log(`   • ${this.formatPatternName(pattern)}: ${value}`);
        }
      }
    }
  }

  /**
   * Show agent decisions
   */
  showAgentDecisions(context, agentFilter = null) {
    console.log('\n' + '═'.repeat(60));
    console.log('🤖 AGENT DECISIONS');
    console.log('═'.repeat(60) + '\n');

    const agents = agentFilter
      ? { [agentFilter]: context.agent_decisions[agentFilter] || [] }
      : context.agent_decisions || {};

    if (Object.keys(agents).length === 0) {
      console.log('   No agent decisions recorded yet');
      return;
    }

    for (const [agent, decisions] of Object.entries(agents)) {
      if (!decisions || decisions.length === 0) continue;

      console.log(`\n👤 ${this.formatAgentName(agent)}`);
      console.log('─'.repeat(40));

      decisions.slice(-5).forEach((decision, index) => {
        console.log(`\n   ${index + 1}. ${decision.decision}`);
        if (decision.rationale) {
          console.log(`      Rationale: ${this.truncate(decision.rationale, 100)}`);
        }
        if (decision.impact) {
          console.log(`      Impact: ${this.truncate(decision.impact, 100)}`);
        }
        if (decision.timestamp) {
          console.log(`      Time: ${this.formatTime(decision.timestamp)}`);
        }
      });

      if (decisions.length > 5) {
        console.log(`\n   ... and ${decisions.length - 5} more decisions`);
      }
    }
  }

  /**
   * Show completed tasks
   */
  showCompletedTasks(context) {
    console.log('\n' + '═'.repeat(60));
    console.log('✅ COMPLETED TASKS');
    console.log('═'.repeat(60) + '\n');

    const tasks = context.tasks_completed || [];
    if (tasks.length === 0) {
      console.log('   No completed tasks recorded yet');
      return;
    }

    tasks.slice(-10).forEach((task, index) => {
      console.log(`\n${index + 1}. ${task.description}`);
      console.log(`   Agent: ${task.agent}`);
      console.log(`   Time: ${this.formatTime(task.timestamp)}`);

      if (task.artifacts && task.artifacts.length > 0) {
        console.log(`   Artifacts: ${task.artifacts.slice(0, 3).join(', ')}${
          task.artifacts.length > 3 ? ` +${task.artifacts.length - 3} more` : ''
        }`);
      }

      if (task.metrics) {
        console.log(`   Metrics: ${JSON.stringify(task.metrics).substring(0, 80)}...`);
      }
    });

    if (tasks.length > 10) {
      console.log(`\n... and ${tasks.length - 10} more completed tasks`);
    }
  }

  /**
   * Show pending tasks
   */
  showPendingTasks(context) {
    console.log('\n' + '═'.repeat(60));
    console.log('⏳ PENDING TASKS');
    console.log('═'.repeat(60) + '\n');

    const tasks = context.tasks_pending || [];
    if (tasks.length === 0) {
      console.log('   No pending tasks - all clear! 🎉');
      return;
    }

    tasks.forEach((task, index) => {
      const priority = task.priority || 'medium';
      const priorityIcon = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
      }[priority];

      console.log(`\n${priorityIcon} ${index + 1}. ${task.description}`);

      if (task.blocker) {
        console.log(`   ⚠️  Blocker: ${task.blocker}`);
      }

      if (task.suggested_resolution) {
        console.log(`   💡 Suggestion: ${task.suggested_resolution}`);
      }

      console.log(`   Agent: ${task.agent}`);
      console.log(`   Added: ${this.formatTime(task.timestamp)}`);
    });
  }

  /**
   * Show timeline of activity
   */
  showTimeline(context) {
    console.log('\n' + '═'.repeat(60));
    console.log('📅 ACTIVITY TIMELINE');
    console.log('═'.repeat(60) + '\n');

    const events = [];

    // Collect all timestamped events
    for (const [agent, decisions] of Object.entries(context.agent_decisions || {})) {
      decisions.forEach(d => {
        if (d.timestamp) {
          events.push({
            time: new Date(d.timestamp),
            type: 'decision',
            agent,
            description: d.decision
          });
        }
      });
    }

    (context.tasks_completed || []).forEach(task => {
      if (task.timestamp) {
        events.push({
          time: new Date(task.timestamp),
          type: 'completed',
          agent: task.agent,
          description: task.description
        });
      }
    });

    (context.tasks_pending || []).forEach(task => {
      if (task.timestamp) {
        events.push({
          time: new Date(task.timestamp),
          type: 'pending',
          agent: task.agent,
          description: task.description
        });
      }
    });

    // Sort by time
    events.sort((a, b) => b.time - a.time);

    // Display recent events
    const recentEvents = events.slice(0, 20);
    recentEvents.forEach(event => {
      const icon = {
        decision: '💭',
        completed: '✅',
        pending: '⏳'
      }[event.type];

      console.log(`${icon} ${this.formatTime(event.time.toISOString())}`);
      console.log(`   ${event.agent}: ${this.truncate(event.description, 80)}`);
      console.log();
    });

    if (events.length > 20) {
      console.log(`... and ${events.length - 20} more events in history`);
    }
  }

  /**
   * Export context to different formats
   */
  exportContext(context, format = 'json') {
    const exportDir = path.join(process.cwd(), '.claude/exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    switch (format) {
      case 'json':
        const jsonFile = path.join(exportDir, `context-${timestamp}.json`);
        fs.writeFileSync(jsonFile, JSON.stringify(context, null, 2));
        console.log(`✅ Exported to: ${jsonFile}`);
        break;

      case 'markdown':
        const mdFile = path.join(exportDir, `context-${timestamp}.md`);
        const mdContent = this.generateMarkdownReport(context);
        fs.writeFileSync(mdFile, mdContent);
        console.log(`✅ Exported to: ${mdFile}`);
        break;

      case 'csv':
        const csvFile = path.join(exportDir, `decisions-${timestamp}.csv`);
        const csvContent = this.generateCSV(context);
        fs.writeFileSync(csvFile, csvContent);
        console.log(`✅ Exported to: ${csvFile}`);
        break;

      default:
        console.error('❌ Unknown export format:', format);
    }
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(context) {
    let md = '# AI Agent Hub - Context Report\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;

    md += '## Session Information\n';
    md += `- **Session ID**: ${context.session_id}\n`;
    md += `- **Mode**: ${context.mode}\n`;
    md += `- **Last Updated**: ${context.timestamp}\n\n`;

    md += '## Detected Patterns\n';
    for (const [pattern, value] of Object.entries(context.codebase_patterns || {})) {
      if (value) {
        md += `- **${this.formatPatternName(pattern)}**: ${value}\n`;
      }
    }

    md += '\n## Agent Activity\n';
    for (const [agent, decisions] of Object.entries(context.agent_decisions || {})) {
      md += `\n### ${this.formatAgentName(agent)}\n`;
      decisions.slice(-10).forEach(d => {
        md += `- ${d.decision}\n`;
        if (d.rationale) {
          md += `  - *Rationale*: ${d.rationale}\n`;
        }
      });
    }

    return md;
  }

  /**
   * Generate CSV of decisions
   */
  generateCSV(context) {
    let csv = 'Timestamp,Agent,Decision,Rationale,Impact\n';

    for (const [agent, decisions] of Object.entries(context.agent_decisions || {})) {
      decisions.forEach(d => {
        csv += `"${d.timestamp || ''}","${agent}","${d.decision}","${d.rationale || ''}","${d.impact || ''}"\n`;
      });
    }

    return csv;
  }

  /**
   * Utility functions
   */
  formatTime(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString();
  }

  formatAgentName(name) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatPatternName(name) {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  truncate(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  /**
   * Interactive menu
   */
  async showMenu() {
    const context = this.loadContext();

    console.log('\n🔮 AI Agent Hub - Context Viewer');
    console.log('════════════════════════════════\n');

    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'summary':
        this.showSummary(context);
        break;

      case 'agents':
        this.showAgentDecisions(context, args[1]);
        break;

      case 'completed':
        this.showCompletedTasks(context);
        break;

      case 'pending':
        this.showPendingTasks(context);
        break;

      case 'timeline':
        this.showTimeline(context);
        break;

      case 'export':
        this.exportContext(context, args[1] || 'json');
        break;

      case 'watch':
        this.watchMode(context);
        break;

      default:
        this.showSummary(context);
        console.log('\n📖 Available Commands:');
        console.log('   • summary    - Show context summary (default)');
        console.log('   • agents     - View agent decisions');
        console.log('   • completed  - Show completed tasks');
        console.log('   • pending    - Show pending tasks');
        console.log('   • timeline   - View activity timeline');
        console.log('   • export     - Export context (json/markdown/csv)');
        console.log('   • watch      - Live monitoring mode');
        console.log('\nExample: node context-viewer.js timeline');
    }
  }

  /**
   * Watch mode for live updates
   */
  watchMode(initialContext) {
    console.log('👁️  Watch mode activated - Press Ctrl+C to exit\n');

    const displayUpdate = () => {
      console.clear();
      const context = this.loadContext();
      this.showSummary(context);

      // Show recent activity
      console.log('\n📊 Recent Activity:');
      const allDecisions = Object.values(context.agent_decisions || {}).flat();
      const recentDecisions = allDecisions
        .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
        .slice(0, 5);

      recentDecisions.forEach(d => {
        console.log(`   • ${this.truncate(d.decision, 60)}`);
      });
    };

    displayUpdate();
    setInterval(displayUpdate, 5000);
  }
}

// Run the viewer
if (require.main === module) {
  const viewer = new ContextViewer();
  viewer.showMenu().catch(console.error);
}

module.exports = ContextViewer;