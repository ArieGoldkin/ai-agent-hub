#!/bin/bash

# AI Agent Hub - Simple Setup Script
# This script sets up MCP servers for Claude Desktop and Claude Code

set -e

echo "🚀 AI Agent Hub - Simple Setup"
echo "================================"

# Function to detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*) echo "macos" ;;
        Linux*) echo "linux" ;;
        MINGW*|MSYS*|CYGWIN*) echo "windows" ;;
        *) echo "unknown" ;;
    esac
}

# Function to find Claude Desktop config
find_claude_config() {
    local os=$(detect_os)
    case "$os" in
        macos)
            echo "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
            ;;
        linux)
            echo "$HOME/.config/Claude/claude_desktop_config.json"
            ;;
        windows)
            echo "$APPDATA/Claude/claude_desktop_config.json"
            ;;
        *)
            echo ""
            ;;
    esac
}

# Function to create .mcp.json for Claude Code
create_mcp_json() {
    cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["--yes", "@modelcontextprotocol/server-filesystem"]
    },
    "github": {
      "command": "npx",
      "args": ["--yes", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["--yes", "@modelcontextprotocol/server-memory"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["--yes", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
EOF
    echo "✅ Created .mcp.json for Claude Code"
}

# Function to update Claude Desktop config
update_claude_desktop() {
    local config_path="$1"
    
    if [ ! -f "$config_path" ]; then
        echo "❌ Claude Desktop config not found at: $config_path"
        echo "   Is Claude Desktop installed?"
        return 1
    fi
    
    # Backup existing config
    cp "$config_path" "$config_path.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Backed up existing Claude Desktop config"
    
    # Use Python to update JSON (more reliable than sed/jq)
    python3 << EOF
import json
import os

config_path = "$config_path"

# Read existing config
with open(config_path, 'r') as f:
    config = json.load(f)

# Ensure mcpServers exists
if 'mcpServers' not in config:
    config['mcpServers'] = {}

# Add our servers
servers = {
    "filesystem": {
        "command": "npx",
        "args": ["--yes", "@modelcontextprotocol/server-filesystem"]
    },
    "github": {
        "command": "npx",
        "args": ["--yes", "@modelcontextprotocol/server-github"],
        "env": {
            "GITHUB_TOKEN": os.environ.get('GITHUB_TOKEN', '\${GITHUB_TOKEN}')
        }
    },
    "memory": {
        "command": "npx",
        "args": ["--yes", "@modelcontextprotocol/server-memory"]
    },
    "sequential-thinking": {
        "command": "npx",
        "args": ["--yes", "@modelcontextprotocol/server-sequential-thinking"]
    }
}

# Update config
config['mcpServers'].update(servers)

# Write updated config
with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)

print("✅ Updated Claude Desktop configuration")
EOF
}

# Function to copy agent files
copy_agent_files() {
    if [ -d "agents" ]; then
        mkdir -p .claude/agents
        cp agents/*.md .claude/agents/ 2>/dev/null || true
        echo "✅ Copied agent personality files to .claude/agents/"
    fi
}

# Function to create .env from example
setup_env() {
    if [ ! -f .env ] && [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo "⚠️  Please edit .env and add your API keys"
    elif [ -f .env ]; then
        echo "✅ .env file already exists"
    fi
}

# Main setup flow
main() {
    echo ""
    echo "1️⃣  Detecting environment..."
    
    local os=$(detect_os)
    echo "   OS: $os"
    
    local is_project=false
    if [ -f "package.json" ] || [ -d ".git" ]; then
        is_project=true
        echo "   Project detected: $(pwd)"
    fi
    
    echo ""
    echo "2️⃣  Setting up configurations..."
    
    # Setup for Claude Code (if in project)
    if [ "$is_project" = true ]; then
        create_mcp_json
        copy_agent_files
        setup_env
    fi
    
    # Setup for Claude Desktop
    local claude_config=$(find_claude_config)
    if [ -n "$claude_config" ]; then
        echo ""
        echo "3️⃣  Configuring Claude Desktop..."
        update_claude_desktop "$claude_config"
    else
        echo "⚠️  Claude Desktop not detected"
    fi
    
    echo ""
    echo "================================"
    echo "✅ Setup Complete!"
    echo ""
    echo "Next steps:"
    
    if [ "$is_project" = true ] && [ -f .env ]; then
        echo "1. Edit .env file and add your API keys"
    fi
    
    if [ -n "$claude_config" ]; then
        echo "2. Restart Claude Desktop to load new MCP servers"
    fi
    
    if [ "$is_project" = true ]; then
        echo "3. Open this project in Claude Code to use MCP servers"
    fi
    
    echo ""
    echo "MCP Servers configured:"
    echo "  • filesystem - Read/write local files"
    echo "  • github - GitHub repository access (needs GITHUB_TOKEN)"
    echo "  • memory - Persistent memory across conversations"
    echo "  • sequential-thinking - Step-by-step reasoning"
    echo ""
}

# Run main function
main