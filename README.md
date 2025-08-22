

A comprehensive JavaScript SDK for integrating with workforce payment systems, designed to provide a complete flow from onboarding to withdrawal completion.

## 🚀 **Features**

- **Authentication**: ID and phone number support
- **Mobile-First Design**: Beautiful, responsive interface
- **Complete Flow Implementation**: 7-step process from onboarding to withdrawal completion
- **Payment System Integration**: Seamless integration with workforce payment systems
- **Fee Calculation**: Automatic early access fees and VAT calculation
- **Transaction Management**: Full transaction history and balance tracking
- **Comprehensive Testing**: 25 automated tests covering all functionality
- **Modern UI/UX**: Beautiful gradients, animations, and mobile-responsive design

## 🏗️ **Architecture Overview**

The SDK follows a complete flow:

1. **🔐 Get Started**: ID and phone number authentication
2. **👤 Welcome**: User profile, employer info, and financial summary
3. **📊 Transaction History**: Available balance and transaction list
4. **💰 Get Paid**: Amount selection with fee breakdown
5. **🔒 Validation**: System validates user and checks eligibility
6. **⚙️ Processing**: System processes withdrawal and generates receipt
7. **🎉 Success**: Show receipt and return to dashboard option

## 💰 **Financial Calculations**

- **Available Balance**: 25% of earned salary
- **Early Access Fee**: 5% of withdrawal amount
- **VAT**: 5% on early access fee
- **Total Fee**: Early access fee + VAT
- **You Receive**: Requested amount - Total fee

## 🚀 **Quick Start**

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the SDK for distribution
npm run build:sdk
```

### **Integration Methods**

#### 1. **NPM Package (Recommended)**
```bash
npm install workforce-sdk
```

#### 2. **CDN (Browser)**
```html
<script src="https://unpkg.com/workforce-sdk@1.0.0/dist/index.umd.js"></script>
```

#### 3. **Direct Import**
```bash
git clone https://github.com/workforce/workforce-sdk.git
cd workforce-sdk
npm install
npm run build:sdk
```

### Basic Usage

```javascript
import WorkforceSDK from './sdk/index.js';

// Initialize SDK
const sdk = new WorkforceSDK({ debug: true });

// Step 1: Onboard user with ID
const credentials = {
  id: '123-4567-8901234-0',
  phoneNumber: '+1234567890'
};

const onboardResult = await sdk.onboardUser(credentials);

// Step 2: Get user details
const userDetails = sdk.getUserDetails();

// Step 3: Get transaction history
const history = sdk.getTransactionHistory();

// Step 4: Calculate fees
const fees = sdk.calculateWithdrawalFees(100);

// Step 5: Initiate withdrawal
const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');

// Step 6: System validation
const callback = withdrawal.callback;
const validation = await callback.validateUser({
  method: 'id',
  value: '123-4567-8901234-0'
});

// Step 7: System processing
const processing = await callback.processWithdrawal(validation);
```

## 🧪 **Testing**

### Interactive Demo

1. Open the app in your browser
2. Go to "SDK Flow Demo" tab
3. Follow the 7-step flow:
   - Login with ID: `123-4567-8901234-0`
   - Phone: `+1234567890`
   - Navigate through each step
   - Test fee calculations
   - Complete system integration

### Automated Tests

1. Go to "Run Tests" tab
2. Click "🚀 Run All Tests"
3. View results for 25 comprehensive tests

### Test Coverage

- ✅ UserSession management (3 tests)
- ✅ UserEligibility checks (3 tests)
- ✅ TransactionHistory management (2 tests)
- ✅ SystemIntegration validation (4 tests)
- ✅ WithdrawalHandler processing (3 tests)
- ✅ WorkforceSDK integration (5 tests)
- ✅ End-to-End flow testing (2 tests)
- ✅ Error handling scenarios (3 tests)

## 📚 **API Reference**

### 🔐 UserSession Class

Manages user authentication state and session data:

```javascript
createSession(userData)     // Create new user session
getSession()                // Get current session information
clearSession()              // Clear session and logout user
```

### ✅ UserEligibility Class

Handles eligibility checks and withdrawal limits:

```javascript
checkEligibility(userData)           // Check if user is eligible for withdrawals
getIneligibilityReasons(userData)    // Get reasons why user is ineligible
calculateLimits(userData)            // Calculate available balance based on earned salary
calculateFees(amount, userData)      // Calculate early access fees and VAT
```

### 📊 TransactionHistory Class

Manages transaction records:

```javascript
addTransaction(transaction)                    // Add new transaction
getTransactionHistory(userId, limit)          // Get user's transaction history
updateTransactionStatus(transactionId, status) // Update transaction status
formatTransactionDate(timestamp)              // Format dates for display
```

### 💰 WithdrawalHandler Class

Handles withdrawal requests and system integration:

```javascript
initiateWithdrawal(userData, amount, type)    // Create withdrawal request
validateWithdrawalRequest(userData, amount)   // Validate withdrawal parameters
createCallback(withdrawalRequest)             // Create system integration callback
```

### 🏦 SystemIntegration Class

Payment system integration layer:

```javascript
validateUser(credentials, withdrawalRequest)      // Validate user with system
checkEligibility(withdrawalRequest)               // Check eligibility on system side
processWithdrawal(withdrawalRequest, validationResult) // Process withdrawal through system
generateReceipt(withdrawalRequest)               // Generate transaction receipt
```

### 🚀 WorkforceSDK Class

Main SDK class orchestrating the entire flow:

```javascript
onboardUser(credentials)              // Step 1: ID authentication
getUserDetails()                      // Step 2: Display user information
getTransactionHistory()               // Step 3: Get balance and transactions
calculateWithdrawalFees(amount)      // Step 4: Calculate fees and VAT
handleWithdrawalRequest(amount, type) // Step 5: Initiate withdrawal
exitSDK()                            // Exit and clear session
```

## 🔄 **System Callback Flow**

The SDK exposes callbacks to the payment system for their side of logic:

- **validateUser**: System validates ID and eligibility
- **processWithdrawal**: System processes the withdrawal and generates receipt
- **Return to Dashboard**: After successful processing, user returns to main interface

## ⚙️ **Configuration**

SDK can be configured with various options:

```javascript
const sdk = new WorkforceSDK({
  debug: true,                    // Enable/disable debug logging
  endpoint: 'https://api.example.com', // API endpoint URL
  currency: 'USD',                // Currency (default: USD)
  country: 'US',                  // Country (default: US)
  version: '1.0.0'               // SDK version string
});
```

## 🎨 **UI Components**

### Mobile-First Design

- **Responsive Layout**: Works perfectly on all device sizes
- **Beautiful Gradients**: Modern purple-blue gradient theme
- **Smooth Animations**: Hover effects and transitions
- **Interactive Elements**: ID fields, currency display

### Interactive Elements

- **Step-by-Step Flow**: Clear navigation between 7 steps
- **Quick Amount Selection**: Pre-defined amounts (100, 250, 500, 750)
- **Real-time Fee Calculation**: Instant fee breakdown as you type
- **Progress Indicators**: Visual flow navigation
- **Success Receipts**: Beautiful transaction confirmation

## 🚀 **Development**

### Project Structure

```
src/
├── sdk/
│   ├── index.js              # Main SDK implementation
│   ├── testRunner.js         # Automated test runner
│   └── __tests__/
│       └── sdk.test.js       # Comprehensive test suite
├── App.jsx                   # Main React application
├── App.css                   # Beautiful styling
└── main.jsx                  # App entry point
```

### Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Network Access

The development server is configured to be accessible from other devices on your network:

```bash
# Local access
http://localhost:5173

# Network access (from other devices)
http://192.168.0.122:5173
```

## 🔧 **Mock Data**

For testing purposes, the SDK includes mock user data:

- **ID**: `123-4567-8901234-0`
- **Phone**: `+1234567890`
- **Name**: John Doe
- **Employer**: Example Corp
- **Partner**: Payment Partner
- **Monthly Salary**: 3,000 USD
- **Earned Salary**: 1,500 USD
- **Available Balance**: 375 USD (25% of earned salary)

## 🔗 **Integration with Other Systems**

The SDK is designed for seamless integration with various platforms and systems:

### **Frontend Frameworks**
- **React**: Full component integration with hooks
- **Vue.js**: Component-based integration
- **Angular**: Service-based integration
- **Vanilla JavaScript**: Direct SDK usage

### **Backend Systems**
- **Node.js**: Express.js API integration
- **Python**: Flask/Django integration
- **Java**: Spring Boot integration
- **PHP**: Laravel integration

### **Mobile Applications**
- **React Native**: Cross-platform mobile integration
- **Flutter**: Dart-based integration
- **Native iOS**: Swift/Objective-C integration
- **Native Android**: Java/Kotlin integration

### **Enterprise Systems**
- **Banking Platforms**: Core banking integration
- **Payment Gateways**: Payment processor integration
- **HR Systems**: Employee management integration
- **ERP Systems**: Enterprise resource planning integration

## 🌟 **What Makes This Special**

- **Complete Flow**: Built to handle the entire workforce payment process
- **Production Ready**: Comprehensive error handling and validation
- **Beautiful UI**: Modern, mobile-first design with smooth animations
- **Full Testing**: 25 automated tests ensure reliability
- **Documentation**: Complete API reference and examples
- **System Ready**: Seamless integration with payment systems

## 📚 **Additional Resources**

- **Integration Steps Guide**: [INTEGRATION-STEPS.md](./INTEGRATION-STEPS.md) - **Step-by-step integration instructions**
- **Integration Guide**: [INTEGRATION.md](./INTEGRATION.md) - Comprehensive integration examples
- **Quick Start**: [examples/quick-start.js](./examples/quick-start.js) - Simple integration example
- **Integration Template**: [examples/integration-template.js](./examples/integration-template.js) - **Copy-paste integration template**
- **Integration Test**: [examples/integration-test.html](./examples/integration-test.html) - Browser-based testing
- **SDK Exposure Guide**: [EXPOSE-SDK.md](./EXPOSE-SDK.md) - **How to expose and distribute the SDK**
- **Exposure Script**: [scripts/expose-sdk.sh](./scripts/expose-sdk.sh) - **Automated SDK exposure script**

## 📄 **License**

This project is designed for workforce payment SDK integration and testing purposes.

---

**Built with ❤️ for workforce payment systems**
