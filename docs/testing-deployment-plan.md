# Testing & NPM Deployment Plan

This document outlines the complete process for testing AI Agent Hub locally and deploying it to NPM.

## Overview

The deployment process follows a progressive testing approach:
1. Local testing with npm link
2. Package testing with npm pack
3. Beta release to NPM
4. Production release
5. Post-release monitoring

## Phase 1: Local Testing with npm link

### Step 1: Build and Link Locally

```bash
# Clean and build the project
npm run clean
npm run build

# Create a global symlink
npm link

# Verify the link was created
which ai-agent-hub
```

### Step 2: Test All Commands Locally

Test each command to ensure they work correctly:

```bash
# Test help and version
ai-agent-hub --help
ai-agent-hub --version

# Test list command (safe, read-only)
ai-agent-hub list
ai-agent-hub list --available
ai-agent-hub list --configured

# Test doctor command (diagnostic only)
ai-agent-hub doctor
ai-agent-hub doctor --verbose

# Test init command help (don't run actual init)
ai-agent-hub init --help

# Test add/remove help
ai-agent-hub add --help
ai-agent-hub remove --help
```

### Step 3: Test with Dry Run

Add a `--dry-run` flag to init command that shows what would happen without modifying Claude config:

```bash
# Test initialization without making changes
ai-agent-hub init --dry-run
```

The dry-run should:
- Show which servers would be installed
- Display config changes that would be made
- Not actually modify anything

### Step 4: Create Test Environment

```bash
# Create a test directory with fake Claude config
mkdir -p ~/test-claude-config
echo '{"mcpServers": {}}' > ~/test-claude-config/claude_desktop_config.json

# Test with custom config path (requires adding this option)
CLAUDE_CONFIG_PATH=~/test-claude-config/claude_desktop_config.json ai-agent-hub init
```

### Step 5: Unlink After Testing

```bash
# Remove the global symlink
npm unlink -g ai-agent-hub
```

## Phase 2: Package Testing

### Step 1: Create Local Package

```bash
# Create a tarball
npm pack

# Check package size (should be < 100KB)
ls -lh ai-agent-hub-1.0.0.tgz
```

Expected output: Package should be around 50-80KB.

### Step 2: Test NPX from Local Package

```bash
# Test without installing
npx ./ai-agent-hub-1.0.0.tgz --help
npx ./ai-agent-hub-1.0.0.tgz list
npx ./ai-agent-hub-1.0.0.tgz doctor
```

### Step 3: Test Global Install from Package

```bash
# Install globally from tarball
npm install -g ./ai-agent-hub-1.0.0.tgz

# Test commands
ai-agent-hub --help
ai-agent-hub list

# Uninstall
npm uninstall -g ai-agent-hub

# Clean up
rm ai-agent-hub-1.0.0.tgz
```

## Phase 3: Pre-Publishing Checklist

### Code Quality Checks

- [ ] All TypeScript compiles without errors
- [ ] No sensitive data in code (API keys, tokens)
- [ ] README.md is complete and accurate
- [ ] CLAUDE.md developer guide is included
- [ ] package.json has correct metadata
- [ ] LICENSE file exists
- [ ] No debug console.log statements

### Verify Package Contents

```bash
# See what will be published
npm pack --dry-run

# Ensure only necessary files are included:
# - dist/ (compiled code)
# - README.md
# - LICENSE
# - package.json
# - package-lock.json
```

### Test on Different Node Versions

```bash
# If using nvm or volta
nvm use 20
npm run build && node dist/bin/cli.js --help

nvm use 22
npm run build && node dist/bin/cli.js --help
```

## Phase 4: Beta Publishing

### Prerequisites

1. Create NPM account at https://www.npmjs.com/signup
2. Verify email address
3. Enable 2FA (recommended)

### Step 1: Create Beta Version

```bash
# Update version to beta
npm version 1.0.0-beta.1

# This updates package.json and creates a git tag
```

### Step 2: Login to NPM

```bash
# Login to NPM
npm login

# You'll be prompted for:
# - Username
# - Password
# - Email
# - OTP (if 2FA enabled)
```

### Step 3: Publish Beta

```bash
# Publish with beta tag (not latest)
npm publish --tag beta --access public

# The --access public is required for scoped packages
# or first-time publishing
```

### Step 4: Test Beta from NPM

```bash
# Wait 1-2 minutes for NPM to propagate

# Test with npx
npx ai-agent-hub@beta --help
npx ai-agent-hub@beta list
npx ai-agent-hub@beta doctor

# Test specific version
npx ai-agent-hub@1.0.0-beta.1 --help
```

### Step 5: Get Feedback

Share with a few developers:

```markdown
Hey! I've created a tool to simplify MCP server setup for Claude Desktop.
Try it out: `npx ai-agent-hub@beta init`
Feedback welcome!
```

## Phase 5: Production Release

### Step 1: Final Version

```bash
# Update to production version
npm version 1.0.0

# Commit the version change
git add package.json package-lock.json
git commit -m "Release v1.0.0"
```

### Step 2: Final Testing

```bash
# One more local test
npm run build
npm link
ai-agent-hub --help
ai-agent-hub doctor
npm unlink -g ai-agent-hub
```

### Step 3: Publish to Production

```bash
# Publish as latest (default)
npm publish --access public

# This automatically runs prepublishOnly script:
# - npm run clean
# - npm run build
```

### Step 4: Verify Production Release

```bash
# Test immediately (wait 1-2 minutes for propagation)
npx ai-agent-hub --help
npx ai-agent-hub list
npx ai-agent-hub doctor

# Check NPM page
npm info ai-agent-hub

# Or visit: https://www.npmjs.com/package/ai-agent-hub
```

### Step 5: Test Full User Flow

```bash
# Test as a real user would
npx ai-agent-hub init
```

## Phase 6: Post-Release

### Step 1: Create Git Tag

```bash
# Create and push version tag
git tag v1.0.0
git push origin v1.0.0
```

### Step 2: Create GitHub Release

1. Go to GitHub repo → Releases → Create new release
2. Choose tag: v1.0.0
3. Release title: "v1.0.0 - Initial Release"
4. Add release notes:
   - Features
   - Installation instructions
   - Known issues

### Step 3: Monitor for Issues

- Check NPM download stats: https://www.npmjs.com/package/ai-agent-hub
- Watch for GitHub issues
- Monitor social media mentions
- Test on different platforms (Windows, Linux)

### Step 4: Documentation Updates

Add NPM badges to README:

```markdown
[![npm version](https://badge.fury.io/js/ai-agent-hub.svg)](https://www.npmjs.com/package/ai-agent-hub)
[![npm downloads](https://img.shields.io/npm/dm/ai-agent-hub.svg)](https://www.npmjs.com/package/ai-agent-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Improvements to Add Before Publishing

### 1. Add --dry-run Flag

Update `bin/commands/init.ts` to support dry-run mode:

```typescript
.option('--dry-run', 'Preview changes without applying them')
```

### 2. Add --config-path Option

Allow testing with custom config location:

```typescript
.option('--config-path <path>', 'Custom Claude config path for testing')
```

### 3. Create LICENSE File

```bash
# Create MIT License
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Arie Goldkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

## Timeline

| Day | Phase | Tasks |
|-----|-------|-------|
| **Day 1 Morning** | Local Testing | npm link, test commands |
| **Day 1 Afternoon** | Package Testing | npm pack, test tarball |
| **Day 2 Morning** | Pre-publishing | Checklist, final fixes |
| **Day 2 Afternoon** | Beta Release | Publish beta, get feedback |
| **Day 3** | Production | Final release, monitoring |

## Success Criteria

✅ **Local Testing**: All commands work via npm link  
✅ **Package Testing**: NPX works from local tarball  
✅ **Beta Testing**: Works from NPM with @beta tag  
✅ **Production**: Users can run `npx ai-agent-hub init`  
✅ **Stability**: No critical bugs in first 24 hours  

## Risk Mitigation

1. **Test thoroughly locally** before any NPM publish
2. **Use beta tag** for initial release to limit exposure
3. **Have rollback plan**: Can deprecate broken versions with `npm deprecate`
4. **Test on clean machine/VM** if possible to catch missing dependencies
5. **Document known issues** in README to set expectations
6. **Start with read-only commands** (list, doctor) before testing modifications

## Troubleshooting Common Issues

### npm link not working
```bash
# Check npm prefix
npm prefix -g

# Ensure it's in PATH
echo $PATH

# Try with sudo (not recommended)
sudo npm link
```

### Package too large
```bash
# Check what's included
npm pack --dry-run

# Add more entries to .npmignore if needed
```

### NPM publish fails
```bash
# Check login status
npm whoami

# Verify package name availability
npm view ai-agent-hub

# Try with --access public
npm publish --access public
```

### Version conflicts
```bash
# Check current version
npm version

# Bump version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## Maintenance After Release

### Handling Bug Fixes

1. Fix bug in code
2. Update tests
3. Bump version: `npm version patch`
4. Test locally
5. Publish: `npm publish`

### Adding Features

1. Implement feature
2. Update documentation
3. Bump version: `npm version minor`
4. Beta test if major change
5. Publish

### Security Updates

1. Run `npm audit`
2. Update dependencies
3. Test thoroughly
4. Publish immediately if critical

## Contact for Issues

- GitHub Issues: [Create issue](https://github.com/yourusername/ai-agent-hub/issues)
- NPM Package: https://www.npmjs.com/package/ai-agent-hub
- Author: Arie Goldkin

---

*Last updated: [Current Date]*  
*Version: 1.0.0*