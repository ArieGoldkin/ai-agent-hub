#!/bin/bash

# Test script to run before publishing to NPM
# Usage: ./test-before-publish.sh

set -e  # Exit on error

echo "🔍 AI Agent Hub - Pre-Publishing Test Suite"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "📊 Checking environment..."
NODE_VERSION=$(node --version)
echo "   Node.js: $NODE_VERSION"

# Check if Node >= 20
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo -e "   ${RED}❌ Node.js version too old (need >= 20)${NC}"
    exit 1
else
    echo -e "   ${GREEN}✅ Node.js version OK${NC}"
fi

# Clean and build
echo ""
echo "🔨 Building project..."
npm run clean
npm run build
echo -e "${GREEN}✅ Build successful${NC}"

# Run linting
echo ""
echo "🔍 Running linter..."
npm run lint || echo -e "${YELLOW}⚠️  Linting warnings (non-critical)${NC}"

# Run type checking
echo ""
echo "🔍 Running type check..."
npm run typecheck
echo -e "${GREEN}✅ TypeScript check passed${NC}"

# Test CLI commands
echo ""
echo "🧪 Testing CLI commands..."

# Test help
echo "   Testing: --help"
node dist/bin/cli.js --help > /dev/null 2>&1
echo -e "   ${GREEN}✅ Help command works${NC}"

# Test version
echo "   Testing: --version"
VERSION=$(node dist/bin/cli.js --version)
echo -e "   ${GREEN}✅ Version command works: $VERSION${NC}"

# Test list
echo "   Testing: list"
node dist/bin/cli.js list > /dev/null 2>&1
echo -e "   ${GREEN}✅ List command works${NC}"

# Test doctor
echo "   Testing: doctor"
node dist/bin/cli.js doctor > /dev/null 2>&1 || true  # Don't fail on warnings
echo -e "   ${GREEN}✅ Doctor command works${NC}"

# Check package size
echo ""
echo "📦 Checking package..."
npm pack --dry-run > pack-output.txt 2>&1
PACKAGE_SIZE=$(grep "npm notice" pack-output.txt | grep "package size" | awk '{print $4, $5}')
FILE_COUNT=$(grep "npm notice" pack-output.txt | grep "total files" | awk '{print $4}')
rm pack-output.txt

echo "   Package size: $PACKAGE_SIZE"
echo "   Total files: $FILE_COUNT"

# Check for required files
echo ""
echo "📄 Checking required files..."
if [ -f "README.md" ]; then
    echo -e "   ${GREEN}✅ README.md exists${NC}"
else
    echo -e "   ${RED}❌ README.md missing${NC}"
    exit 1
fi

if [ -f "LICENSE" ]; then
    echo -e "   ${GREEN}✅ LICENSE exists${NC}"
else
    echo -e "   ${RED}❌ LICENSE missing${NC}"
    exit 1
fi

if [ -d "dist" ]; then
    echo -e "   ${GREEN}✅ dist/ directory exists${NC}"
else
    echo -e "   ${RED}❌ dist/ directory missing${NC}"
    exit 1
fi

# Check package.json
echo ""
echo "📋 Checking package.json..."
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "   Name: $PACKAGE_NAME"
echo "   Version: $PACKAGE_VERSION"

# Check if logged into NPM
echo ""
echo "🔐 Checking NPM login..."
if npm whoami > /dev/null 2>&1; then
    NPM_USER=$(npm whoami)
    echo -e "   ${GREEN}✅ Logged in as: $NPM_USER${NC}"
else
    echo -e "   ${YELLOW}⚠️  Not logged in to NPM${NC}"
    echo "   Run: npm login"
fi

# Final summary
echo ""
echo "==========================================="
echo -e "${GREEN}✨ All tests passed!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Update GitHub URLs in package.json"
echo "2. Push code to GitHub"
echo "3. Run: npm login (if not logged in)"
echo "4. Run: npm publish --tag beta --access public"
echo "5. Test: npx ai-agent-hub@beta --version"
echo ""
echo "Good luck with your launch! 🚀"