# 🔗 PeyDey SDK Integration Guide

This guide shows you how to integrate the PeyDey SDK with various platforms, frameworks, and systems.

## 📦 **Installation Methods**

### 1. **NPM Package (Recommended)**

```bash
npm install peydey-sdk
```

### 2. **CDN (Browser)**

```html
<!-- UMD Build -->
<script src="https://unpkg.com/peydey-sdk@1.0.0/dist/index.umd.js"></script>

<!-- ES Module Build -->
<script type="module">
  import { PeyDeySDK } from 'https://unpkg.com/peydey-sdk@1.0.0/dist/index.esm.js';
</script>
```

### 3. **Direct Import**

```bash
# Clone the repository
git clone https://github.com/peydey/peydey-sdk.git
cd peydey-sdk

# Install dependencies
npm install

# Build the SDK
npm run build:sdk
```

## 🚀 **Basic Integration Examples**

### **Vanilla JavaScript**

```javascript
// Import the SDK
import { PeyDeySDK } from 'peydey-sdk';

// Initialize SDK
const sdk = new PeyDeySDK({
  debug: true,
  wpsEndpoint: 'https://wps.peydey.ae'
});

// Basic flow
async function handlePeyDeyFlow() {
  try {
    // Step 1: Onboard user
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    const onboardResult = await sdk.onboardUser(credentials);
    
    if (onboardResult.success) {
      // Step 2: Get user details
      const userDetails = sdk.getUserDetails();
      console.log('User Details:', userDetails);
      
      // Step 3: Calculate fees
      const fees = sdk.calculateWithdrawalFees(100);
      console.log('Fees:', fees);
      
      // Step 4: Handle withdrawal
      const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
      
      if (withdrawal.success) {
        // Step 5: WPS validation
        const wpsCallback = withdrawal.wpsCallback;
        const validation = await wpsCallback.validateUser({
          method: 'emiratesId',
          value: '784-1968-6570305-0'
        });
        
        if (validation.success) {
          // Step 6: Process withdrawal
          const processing = await wpsCallback.processWithdrawal(validation);
          console.log('Transaction completed:', processing.receipt);
        }
      }
    }
  } catch (error) {
    console.error('PeyDey flow error:', error);
  }
}

// Execute the flow
handlePeyDeyFlow();
```

### **React Integration**

```jsx
import React, { useState, useEffect } from 'react';
import { PeyDeySDK } from 'peydey-sdk';

function PeyDeyIntegration() {
  const [sdk] = useState(() => new PeyDeySDK({ debug: true }));
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (emiratesId, phoneNumber) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await sdk.onboardUser({ emiratesId, phoneNumber });
      
      if (result.success) {
        const details = sdk.getUserDetails();
        setUserData(details.userData);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (amount) => {
    try {
      const fees = sdk.calculateWithdrawalFees(amount);
      const withdrawal = await sdk.handleWithdrawalRequest(amount, 'salary');
      
      if (withdrawal.success) {
        // Handle WPS integration
        const wpsCallback = withdrawal.wpsCallback;
        const validation = await wpsCallback.validateUser({
          method: 'emiratesId',
          value: userData.emiratesId
        });
        
        if (validation.success) {
          const processing = await wpsCallback.processWithdrawal(validation);
          console.log('Withdrawal successful:', processing.receipt);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="peydey-integration">
      {!userData ? (
        <LoginForm onLogin={handleLogin} loading={loading} />
      ) : (
        <UserDashboard 
          userData={userData} 
          onWithdrawal={handleWithdrawal}
          onLogout={() => {
            sdk.exitSDK();
            setUserData(null);
          }}
        />
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function LoginForm({ onLogin, loading }) {
  const [emiratesId, setEmiratesId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(emiratesId, phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Emirates ID"
        value={emiratesId}
        onChange={(e) => setEmiratesId(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number (+971...)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

function UserDashboard({ userData, onWithdrawal, onLogout }) {
  const [amount, setAmount] = useState(100);

  return (
    <div className="dashboard">
      <h2>Welcome, {userData.name}!</h2>
      <div className="user-info">
        <p>Employer: {userData.employerName}</p>
        <p>Available Balance: {userData.limits.availableBalance} AED</p>
      </div>
      
      <div className="withdrawal-form">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="1"
          max={userData.limits.availableBalance}
        />
        <button onClick={() => onWithdrawal(amount)}>
          Withdraw {amount} AED
        </button>
      </div>
      
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default PeyDeyIntegration;
```

### **Vue.js Integration**

```vue
<template>
  <div class="peydey-integration">
    <div v-if="!userData" class="login-form">
      <h2>PeyDey Login</h2>
      <form @submit.prevent="handleLogin">
        <input
          v-model="credentials.emiratesId"
          type="text"
          placeholder="Emirates ID"
          required
        />
        <input
          v-model="credentials.phoneNumber"
          type="tel"
          placeholder="Phone Number (+971...)"
          required
        />
        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>

    <div v-else class="dashboard">
      <h2>Welcome, {{ userData.name }}!</h2>
      <div class="user-info">
        <p>Employer: {{ userData.employerName }}</p>
        <p>Available Balance: {{ userData.limits.availableBalance }} AED</p>
      </div>
      
      <div class="withdrawal-form">
        <input
          v-model.number="withdrawalAmount"
          type="number"
          min="1"
          :max="userData.limits.availableBalance"
        />
        <button @click="handleWithdrawal">
          Withdraw {{ withdrawalAmount }} AED
        </button>
      </div>
      
      <button @click="handleLogout">Logout</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { PeyDeySDK } from 'peydey-sdk';

export default {
  name: 'PeyDeyIntegration',
  data() {
    return {
      sdk: new PeyDeySDK({ debug: true }),
      credentials: {
        emiratesId: '',
        phoneNumber: ''
      },
      userData: null,
      withdrawalAmount: 100,
      loading: false,
      error: null
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;
      
      try {
        const result = await this.sdk.onboardUser(this.credentials);
        
        if (result.success) {
          const details = this.sdk.getUserDetails();
          this.userData = details.userData;
        } else {
          this.error = result.error;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    
    async handleWithdrawal() {
      try {
        const fees = this.sdk.calculateWithdrawalFees(this.withdrawalAmount);
        const withdrawal = await this.sdk.handleWithdrawalRequest(
          this.withdrawalAmount, 
          'salary'
        );
        
        if (withdrawal.success) {
          const wpsCallback = withdrawal.wpsCallback;
          const validation = await wpsCallback.validateUser({
            method: 'emiratesId',
            value: this.userData.emiratesId
          });
          
          if (validation.success) {
            const processing = await wpsCallback.processWithdrawal(validation);
            console.log('Withdrawal successful:', processing.receipt);
          }
        }
      } catch (err) {
        this.error = err.message;
      }
    },
    
    handleLogout() {
      this.sdk.exitSDK();
      this.userData = null;
    }
  }
};
</script>
```

### **Angular Integration**

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

  async onboardUser(emiratesId: string, phoneNumber: string) {
    try {
      const result = await this.sdk.onboardUser({ emiratesId, phoneNumber });
      
      if (result.success) {
        return this.sdk.getUserDetails();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  }

  calculateFees(amount: number) {
    return this.sdk.calculateWithdrawalFees(amount);
  }

  async handleWithdrawal(amount: number) {
    try {
      const withdrawal = await this.sdk.handleWithdrawalRequest(amount, 'salary');
      
      if (withdrawal.success) {
        const wpsCallback = withdrawal.wpsCallback;
        const validation = await wpsCallback.validateUser({
          method: 'emiratesId',
          value: '784-1968-6570305-0'
        });
        
        if (validation.success) {
          return await wpsCallback.processWithdrawal(validation);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.sdk.exitSDK();
  }
}

// peydey.component.ts
import { Component } from '@angular/core';
import { PeyDeyService } from './peydey.service';

@Component({
  selector: 'app-peydey',
  template: `
    <div class="peydey-integration">
      <div *ngIf="!userData" class="login-form">
        <h2>PeyDey Login</h2>
        <form (ngSubmit)="handleLogin()">
          <input
            [(ngModel)]="credentials.emiratesId"
            name="emiratesId"
            type="text"
            placeholder="Emirates ID"
            required
          />
          <input
            [(ngModel)]="credentials.phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number (+971...)"
            required
          />
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>

      <div *ngIf="userData" class="dashboard">
        <h2>Welcome, {{ userData.name }}!</h2>
        <div class="user-info">
          <p>Employer: {{ userData.employerName }}</p>
          <p>Available Balance: {{ userData.limits.availableBalance }} AED</p>
        </div>
        
        <div class="withdrawal-form">
          <input
            [(ngModel)]="withdrawalAmount"
            type="number"
            min="1"
            [max]="userData.limits.availableBalance"
          />
          <button (click)="handleWithdrawal()">
            Withdraw {{ withdrawalAmount }} AED
          </button>
        </div>
        
        <button (click)="handleLogout()">Logout</button>
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>
    </div>
  `
})
export class PeyDeyComponent {
  credentials = { emiratesId: '', phoneNumber: '' };
  userData: any = null;
  withdrawalAmount = 100;
  loading = false;
  error: string | null = null;

  constructor(private peydeyService: PeyDeyService) {}

  async handleLogin() {
    this.loading = true;
    this.error = null;
    
    try {
      const result = await this.peydeyService.onboardUser(
        this.credentials.emiratesId,
        this.credentials.phoneNumber
      );
      this.userData = result.userData;
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  async handleWithdrawal() {
    try {
      const result = await this.peydeyService.handleWithdrawal(this.withdrawalAmount);
      console.log('Withdrawal successful:', result.receipt);
    } catch (err: any) {
      this.error = err.message;
    }
  }

  handleLogout() {
    this.peydeyService.logout();
    this.userData = null;
  }
}
```

### **Node.js Backend Integration**

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

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  const session = sdk.userSession.getSession();
  if (!session.isAuthenticated) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Routes
app.post('/api/peydey/login', async (req, res) => {
  try {
    const { emiratesId, phoneNumber } = req.body;
    
    const result = await sdk.onboardUser({ emiratesId, phoneNumber });
    
    if (result.success) {
      res.json({
        success: true,
        userData: result.userData,
        sessionId: result.sessionId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        code: result.code
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/peydey/user-details', requireAuth, (req, res) => {
  try {
    const details = sdk.getUserDetails();
    res.json(details);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user details'
    });
  }
});

app.get('/api/peydey/transaction-history', requireAuth, (req, res) => {
  try {
    const history = sdk.getTransactionHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get transaction history'
    });
  }
});

app.post('/api/peydey/calculate-fees', requireAuth, (req, res) => {
  try {
    const { amount } = req.body;
    const fees = sdk.calculateWithdrawalFees(amount);
    res.json(fees);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fees'
    });
  }
});

app.post('/api/peydey/withdrawal-request', requireAuth, async (req, res) => {
  try {
    const { amount, type = 'salary' } = req.body;
    
    const result = await sdk.handleWithdrawalRequest(amount, type);
    
    if (result.success) {
      res.json({
        success: true,
        withdrawalRequest: result.withdrawalRequest,
        message: 'Withdrawal request created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        code: result.code
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create withdrawal request'
    });
  }
});

app.post('/api/peydey/wps-validation', requireAuth, async (req, res) => {
  try {
    const { withdrawalRequestId, credentials } = req.body;
    
    // Get withdrawal request
    const withdrawal = sdk.withdrawalHandler.getWithdrawalStatus(withdrawalRequestId);
    
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        error: 'Withdrawal request not found'
      });
    }
    
    const wpsCallback = sdk.withdrawalHandler.createWPSCallback(withdrawal);
    const validation = await wpsCallback.validateUser(credentials);
    
    res.json(validation);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'WPS validation failed'
    });
  }
});

app.post('/api/peydey/wps-processing', requireAuth, async (req, res) => {
  try {
    const { withdrawalRequestId, validationResult } = req.body;
    
    const withdrawal = sdk.withdrawalHandler.getWithdrawalStatus(withdrawalRequestId);
    
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        error: 'Withdrawal request not found'
      });
    }
    
    const wpsCallback = sdk.withdrawalHandler.createWPSCallback(withdrawal);
    const processing = await wpsCallback.processWithdrawal(validationResult);
    
    res.json(processing);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'WPS processing failed'
    });
  }
});

app.post('/api/peydey/logout', requireAuth, (req, res) => {
  try {
    const result = sdk.exitSDK();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PeyDey API server running on port ${PORT}`);
});
```

### **Mobile App Integration (React Native)**

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

  // Initialize user session
  async initializeUser(emiratesId, phoneNumber) {
    try {
      const result = await this.sdk.onboardUser({ emiratesId, phoneNumber });
      
      if (result.success) {
        return {
          success: true,
          userData: result.userData,
          sessionId: result.sessionId
        };
      } else {
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user details
  getUserDetails() {
    try {
      return this.sdk.getUserDetails();
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get transaction history
  getTransactionHistory() {
    try {
      return this.sdk.getTransactionHistory();
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate withdrawal fees
  calculateFees(amount) {
    try {
      return this.sdk.calculateWithdrawalFees(amount);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle withdrawal request
  async handleWithdrawal(amount, type = 'salary') {
    try {
      const result = await this.sdk.handleWithdrawalRequest(amount, type);
      
      if (result.success) {
        return {
          success: true,
          withdrawalRequest: result.withdrawalRequest,
          wpsCallback: result.wpsCallback
        };
      } else {
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // WPS validation
  async validateWithWPS(wpsCallback, credentials) {
    try {
      const validation = await wpsCallback.validateUser(credentials);
      return validation;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // WPS processing
  async processWithWPS(wpsCallback, validationResult) {
    try {
      const processing = await wpsCallback.processWithdrawal(validationResult);
      return processing;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Logout
  logout() {
    try {
      const result = this.sdk.exitSDK();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new PeyDeySDKWrapper();
```

## 🔧 **Configuration Options**

### **SDK Configuration**

```javascript
const sdk = new PeyDeySDK({
  debug: true,                    // Enable debug logging
  wpsEndpoint: 'https://wps.peydey.ae', // WPS API endpoint
  currency: 'AED',                // Currency (default: AED)
  country: 'UAE',                 // Country (default: UAE)
  version: '1.0.0',              // SDK version
  timeout: 30000,                // Request timeout in ms
  retryAttempts: 3,              // Number of retry attempts
  logLevel: 'info'               // Log level: 'debug', 'info', 'warn', 'error'
});
```

### **Environment Variables**

```bash
# .env
PEYDEY_WPS_ENDPOINT=https://wps.peydey.ae
PEYDEY_DEBUG=true
PEYDEY_TIMEOUT=30000
PEYDEY_RETRY_ATTEMPTS=3
```

## 📱 **Platform-Specific Considerations**

### **Web Applications**
- Use ES modules or UMD builds
- Handle CORS and security headers
- Implement proper error handling for network issues

### **Mobile Applications**
- Use CommonJS or ES modules
- Handle offline scenarios
- Implement proper session management
- Use secure storage for sensitive data

### **Backend Services**
- Use CommonJS builds
- Implement proper authentication middleware
- Handle concurrent requests
- Use connection pooling for database operations

## 🚀 **Deployment**

### **Build for Production**

```bash
# Build the SDK
npm run build:sdk

# Build the demo app
npm run build

# The SDK will be available in the dist/ folder
```

### **Publish to NPM**

```bash
# Login to npm
npm login

# Publish the package
npm publish

# Update version and publish
npm version patch
npm publish
```

## 🔒 **Security Considerations**

1. **API Keys**: Store sensitive configuration in environment variables
2. **HTTPS**: Always use HTTPS in production
3. **Input Validation**: Validate all user inputs
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Session Management**: Use secure session handling
6. **Error Handling**: Don't expose sensitive information in error messages

## 📊 **Monitoring and Analytics**

```javascript
// SDK usage analytics
const stats = sdk.getStats();
console.log('SDK Usage Stats:', stats);

// Custom analytics integration
sdk.on('transaction_completed', (data) => {
  analytics.track('withdrawal_completed', {
    amount: data.amount,
    userId: data.userId,
    timestamp: new Date().toISOString()
  });
});
```

## 🤝 **Support and Community**

- **Documentation**: [https://github.com/peydey/peydey-sdk](https://github.com/peydey/peydey-sdk)
- **Issues**: [GitHub Issues](https://github.com/peydey/peydey-sdk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/peydey/peydey-sdk/discussions)
- **Email**: support@peydey.ae

---

**Happy integrating with PeyDey SDK! 🚀**
