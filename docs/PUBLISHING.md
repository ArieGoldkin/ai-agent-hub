# Publishing AI Agent Hub to NPM

This guide walks through the complete process of publishing AI Agent Hub to NPM.

## ✅ Pre-Publishing Checklist

### 1. Code Readiness
- [x] All CLI commands work (`init`, `add`, `remove`, `list`, `doctor`)
- [x] Claude Desktop support implemented
- [x] Claude Code (.mcp.json) support implemented
- [x] TypeScript builds without errors
- [x] Basic testing completed

### 2. Documentation
- [x] README.md is comprehensive
- [x] LICENSE file exists (MIT)
- [x] CLAUDE.md development guide updated
- [ ] CHANGELOG.md created (optional for v1.0.0)

### 3. Package Configuration
- [x] package.json metadata complete
- [ ] GitHub repository URLs updated (currently placeholders)
- [x] Version set to 1.0.0-beta.1
- [x] Files field configured (dist/, README.md, LICENSE)

## 📦 Step-by-Step Publishing Process

### Phase 1: GitHub Repository Setup

1. **Create GitHub Repository**
   ```bash
   # Go to github.com and create new repository: ai-agent-hub
   # Make it public
   # Don't initialize with README (we have one)
   ```

2. **Push Code to GitHub**
   ```bash
   # Add remote origin
   git remote add origin https://github.com/YOUR_USERNAME/ai-agent-hub.git
   
   # Push to main branch
   git branch -M main
   git push -u origin main
   ```

3. **Update Package.json URLs**
   ```bash
   # Edit package.json and replace YOUR_GITHUB_USERNAME with actual username
   # Then commit changes
   git add package.json
   git commit -m "chore: Update GitHub repository URLs"
   git push
   ```

### Phase 2: NPM Account Setup

1. **Create NPM Account**
   - Go to [npmjs.com](https://www.npmjs.com)
   - Click "Sign Up"
   - Choose username (e.g., your GitHub username)
   - Verify email address
   - **Enable 2FA** (highly recommended)

2. **Login to NPM CLI**
   ```bash
   npm login
   # Enter username
   # Enter password
   # Enter email
   # Enter OTP code (if 2FA enabled)
   ```

3. **Verify Login**
   ```bash
   npm whoami
   # Should show your username
   ```

### Phase 3: Beta Release

1. **Final Pre-Publishing Check**
   ```bash
   # Clean and rebuild
   npm run clean
   npm run build
   
   # Test locally
   npm link
   ai-agent-hub --version  # Should show 1.0.0-beta.1
   ai-agent-hub doctor
   npm unlink -g ai-agent-hub
   ```

2. **Dry Run to Check Package**
   ```bash
   # See what will be published
   npm pack --dry-run
   
   # Should show:
   # - dist/ directory
   # - README.md
   # - LICENSE
   # - package.json
   # - Total size should be < 1MB
   ```

3. **Publish Beta Version**
   ```bash
   # Publish with beta tag
   npm publish --tag beta --access public
   
   # If first time publishing scoped package:
   # npm publish --access public --tag beta
   ```

4. **Test Beta Installation**
   ```bash
   # In a different directory
   npx ai-agent-hub@beta --version
   npx ai-agent-hub@beta list
   npx ai-agent-hub@beta doctor
   ```

### Phase 4: Production Release

1. **Update Version for Production**
   ```bash
   # After beta testing looks good
   npm version 1.0.0
   git push --tags
   git push
   ```

2. **Publish Production Version**
   ```bash
   # Publish as latest
   npm publish --access public
   ```

3. **Verify Production Installation**
   ```bash
   # Test without version tag
   npx ai-agent-hub --version  # Should show 1.0.0
   npx ai-agent-hub init --dry-run
   ```

### Phase 5: Post-Publishing

1. **Create GitHub Release**
   - Go to your GitHub repo
   - Click "Releases" → "Create a new release"
   - Tag: `v1.0.0`
   - Title: "v1.0.0 - Initial Release"
   - Description:
     ```markdown
     ## 🚀 Initial Release
     
     AI Agent Hub is now available on NPM!
     
     ### Features
     - Configure Claude Desktop with MCP servers
     - Support for Claude Code (.mcp.json)
     - 12+ MCP servers available
     - Interactive setup wizard
     - Preset configurations
     
     ### Installation
     ```bash
     npx ai-agent-hub init
     ```
     ```

2. **Update README Badges**
   After publishing, these badges will work:
   ```markdown
   [![npm version](https://img.shields.io/npm/v/ai-agent-hub.svg)](https://www.npmjs.com/package/ai-agent-hub)
   [![npm downloads](https://img.shields.io/npm/dm/ai-agent-hub.svg)](https://www.npmjs.com/package/ai-agent-hub)
   ```

3. **Monitor Package**
   - Check NPM page: https://www.npmjs.com/package/ai-agent-hub
   - Monitor weekly downloads
   - Watch for GitHub issues

## 🚀 Marketing & Distribution

### Where to Share

1. **Reddit Communities**
   - r/ClaudeAI
   - r/javascript
   - r/node
   - r/programming

2. **Discord Servers**
   - Anthropic/Claude communities
   - JavaScript/Node.js servers
   - AI/ML communities

3. **Social Media**
   - Twitter/X with hashtags: #ClaudeAI #MCP #NPM #JavaScript
   - LinkedIn developer groups
   - Dev.to article

4. **Example Announcement**
   ```
   🚀 Just published AI Agent Hub - Configure Claude Desktop with MCP servers in seconds!
   
   One command to add filesystem access, GitHub integration, and more to Claude Desktop:
   
   npx ai-agent-hub init
   
   ✅ 12+ MCP servers
   ✅ Interactive setup
   ✅ Supports Claude Desktop & Claude Code
   
   GitHub: [your-repo-link]
   NPM: https://www.npmjs.com/package/ai-agent-hub
   
   #ClaudeAI #MCP #OpenSource
   ```

## ⚠️ Common Issues & Solutions

### Issue: "npm ERR! 402 Payment Required"
**Solution**: Make sure you're logged in: `npm login`

### Issue: "npm ERR! 403 Forbidden"
**Solution**: Package name might be taken. Check: `npm view ai-agent-hub`

### Issue: "npm ERR! code E404"
**Solution**: For first publish, use `--access public` flag

### Issue: Package not showing on NPM
**Solution**: Wait 1-2 minutes, NPM indexes new packages

### Issue: Can't publish new version
**Solution**: Version must be higher than previous. Use `npm version patch/minor/major`

## 📊 Success Metrics

### Day 1 Goals
- [ ] Package published to NPM
- [ ] Basic functionality confirmed
- [ ] Shared in 2-3 communities

### Week 1 Goals
- [ ] 100+ downloads
- [ ] 10+ GitHub stars
- [ ] First user feedback/issue

### Month 1 Goals
- [ ] 1000+ downloads
- [ ] 50+ GitHub stars
- [ ] Community contributions

## 🔄 Maintenance Plan

### Regular Updates
1. **Weekly**: Check for new MCP servers to add
2. **Bi-weekly**: Review and respond to issues
3. **Monthly**: Release minor updates with improvements

### Version Strategy
- `1.0.x` - Bug fixes only
- `1.x.0` - New features, backwards compatible
- `2.0.0` - Breaking changes (avoid if possible)

## 📝 Final Notes

1. **Before Publishing**: Make absolutely sure the package name `ai-agent-hub` is available
2. **Beta First**: Always publish beta before production
3. **Test Everything**: Use `npx` to test as a real user would
4. **Documentation**: Keep README updated with new features
5. **Community**: Engage with users, respond to issues quickly

## 🎯 Quick Commands Reference

```bash
# Build
npm run clean && npm run build

# Test locally
npm link
ai-agent-hub --version
npm unlink -g ai-agent-hub

# Publish beta
npm publish --tag beta --access public

# Publish production
npm version 1.0.0
npm publish --access public

# Test published version
npx ai-agent-hub@beta --version  # Beta
npx ai-agent-hub --version        # Production
```

---

Ready to publish! 🚀 Good luck with the launch!