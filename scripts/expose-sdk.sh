#!/bin/bash

# 🚀 PeyDey SDK Exposure Script
# This script helps you expose and distribute your SDK

set -e

echo "🏦 PeyDey SDK Exposure Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if package.json has the right name
PACKAGE_NAME=$(node -p "require('./package.json').name")
if [ "$PACKAGE_NAME" != "peydey-sdk" ]; then
    print_warning "Package name in package.json is '$PACKAGE_NAME', expected 'peydey-sdk'"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_status "Starting SDK exposure process..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install

# Step 2: Build the SDK
print_status "Building SDK for distribution..."
npm run build:sdk

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed! dist/ directory not found"
    exit 1
fi

print_success "SDK built successfully!"

# Step 3: Check build output
print_status "Build output:"
ls -la dist/

# Step 4: Test the builds
print_status "Testing builds..."
if node -e "console.log('CommonJS build:', require('./dist/index.js'))" 2>/dev/null; then
    print_success "CommonJS build test passed"
else
    print_warning "CommonJS build test failed"
fi

# Step 5: Check package.json configuration
print_status "Checking package.json configuration..."
MAIN_ENTRY=$(node -p "require('./package.json').main")
MODULE_ENTRY=$(node -p "require('./package.json').module")
VERSION=$(node -p "require('./package.json').version")

echo "Main entry: $MAIN_ENTRY"
echo "Module entry: $MODULE_ENTRY"
echo "Version: $VERSION"

# Step 6: Pack the SDK locally
print_status "Creating local package..."
npm pack

PACKAGE_FILE=$(ls peydey-sdk-*.tgz | head -1)
if [ -f "$PACKAGE_FILE" ]; then
    print_success "Local package created: $PACKAGE_FILE"
    echo "Size: $(du -h "$PACKAGE_FILE" | cut -f1)"
else
    print_error "Failed to create local package"
    exit 1
fi

# Step 7: Check NPM login status
print_status "Checking NPM login status..."
if npm whoami 2>/dev/null; then
    NPM_USER=$(npm whoami)
    print_success "Logged in as: $NPM_USER"
else
    print_warning "Not logged in to NPM"
    read -p "Would you like to login now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm login
    fi
fi

# Step 8: Check if package already exists on NPM
print_status "Checking if package exists on NPM..."
if npm view "$PACKAGE_NAME" >/dev/null 2>&1; then
    NPM_VERSION=$(npm view "$PACKAGE_NAME" version)
    print_warning "Package already exists on NPM with version: $NPM_VERSION"
    
    if [ "$VERSION" = "$NPM_VERSION" ]; then
        print_error "Cannot publish: local version ($VERSION) matches NPM version"
        read -p "Would you like to bump the version? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Choose version bump type:"
            echo "1) patch (1.0.0 → 1.0.1) - Bug fixes"
            echo "2) minor (1.0.0 → 1.1.0) - New features"
            echo "3) major (1.0.0 → 2.0.0) - Breaking changes"
            read -p "Enter choice (1-3): " -n 1 -r
            echo
            case $REPLY in
                1) npm version patch ;;
                2) npm version minor ;;
                3) npm version major ;;
                *) print_error "Invalid choice, using patch"; npm version patch ;;
            esac
            VERSION=$(node -p "require('./package.json').version")
            print_success "Version bumped to: $VERSION"
        else
            print_error "Cannot proceed without version bump"
            exit 1
        fi
    fi
else
    print_success "Package does not exist on NPM (first time publishing)"
fi

# Step 9: Publish to NPM
print_status "Ready to publish to NPM..."
echo "Package: $PACKAGE_NAME"
echo "Version: $VERSION"
echo "Files to be published:"
npm publish --dry-run

read -p "Proceed with publishing? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Publishing to NPM..."
    npm publish
    print_success "Package published to NPM successfully!"
    
    # Wait a moment for NPM to process
    sleep 5
    
    # Verify publication
    if npm view "$PACKAGE_NAME" >/dev/null 2>&1; then
        PUBLISHED_VERSION=$(npm view "$PACKAGE_NAME" version)
        print_success "Verified: Package is now available on NPM with version $PUBLISHED_VERSION"
    else
        print_warning "Package not yet visible on NPM (may take a few minutes)"
    fi
else
    print_warning "Skipping NPM publication"
fi

# Step 10: Create distribution summary
print_status "Creating distribution summary..."
cat > DISTRIBUTION_SUMMARY.md << EOF
# 🚀 PeyDey SDK Distribution Summary

## Package Information
- **Name**: $PACKAGE_NAME
- **Version**: $VERSION
- **Local Package**: $PACKAGE_FILE

## Distribution URLs

### NPM
\`\`\`bash
npm install $PACKAGE_NAME
\`\`\`

### CDN (Unpkg)
\`\`\`html
<script src="https://unpkg.com/$PACKAGE_NAME@$VERSION/dist/index.umd.js"></script>
\`\`\`

### CDN (jsDelivr)
\`\`\`html
<script src="https://cdn.jsdelivr.net/npm/$PACKAGE_NAME@$VERSION/dist/index.umd.js"></script>
\`\`\`

## Installation Instructions

### For Node.js Projects
\`\`\`bash
npm install $PACKAGE_NAME
\`\`\`

\`\`\`javascript
import { PeyDeySDK } from '$PACKAGE_NAME';

const sdk = new PeyDeySDK({ debug: true });
\`\`\`

### For Browser Projects
\`\`\`html
<script src="https://unpkg.com/$PACKAGE_NAME@$VERSION/dist/index.umd.js"></script>
<script>
  const sdk = new PeyDeySDK({ debug: true });
</script>
\`\`\`

## Build Files
The following files are available in the \`dist/\` folder:
- \`index.js\` - CommonJS build
- \`index.esm.js\` - ES Module build
- \`index.umd.js\` - UMD build for browsers

## Documentation
- [README.md](./README.md) - Main documentation
- [INTEGRATION.md](./INTEGRATION.md) - Integration guide
- [INTEGRATION-STEPS.md](./INTEGRATION-STEPS.md) - Step-by-step integration
- [EXPOSE-SDK.md](./EXPOSE-SDK.md) - How to expose the SDK

## Examples
- [examples/quick-start.js](./examples/quick-start.js) - Quick start example
- [examples/integration-template.js](./examples/integration-template.js) - Integration template
- [examples/integration-test.html](./examples/integration-test.html) - Browser testing

## Next Steps
1. Create a GitHub repository
2. Push your code to GitHub
3. Create a GitHub release
4. Share the installation instructions
5. Monitor usage and gather feedback

Generated on: $(date)
EOF

print_success "Distribution summary created: DISTRIBUTION_SUMMARY.md"

# Step 11: Final instructions
echo
echo "🎉 SDK Exposure Process Complete!"
echo "================================"
echo
echo "Your SDK is now ready for distribution!"
echo
echo "📦 Local Package: $PACKAGE_FILE"
echo "🌐 NPM Package: $PACKAGE_NAME@$VERSION"
echo "📖 Documentation: DISTRIBUTION_SUMMARY.md"
echo
echo "Next steps:"
echo "1. Share the local package file with others"
echo "2. Others can install via: npm install $PACKAGE_NAME"
echo "3. Create GitHub repository for source code"
echo "4. Share the integration guides"
echo
echo "For detailed instructions, see: EXPOSE-SDK.md"
echo
print_success "Happy distributing! 🚀"
