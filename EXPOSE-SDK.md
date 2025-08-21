# 🌐 **Exposing Your PeyDey SDK**

This guide shows you how to expose and distribute your PeyDey SDK so others can integrate it into their projects.

## 📋 **Table of Contents**

1. [Build the SDK](#-build-the-sdk)
2. [NPM Package Distribution](#-npm-package-distribution)
3. [CDN Distribution](#-cdn-distribution)
4. [GitHub Distribution](#-github-distribution)
5. [Local Distribution](#-local-distribution)
6. [Documentation & Examples](#-documentation--examples)
7. [Version Management](#-version-management)

---

## 🔨 **Build the SDK**

Before exposing the SDK, you need to build it for distribution.

### **Step 1: Build for Production**

```bash
# Navigate to your project directory
cd test-sdk

# Install dependencies (if not already done)
npm install

# Build the SDK for distribution
npm run build:sdk

# Verify the build output
ls -la dist/
```

This creates multiple build formats in the `dist/` folder:
- `index.js` - CommonJS build
- `index.esm.js` - ES Module build  
- `index.umd.js` - UMD build for browsers
- Source maps for debugging

### **Step 2: Verify Build Output**

```bash
# Check the built files
cat dist/index.js | head -20
cat dist/index.esm.js | head -20
cat dist/index.umd.js | head -20

# Test the builds
node -e "console.log(require('./dist/index.js'))"
```

---

## 📦 **NPM Package Distribution**

### **Step 1: Prepare for NPM Publishing**

```bash
# Login to npm (if not already logged in)
npm login

# Check current package info
npm view peydey-sdk

# Update package version
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.1 → 1.1.0
npm version major    # 1.1.0 → 2.0.0
```

### **Step 2: Publish to NPM**

```bash
# Publish the package
npm publish

# Verify publication
npm view peydey-sdk
```

### **Step 3: Install from NPM (for others)**

```bash
# Others can now install your SDK
npm install peydey-sdk

# Import and use
import { PeyDeySDK } from 'peydey-sdk';
```

### **Step 4: Update Package Configuration**

Make sure your `package.json` is properly configured:

```json
{
  "name": "peydey-sdk",
  "version": "1.0.0",
  "description": "UAE Workforce Payment System Integration SDK for PeyDey",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "peydey",
    "uae",
    "wps",
    "workforce-payment",
    "emirates-id",
    "aed",
    "salary-advance"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/peydey-sdk.git"
  }
}
```

---

## 🌐 **CDN Distribution**

### **Step 1: Publish to CDN Services**

#### **Option A: Unpkg (Automatic from NPM)**
Once published to NPM, your SDK is automatically available on unpkg:

```html
<!-- Latest version -->
<script src="https://unpkg.com/peydey-sdk@latest/dist/index.umd.js"></script>

<!-- Specific version -->
<script src="https://unpkg.com/peydey-sdk@1.0.0/dist/index.umd.js"></script>

<!-- ES Module version -->
<script type="module">
  import { PeyDeySDK } from 'https://unpkg.com/peydey-sdk@1.0.0/dist/index.esm.js';
</script>
```

#### **Option B: jsDelivr (Automatic from NPM)**
```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/peydey-sdk@latest/dist/index.umd.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/peydey-sdk@1.0.0/dist/index.umd.js"></script>
```

#### **Option C: Custom CDN (Your Own Server)**
```bash
# Upload your dist/ folder to your web server
scp -r dist/ user@yourserver.com:/var/www/cdn/peydey-sdk/

# Access via your domain
# https://cdn.yourdomain.com/peydey-sdk/index.umd.js
```

### **Step 2: Test CDN Access**

```html
<!DOCTYPE html>
<html>
<head>
    <title>PeyDey SDK CDN Test</title>
</head>
<body>
    <h1>PeyDey SDK CDN Test</h1>
    
    <!-- Load SDK from CDN -->
    <script src="https://unpkg.com/peydey-sdk@latest/dist/index.umd.js"></script>
    
    <script>
        // Test if SDK loaded
        if (typeof PeyDeySDK !== 'undefined') {
            console.log('✅ SDK loaded from CDN successfully!');
            
            // Initialize SDK
            const sdk = new PeyDeySDK({ debug: true });
            console.log('SDK initialized:', sdk);
        } else {
            console.error('❌ SDK failed to load from CDN');
        }
    </script>
</body>
</html>
```

---

## 📚 **GitHub Distribution**

### **Step 1: Create GitHub Repository**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: PeyDey SDK v1.0.0"

# Add remote origin
git remote add origin https://github.com/yourusername/peydey-sdk.git

# Push to GitHub
git push -u origin main
```

### **Step 2: Create GitHub Releases**

```bash
# Create a new release
git tag v1.0.0
git push origin v1.0.0

# Or use GitHub CLI
gh release create v1.0.0 --title "PeyDey SDK v1.0.0" --notes "Initial release"
```

### **Step 3: Direct GitHub Installation**

Others can install directly from GitHub:

```bash
# Install from GitHub
npm install github:yourusername/peydey-sdk

# Or specific branch/tag
npm install github:yourusername/peydey-sdk#main
npm install github:yourusername/peydey-sdk#v1.0.0
```

### **Step 4: GitHub Pages for Documentation**

```bash
# Create docs folder
mkdir docs

# Copy built files and documentation
cp -r dist/ docs/
cp README.md docs/
cp INTEGRATION.md docs/
cp INTEGRATION-STEPS.md docs/
cp -r examples/ docs/

# Push to gh-pages branch
git checkout -b gh-pages
git add docs/
git commit -m "Add documentation and examples"
git push origin gh-pages
```

Your SDK will be available at: `https://yourusername.github.io/peydey-sdk/`

---

## 🏠 **Local Distribution**

### **Step 1: Local NPM Package**

```bash
# Pack the SDK locally
npm pack

# This creates: peydey-sdk-1.0.0.tgz

# Install locally in another project
npm install ../path/to/peydey-sdk-1.0.0.tgz
```

### **Step 2: Local File System**

```bash
# Copy to a shared location
cp -r dist/ /shared/sdks/peydey-sdk/

# Others can import directly
import { PeyDeySDK } from '/shared/sdks/peydey-sdk/index.esm.js';
```

### **Step 3: Docker Distribution**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy SDK files
COPY dist/ ./dist/
COPY package.json ./
COPY README.md ./

# Expose port for documentation
EXPOSE 3000

# Serve documentation
CMD ["npx", "serve", "-s", ".", "-l", "3000"]
```

```bash
# Build and run Docker container
docker build -t peydey-sdk .
docker run -p 3000:3000 peydey-sdk

# Access at http://localhost:3000
```

---

## 📖 **Documentation & Examples**

### **Step 1: Create Comprehensive Documentation**

```bash
# Create documentation structure
mkdir -p docs/{api,examples,guides}

# Copy documentation files
cp README.md docs/
cp INTEGRATION.md docs/
cp INTEGRATION-STEPS.md docs/
cp -r examples/ docs/
```

### **Step 2: API Documentation**

```javascript
// Generate API docs using JSDoc
npm install -g jsdoc

# Generate documentation
jsdoc src/sdk/ -d docs/api

# Or use TypeDoc for TypeScript
npm install -g typedoc
typedoc src/sdk/ --out docs/api
```

### **Step 3: Interactive Examples**

```html
<!-- docs/examples/demo.html -->
<!DOCTYPE html>
<html>
<head>
    <title>PeyDey SDK Demo</title>
</head>
<body>
    <h1>PeyDey SDK Interactive Demo</h1>
    
    <!-- Load SDK -->
    <script src="../dist/index.umd.js"></script>
    
    <!-- Demo interface -->
    <div id="demo">
        <button onclick="testSDK()">Test SDK</button>
        <div id="output"></div>
    </div>
    
    <script>
        function testSDK() {
            const sdk = new PeyDeySDK({ debug: true });
            
            // Test authentication
            sdk.onboardUser({
                emiratesId: '784-1968-6570305-0',
                phoneNumber: '+971523213841'
            }).then(result => {
                document.getElementById('output').innerHTML = 
                    `<pre>${JSON.stringify(result, null, 2)}</pre>`;
            });
        }
    </script>
</body>
</html>
```

---

## 🔄 **Version Management**

### **Step 1: Semantic Versioning**

```bash
# Follow semantic versioning
npm version patch    # Bug fixes: 1.0.0 → 1.0.1
npm version minor    # New features: 1.0.1 → 1.1.0  
npm version major    # Breaking changes: 1.1.0 → 2.0.0
```

### **Step 2: Changelog Management**

```markdown
# CHANGELOG.md

## [1.1.0] - 2024-01-15
### Added
- New method: calculateWithdrawalFees()
- Enhanced error handling
- Better TypeScript support

### Changed
- Updated WPS integration flow
- Improved performance

### Fixed
- Bug in user session management
- Issue with fee calculations

## [1.0.0] - 2024-01-01
### Added
- Initial release
- User authentication
- WPS integration
- Transaction management
```

### **Step 3: Release Process**

```bash
# 1. Update version
npm version minor

# 2. Build SDK
npm run build:sdk

# 3. Test builds
npm test

# 4. Commit changes
git add .
git commit -m "Release v1.1.0"

# 5. Create tag
git tag v1.1.0

# 6. Push to GitHub
git push origin main --tags

# 7. Publish to NPM
npm publish

# 8. Create GitHub release
gh release create v1.1.0 --title "PeyDey SDK v1.1.0" --notes "See CHANGELOG.md"
```

---

## 🚀 **Quick Start for Others**

### **Option 1: NPM (Recommended)**
```bash
npm install peydey-sdk
```

```javascript
import { PeyDeySDK } from 'peydey-sdk';

const sdk = new PeyDeySDK({ debug: true });
const result = await sdk.onboardUser({
  emiratesId: '784-1968-6570305-0',
  phoneNumber: '+971523213841'
});
```

### **Option 2: CDN**
```html
<script src="https://unpkg.com/peydey-sdk@latest/dist/index.umd.js"></script>
<script>
  const sdk = new PeyDeySDK({ debug: true });
  // Use SDK...
</script>
```

### **Option 3: GitHub**
```bash
npm install github:yourusername/peydey-sdk
```

---

## 📊 **Distribution Checklist**

- [ ] SDK built and tested (`npm run build:sdk`)
- [ ] Package.json configured correctly
- [ ] NPM account logged in (`npm login`)
- [ ] Version updated (`npm version patch/minor/major`)
- [ ] Published to NPM (`npm publish`)
- [ ] GitHub repository created and pushed
- [ ] GitHub release created
- [ ] Documentation generated and deployed
- [ ] Examples working and tested
- [ ] CDN links verified
- [ ] Installation instructions updated

---

## 🔗 **Distribution URLs**

Once exposed, your SDK will be available at:

- **NPM**: `npm install peydey-sdk`
- **CDN (Unpkg)**: `https://unpkg.com/peydey-sdk@latest/`
- **CDN (jsDelivr)**: `https://cdn.jsdelivr.net/npm/peydey-sdk@latest/`
- **GitHub**: `https://github.com/yourusername/peydey-sdk`
- **GitHub Pages**: `https://yourusername.github.io/peydey-sdk/`

---

## 🎯 **Next Steps**

1. **Build your SDK**: `npm run build:sdk`
2. **Publish to NPM**: `npm publish`
3. **Create GitHub repository** and push your code
4. **Create GitHub release** with version tag
5. **Share the installation instructions** with others
6. **Monitor usage** and gather feedback
7. **Iterate and improve** based on user needs

---

**🎉 Congratulations! Your PeyDey SDK is now exposed and ready for others to use!**

For additional help with distribution, refer to the main [README.md](./README.md) or create an issue in the repository.
