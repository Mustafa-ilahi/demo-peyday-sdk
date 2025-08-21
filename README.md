# 🏦 PeyDey SDK

**UAE Workforce Payment System Integration SDK**

A comprehensive JavaScript SDK for integrating with the UAE Workforce Payment System (WPS), designed to match the exact flow and design from your PeyDey mobile application screens.

## 🇦🇪 **Features**

- **UAE-Specific Authentication**: Emirates ID and UAE phone number support
- **Mobile-First Design**: Beautiful, responsive interface matching your app screens
- **Complete Flow Implementation**: 7-step process from onboarding to withdrawal completion
- **WPS Integration**: Seamless integration with UAE Workforce Payment System
- **Fee Calculation**: Automatic early access fees and 5% VAT calculation
- **Transaction Management**: Full transaction history and balance tracking
- **Comprehensive Testing**: 25 automated tests covering all functionality
- **Modern UI/UX**: Beautiful gradients, animations, and mobile-responsive design

## 🏗️ **Architecture Overview**

The PeyDey SDK follows the exact flow from your mobile screens:

1. **🔐 Get Started**: Emirates ID and phone number authentication
2. **👤 Welcome to PeyDey**: User profile, employer info, and financial summary
3. **📊 Transaction History**: Available balance and transaction list
4. **💰 Get Paid**: Amount selection with fee breakdown (5% fee + 5% VAT)
5. **🔒 WPS Validation**: WPS validates user and checks eligibility
6. **⚙️ WPS Processing**: WPS processes withdrawal and generates receipt
7. **🎉 Success**: Show receipt and return to dashboard option

## 🇦🇪 **UAE-Specific Features**

- **Emirates ID Authentication**: Primary identification method
- **UAE Phone Numbers**: +971 format support
- **AED Currency**: All amounts in UAE Dirhams
- **VAT Calculation**: 5% VAT on early access fees
- **WPS Integration**: UAE Workforce Payment System
- **Employer Partnerships**: Emirates NBD, Alfardan Exchange

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
npm install peydey-sdk
```

#### 2. **CDN (Browser)**
```html
<script src="https://unpkg.com/peydey-sdk@1.0.0/dist/index.umd.js"></script>
```

#### 3. **Direct Import**
```bash
git clone https://github.com/peydey/peydey-sdk.git
cd peydey-sdk
npm install
npm run build:sdk
```

### Basic Usage

```javascript
import PeyDeySDK from './sdk/index.js';

// Initialize SDK
const sdk = new PeyDeySDK({ debug: true });

// Step 1: Onboard user with Emirates ID
const credentials = {
  emiratesId: '784-1968-6570305-0',
  phoneNumber: '+971523213841'
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

// Step 6: WPS validation
const wpsCallback = withdrawal.wpsCallback;
const validation = await wpsCallback.validateUser({
  method: 'emiratesId',
  value: '784-1968-6570305-0'
});

// Step 7: WPS processing
const processing = await wpsCallback.processWithdrawal(validation);
```

## 🧪 **Testing**

### Interactive Demo

1. Open the app in your browser
2. Go to "SDK Flow Demo" tab
3. Follow the 7-step flow:
   - Login with Emirates ID: `784-1968-6570305-0`
   - Phone: `+971523213841`
   - Navigate through each step
   - Test fee calculations
   - Complete WPS integration

### Automated Tests

1. Go to "Run Tests" tab
2. Click "🚀 Run All Tests"
3. View results for 25 comprehensive tests

### Test Coverage

- ✅ UserSession management (3 tests)
- ✅ UserEligibility checks (3 tests)
- ✅ TransactionHistory management (2 tests)
- ✅ WPSIntegration validation (4 tests)
- ✅ WithdrawalHandler processing (3 tests)
- ✅ PeyDeySDK integration (5 tests)
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

Handles UAE-specific eligibility checks and withdrawal limits:

```javascript
checkEligibility(userData)           // Check if user is eligible for withdrawals
getIneligibilityReasons(userData)    // Get reasons why user is ineligible
calculateLimits(userData)            // Calculate available balance based on earned salary
calculateFees(amount, userData)      // Calculate early access fees and VAT
```

### 📊 TransactionHistory Class

Manages UAE transaction records with AED currency:

```javascript
addTransaction(transaction)                    // Add new transaction
getTransactionHistory(userId, limit)          // Get user's transaction history
updateTransactionStatus(transactionId, status) // Update transaction status
formatTransactionDate(timestamp)              // Format dates for UAE display
```

### 💰 WithdrawalHandler Class

Handles PeyDey withdrawal requests and WPS integration:

```javascript
initiateWithdrawal(userData, amount, type)    // Create withdrawal request
validateWithdrawalRequest(userData, amount)   // Validate withdrawal parameters
createWPSCallback(withdrawalRequest)          // Create WPS integration callback
```

### 🏦 WPSIntegration Class

UAE Workforce Payment System integration layer:

```javascript
validateUser(credentials, withdrawalRequest)      // Validate user with WPS
checkWPSEligibility(withdrawalRequest)           // Check eligibility on WPS side
processWithdrawal(withdrawalRequest, validationResult) // Process withdrawal through WPS
generateReceipt(withdrawalRequest)               // Generate UAE transaction receipt
```

### 🚀 PeyDeySDK Class

Main SDK class orchestrating the entire UAE flow:

```javascript
onboardUser(credentials)              // Step 1: Emirates ID authentication
getUserDetails()                      // Step 2: Display user information
getTransactionHistory()               // Step 3: Get balance and transactions
calculateWithdrawalFees(amount)      // Step 4: Calculate fees and VAT
handleWithdrawalRequest(amount, type) // Step 5: Initiate withdrawal
exitSDK()                            // Exit and clear session
```

## 🔄 **WPS Callback Flow**

The SDK exposes callbacks to WPS for their side of logic:

- **validateUser**: WPS validates Emirates ID and eligibility
- **processWithdrawal**: WPS processes the withdrawal and generates receipt
- **Return to Dashboard**: After successful processing, user returns to main interface

## ⚙️ **Configuration**

SDK can be configured with various UAE-specific options:

```javascript
const sdk = new PeyDeySDK({
  debug: true,                    // Enable/disable debug logging
  wpsEndpoint: 'https://wps.peydey.ae', // WPS API endpoint URL
  currency: 'AED',                // Currency (default: AED)
  country: 'UAE',                 // Country (default: UAE)
  version: '1.0.0'               // SDK version string
});
```

## 🎨 **UI Components**

### Mobile-First Design

- **Responsive Layout**: Works perfectly on all device sizes
- **Beautiful Gradients**: Modern purple-blue gradient theme
- **Smooth Animations**: Hover effects and transitions
- **UAE Elements**: Emirates ID fields, UAE flag, AED currency

### Interactive Elements

- **Step-by-Step Flow**: Clear navigation between 7 steps
- **Quick Amount Selection**: Pre-defined AED amounts (100, 250, 500, 750)
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

For testing purposes, the SDK includes mock UAE user data:

- **Emirates ID**: `784-1968-6570305-0`
- **Phone**: `+971523213841`
- **Name**: Muhammad Abdul Majid
- **Employer**: Emirates NBD
- **WPS Partner**: Alfardan Exchange
- **Monthly Salary**: 3,000 AED
- **Earned Salary**: 1,500 AED
- **Available Balance**: 375 AED (25% of earned salary)

## 🔗 **Integration with Other Systems**

The PeyDey SDK is designed for seamless integration with various platforms and systems:

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

## 📱 **Mobile App Integration**

The SDK is designed to integrate seamlessly with your PeyDey mobile application:

1. **Same Flow**: Identical 7-step process
2. **Same Calculations**: Exact fee and VAT calculations
3. **Same Validation**: Emirates ID and phone number validation
4. **Same WPS Integration**: Identical callback structure
5. **Same UI Elements**: Matching design and user experience

## 🌟 **What Makes This Special**

- **Exact Match**: Built to match your mobile screens pixel-perfectly
- **UAE-First**: Designed specifically for UAE workforce payment needs
- **Production Ready**: Comprehensive error handling and validation
- **Beautiful UI**: Modern, mobile-first design with smooth animations
- **Full Testing**: 25 automated tests ensure reliability
- **Documentation**: Complete API reference and examples
- **WPS Ready**: Seamless integration with UAE Workforce Payment System

## 📚 **Additional Resources**

- **Integration Steps Guide**: [INTEGRATION-STEPS.md](./INTEGRATION-STEPS.md) - **Step-by-step integration instructions**
- **Integration Guide**: [INTEGRATION.md](./INTEGRATION.md) - Comprehensive integration examples
- **Quick Start**: [examples/quick-start.js](./examples/quick-start.js) - Simple integration example
- **Integration Template**: [examples/integration-template.js](./examples/integration-template.js) - **Copy-paste integration template**
- **Integration Test**: [examples/integration-test.html](./examples/integration-test.html) - Browser-based testing
- **SDK Exposure Guide**: [EXPOSE-SDK.md](./EXPOSE-SDK.md) - **How to expose and distribute the SDK**
- **Exposure Script**: [scripts/expose-sdk.sh](./scripts/expose-sdk.sh) - **Automated SDK exposure script**

## 📄 **License**

This project is designed for PeyDey SDK integration and testing purposes.

---

**Built with ❤️ for the UAE Workforce Payment System**
