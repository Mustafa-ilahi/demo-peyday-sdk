# 🚀 **PeyDey SDK Integration Steps Guide**

This guide provides **step-by-step instructions** for integrating the PeyDey SDK into various platforms and projects.

## 📋 **Table of Contents**

1. [Prerequisites](#-prerequisites)
2. [Integration Methods](#-integration-methods)
3. [Step-by-Step Integration](#-step-by-step-integration)
4. [Platform-Specific Guides](#-platform-specific-guides)
5. [Testing Your Integration](#-testing-your-integration)
6. [Troubleshooting](#-troubleshooting)

---

## ✅ **Prerequisites**

Before starting integration, ensure you have:

- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager
- **Basic knowledge** of JavaScript/TypeScript
- **Access** to your target project
- **PeyDey SDK** source code or package

---

## 🔧 **Integration Methods**

### **Method 1: NPM Package (Recommended)**
```bash
npm install peydey-sdk
```

### **Method 2: Direct Import**
```bash
git clone https://github.com/peydey/peydey-sdk.git
cd peydey-sdk
npm install
npm run build:sdk
```

### **Method 3: CDN (Browser Only)**
```html
<script src="https://unpkg.com/peydey-sdk@1.0.0/dist/index.umd.js"></script>
```

---

## 🚀 **Step-by-Step Integration**

### **Step 1: Install the SDK**

#### **Option A: NPM Installation**
```bash
# Navigate to your project directory
cd your-project

# Install the SDK
npm install peydey-sdk

# Verify installation
npm list peydey-sdk
```

#### **Option B: Direct Import**
```bash
# Clone the SDK repository
git clone https://github.com/peydey/peydey-sdk.git

# Navigate to SDK directory
cd peydey-sdk

# Install dependencies
npm install

# Build the SDK
npm run build:sdk

# Copy the built SDK to your project
cp -r dist/ ../your-project/node_modules/peydey-sdk/
```

### **Step 2: Import the SDK**

#### **ES6 Modules (Recommended)**
```javascript
import { PeyDeySDK } from 'peydey-sdk';
```

#### **CommonJS**
```javascript
const { PeyDeySDK } = require('peydey-sdk');
```

#### **Browser (UMD)**
```html
<script src="https://unpkg.com/peydey-sdk@1.0.0/dist/index.umd.js"></script>
<script>
  const { PeyDeySDK } = window.PeyDeySDK;
</script>
```

### **Step 3: Initialize the SDK**

```javascript
// Create SDK instance with configuration
const sdk = new PeyDeySDK({
  debug: true,                    // Enable debug logging
  wpsEndpoint: 'https://wps.peydey.ae', // Your WPS endpoint
  currency: 'AED',                // Currency (default: AED)
  country: 'UAE'                  // Country (default: UAE)
});

console.log('PeyDey SDK initialized successfully!');
```

### **Step 4: Implement User Authentication**

```javascript
// Function to authenticate user
async function authenticateUser(emiratesId, phoneNumber) {
  try {
    const result = await sdk.onboardUser({ emiratesId, phoneNumber });
    
    if (result.success) {
      console.log('✅ User authenticated:', result.userData.name);
      return result;
    } else {
      console.error('❌ Authentication failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return null;
  }
}

// Usage example
const authResult = await authenticateUser('784-1968-6570305-0', '+971523213841');
```

### **Step 5: Get User Information**

```javascript
// Function to get user details
function getUserDetails() {
  try {
    const details = sdk.getUserDetails();
    
    if (details.success) {
      console.log('User Details:', details.userData);
      return details;
    } else {
      console.error('Failed to get user details:', details.error);
      return null;
    }
  } catch (error) {
    console.error('Error getting user details:', error.message);
    return null;
  }
}

// Usage example
const userDetails = getUserDetails();
```

### **Step 6: Get Transaction History**

```javascript
// Function to get transaction history
function getTransactionHistory() {
  try {
    const history = sdk.getTransactionHistory();
    
    if (history.success) {
      console.log('Available Balance:', history.availableBalance, 'AED');
      console.log('Transactions:', history.transactions);
      return history;
    } else {
      console.error('Failed to get transaction history:', history.error);
      return null;
    }
  } catch (error) {
    console.error('Error getting transaction history:', error.message);
    return null;
  }
}

// Usage example
const transactionHistory = getTransactionHistory();
```

### **Step 7: Calculate Withdrawal Fees**

```javascript
// Function to calculate fees
function calculateFees(amount) {
  try {
    const fees = sdk.calculateWithdrawalFees(amount);
    
    if (fees.success) {
      console.log('Fees calculated:', fees.fees);
      return fees;
    } else {
      console.error('Failed to calculate fees:', fees.error);
      return null;
    }
  } catch (error) {
    console.error('Error calculating fees:', error.message);
    return null;
  }
}

// Usage example
const fees = calculateFees(100); // 100 AED
```

### **Step 8: Initiate Withdrawal**

```javascript
// Function to initiate withdrawal
async function initiateWithdrawal(amount, type = 'salary') {
  try {
    const withdrawal = await sdk.handleWithdrawalRequest(amount, type);
    
    if (withdrawal.success) {
      console.log('Withdrawal initiated:', withdrawal.withdrawalRequest);
      return withdrawal;
    } else {
      console.error('Withdrawal failed:', withdrawal.error);
      return null;
    }
  } catch (error) {
    console.error('Error initiating withdrawal:', error.message);
    return null;
  }
}

// Usage example
const withdrawal = await initiateWithdrawal(100, 'salary');
```

### **Step 9: WPS Validation**

```javascript
// Function to validate with WPS
async function validateWithWPS(wpsCallback, credentials) {
  try {
    const validation = await wpsCallback.validateUser(credentials);
    
    if (validation.success) {
      console.log('WPS validation successful:', validation.message);
      return validation;
    } else {
      console.error('WPS validation failed:', validation.error);
      return null;
    }
  } catch (error) {
    console.error('Error during WPS validation:', error.message);
    return null;
  }
}

// Usage example (after withdrawal)
if (withdrawal && withdrawal.wpsCallback) {
  const validation = await validateWithWPS(withdrawal.wpsCallback, {
    method: 'emiratesId',
    value: '784-1968-6570305-0'
  });
}
```

### **Step 10: WPS Processing**

```javascript
// Function to process with WPS
async function processWithWPS(wpsCallback, validationResult) {
  try {
    const processing = await wpsCallback.processWithdrawal(validationResult);
    
    if (processing.success) {
      console.log('WPS processing successful:', processing.receipt);
      return processing;
    } else {
      console.error('WPS processing failed:', processing.error);
      return null;
    }
  } catch (error) {
    console.error('Error during WPS processing:', error.message);
    return null;
  }
}

// Usage example (after validation)
if (validation) {
  const processing = await processWithWPS(withdrawal.wpsCallback, validation);
}
```

### **Step 11: Complete Flow Implementation**

```javascript
// Complete PeyDey flow function
async function completePeyDeyFlow(emiratesId, phoneNumber, amount) {
  try {
    console.log('🚀 Starting PeyDey flow...');
    
    // Step 1: Authenticate
    const auth = await authenticateUser(emiratesId, phoneNumber);
    if (!auth) return { success: false, step: 'authentication' };
    
    // Step 2: Get user details
    const details = getUserDetails();
    if (!details) return { success: false, step: 'user_details' };
    
    // Step 3: Get transaction history
    const history = getTransactionHistory();
    if (!history) return { success: false, step: 'transaction_history' };
    
    // Step 4: Calculate fees
    const fees = calculateFees(amount);
    if (!fees) return { success: false, step: 'fee_calculation' };
    
    // Step 5: Initiate withdrawal
    const withdrawal = await initiateWithdrawal(amount, 'salary');
    if (!withdrawal) return { success: false, step: 'withdrawal' };
    
    // Step 6: WPS validation
    const validation = await validateWithWPS(withdrawal.wpsCallback, {
      method: 'emiratesId',
      value: emiratesId
    });
    if (!validation) return { success: false, step: 'wps_validation' };
    
    // Step 7: WPS processing
    const processing = await processWithWPS(withdrawal.wpsCallback, validation);
    if (!processing) return { success: false, step: 'wps_processing' };
    
    console.log('🎉 PeyDey flow completed successfully!');
    return { success: true, receipt: processing.receipt };
    
  } catch (error) {
    console.error('❌ Flow error:', error.message);
    return { success: false, error: error.message };
  }
}

// Usage example
const flowResult = await completePeyDeyFlow(
  '784-1968-6570305-0', 
  '+971523213841', 
  100
);

if (flowResult.success) {
  console.log('Receipt:', flowResult.receipt);
} else {
  console.log('Flow failed at step:', flowResult.step);
}
```

### **Step 12: Cleanup and Session Management**

```javascript
// Function to logout and cleanup
function logout() {
  try {
    const result = sdk.exitSDK();
    console.log('Logout successful:', result.message);
    return result;
  } catch (error) {
    console.error('Logout error:', error.message);
    return null;
  }
}

// Function to check session status
function checkSession() {
  try {
    const session = sdk.userSession.getSession();
    console.log('Session status:', session);
    return session;
  } catch (error) {
    console.error('Session check error:', error.message);
    return null;
  }
}

// Usage examples
const sessionStatus = checkSession();
if (!sessionStatus.isAuthenticated) {
  console.log('User not authenticated');
} else {
  console.log('User authenticated:', sessionStatus.userId);
}
```

---

## 🎯 **Platform-Specific Guides**

### **React Integration**

#### **Step 1: Create React Component**
```jsx
import React, { useState, useEffect } from 'react';
import { PeyDeySDK } from 'peydey-sdk';

function PeyDeyIntegration() {
  const [sdk] = useState(() => new PeyDeySDK({ debug: true }));
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ... rest of component implementation
}
```

#### **Step 2: Implement Authentication Hook**
```jsx
const usePeyDeyAuth = (sdk) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const login = async (emiratesId, phoneNumber) => {
    try {
      const result = await sdk.onboardUser({ emiratesId, phoneNumber });
      if (result.success) {
        setIsAuthenticated(true);
        setUserData(result.userData);
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    sdk.exitSDK();
    setIsAuthenticated(false);
    setUserData(null);
  };

  return { isAuthenticated, userData, login, logout };
};
```

### **Vue.js Integration**

#### **Step 1: Create Vue Component**
```vue
<template>
  <div class="peydey-integration">
    <!-- Your template here -->
  </div>
</template>

<script>
import { PeyDeySDK } from 'peydey-sdk';

export default {
  name: 'PeyDeyIntegration',
  data() {
    return {
      sdk: new PeyDeySDK({ debug: true }),
      userData: null,
      loading: false,
      error: null
    };
  },
  // ... rest of component implementation
};
</script>
```

### **Angular Integration**

#### **Step 1: Create Angular Service**
```typescript
// peydey.service.ts
import { Injectable } from '@angular/core';
import { PeyDeySDK } from 'peydey-sdk';

@Injectable({
  providedIn: 'root'
})
export class PeyDeyService {
  private sdk: PeyDeySDK;

  constructor() {
    this.sdk = new PeyDeySDK({ debug: true });
  }

  // ... implement all SDK methods
}
```

#### **Step 2: Create Angular Component**
```typescript
// peydey.component.ts
import { Component } from '@angular/core';
import { PeyDeyService } from './peydey.service';

@Component({
  selector: 'app-peydey',
  template: `
    <!-- Your template here -->
  `
})
export class PeyDeyComponent {
  constructor(private peydeyService: PeyDeyService) {}
  
  // ... implement component methods
}
```

### **Node.js Backend Integration**

#### **Step 1: Create Express Server**
```javascript
// server.js
import express from 'express';
import { PeyDeySDK } from 'peydey-sdk';

const app = express();
app.use(express.json());

// Initialize SDK
const sdk = new PeyDeySDK({
  debug: false,
  wpsEndpoint: process.env.WPS_ENDPOINT || 'https://wps.peydey.ae'
});
```

#### **Step 2: Create API Routes**
```javascript
// Authentication route
app.post('/api/peydey/login', async (req, res) => {
  try {
    const { emiratesId, phoneNumber } = req.body;
    const result = await sdk.onboardUser({ emiratesId, phoneNumber });
    
    if (result.success) {
      res.json({ success: true, userData: result.userData });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// User details route
app.get('/api/peydey/user-details', (req, res) => {
  try {
    const details = sdk.getUserDetails();
    res.json(details);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get user details' });
  }
});

// ... more routes for other SDK methods
```

### **Mobile App Integration (React Native)**

#### **Step 1: Create SDK Wrapper**
```javascript
// peydey-sdk.js
import { PeyDeySDK } from 'peydey-sdk';

class PeyDeySDKWrapper {
  constructor() {
    this.sdk = new PeyDeySDK({
      debug: __DEV__,
      wpsEndpoint: 'https://wps.peydey.ae'
    });
  }

  // ... implement all SDK methods with error handling
}

export default new PeyDeySDKWrapper();
```

#### **Step 2: Use in React Native Component**
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import PeyDeySDK from './peydey-sdk';

export default function PeyDeyScreen() {
  const [userData, setUserData] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await PeyDeySDK.initializeUser(
        '784-1968-6570305-0', 
        '+971523213841'
      );
      if (result.success) {
        setUserData(result.userData);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // ... rest of component
}
```

---

## 🧪 **Testing Your Integration**

### **Step 1: Create Test File**
```javascript
// test-integration.js
import { PeyDeySDK } from 'peydey-sdk';

// Initialize SDK
const sdk = new PeyDeySDK({ debug: true });

// Test function
async function testIntegration() {
  try {
    console.log('🧪 Testing PeyDey SDK Integration...\n');
    
    // Test authentication
    const auth = await sdk.onboardUser({
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    });
    
    if (auth.success) {
      console.log('✅ Authentication: PASSED');
      
      // Test user details
      const details = sdk.getUserDetails();
      if (details.success) {
        console.log('✅ User Details: PASSED');
      }
      
      // Test transaction history
      const history = sdk.getTransactionHistory();
      if (history.success) {
        console.log('✅ Transaction History: PASSED');
      }
      
      // Test fee calculation
      const fees = sdk.calculateWithdrawalFees(100);
      if (fees.success) {
        console.log('✅ Fee Calculation: PASSED');
      }
      
      // Test withdrawal
      const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
      if (withdrawal.success) {
        console.log('✅ Withdrawal: PASSED');
      }
      
      console.log('\n🎉 All tests PASSED!');
    } else {
      console.log('❌ Authentication: FAILED');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
testIntegration();
```

### **Step 2: Run Integration Tests**
```bash
# Run the test file
node test-integration.js

# Or if using ES modules
node --experimental-modules test-integration.js
```

### **Step 3: Browser Testing**
Open `examples/integration-test.html` in your browser to test the SDK step by step.

---

## 🔧 **Troubleshooting**

### **Common Issues and Solutions**

#### **Issue 1: Module Not Found**
```bash
Error: Cannot find module 'peydey-sdk'
```

**Solution:**
```bash
# Reinstall the package
npm uninstall peydey-sdk
npm install peydey-sdk

# Or check if package.json has the dependency
npm list peydey-sdk
```

#### **Issue 2: Import/Export Errors**
```bash
Error: SyntaxError: Cannot use import statement outside a module
```

**Solution:**
```json
// package.json
{
  "type": "module"
}
```

Or use CommonJS:
```javascript
const { PeyDeySDK } = require('peydey-sdk');
```

#### **Issue 3: SDK Not Initializing**
```bash
Error: PeyDeySDK is not a constructor
```

**Solution:**
```javascript
// Check import
import { PeyDeySDK } from 'peydey-sdk';

// Verify the class exists
console.log(typeof PeyDeySDK); // Should be 'function'
```

#### **Issue 4: Authentication Fails**
```bash
Error: User not found or invalid credentials
```

**Solution:**
```javascript
// Use the test credentials
const credentials = {
  emiratesId: '784-1968-6570305-0',
  phoneNumber: '+971523213841'
};

// Check if SDK is properly initialized
console.log('SDK config:', sdk.config);
```

#### **Issue 5: WPS Integration Fails**
```bash
Error: WPS validation failed
```

**Solution:**
```javascript
// Ensure withdrawal was created first
const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
if (withdrawal.success && withdrawal.wpsCallback) {
  // Now validate with WPS
  const validation = await withdrawal.wpsCallback.validateUser({
    method: 'emiratesId',
    value: '784-1968-6570305-0'
  });
}
```

### **Debug Mode**
Enable debug mode to see detailed logs:
```javascript
const sdk = new PeyDeySDK({ debug: true });

// Check console for detailed SDK logs
sdk.log('Debug message', { data: 'example' });
```

---

## 📚 **Additional Resources**

- **Full Integration Guide**: [INTEGRATION.md](./INTEGRATION.md)
- **Quick Start Example**: [examples/quick-start.js](./examples/quick-start.js)
- **Integration Test**: [examples/integration-test.html](./examples/integration-test.html)
- **SDK Source Code**: [src/sdk/index.js](./src/sdk/index.js)
- **Test Suite**: [src/sdk/__tests__/sdk.test.js](./src/sdk/__tests__/sdk.test.js)

---

## 🎯 **Integration Checklist**

- [ ] SDK installed and imported
- [ ] SDK initialized with configuration
- [ ] User authentication implemented
- [ ] User details retrieval working
- [ ] Transaction history accessible
- [ ] Fee calculation functional
- [ ] Withdrawal request working
- [ ] WPS validation implemented
- [ ] WPS processing functional
- [ ] Error handling implemented
- [ ] Session management working
- [ ] Integration tested thoroughly
- [ ] Production configuration set

---

**🎉 Congratulations! You've successfully integrated the PeyDey SDK into your project!**

For additional support or questions, refer to the main [README.md](./README.md) or create an issue in the repository.
