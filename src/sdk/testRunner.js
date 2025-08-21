// Simple test runner for the PeyDey SDK
import { 
  UserSession, 
  UserEligibility, 
  TransactionHistory, 
  WithdrawalHandler, 
  WPSIntegration
} from './index.js';
import PeyDeySDK from './index.js';

class SimpleTestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  async runAllTests() {
    console.log('🧪 Running PeyDey SDK Tests...\n');
    
    // UserSession Tests
    await this.runUserSessionTests();
    
    // UserEligibility Tests
    await this.runUserEligibilityTests();
    
    // TransactionHistory Tests
    await this.runTransactionHistoryTests();
    
    // WPSIntegration Tests
    await this.runWPSIntegrationTests();
    
    // WithdrawalHandler Tests
    await this.runWithdrawalHandlerTests();
    
    // PeyDeySDK Integration Tests
    await this.runPeyDeySDKTests();
    
    // End-to-End Flow Tests
    await this.runEndToEndTests();
    
    // Error Handling Tests
    await this.runErrorHandlingTests();
    
    this.results.total = this.results.passed + this.results.failed;
    this.results.successRate = Math.round((this.results.passed / this.results.total) * 100);
    
    console.log(`\n📊 Test Results: ${this.results.passed}/${this.results.total} passed (${this.results.successRate}%)`);
    
    return this.results;
  }

  async runUserSessionTests() {
    console.log('🔐 Running UserSession Tests...');
    
    // Test 1: Create session
    try {
      const session = new UserSession();
      const userData = { id: 'user_001', name: 'Muhammad Abdul Majid' };
      const sessionId = session.createSession(userData);
      
      if (sessionId && session.isAuthenticated && session.userData === userData) {
        this.addResult('UserSession - Create session', true);
      } else {
        this.addResult('UserSession - Create session', false);
      }
    } catch (error) {
      this.addResult('UserSession - Create session', false, error.message);
    }

    // Test 2: Get session
    try {
      const session = new UserSession();
      const userData = { id: 'user_001', name: 'Muhammad Abdul Majid' };
      session.createSession(userData);
      const sessionInfo = session.getSession();
      
      if (sessionInfo.isAuthenticated && sessionInfo.userData === userData) {
        this.addResult('UserSession - Get session', true);
      } else {
        this.addResult('UserSession - Get session', false);
      }
    } catch (error) {
      this.addResult('UserSession - Get session', false, error.message);
    }

    // Test 3: Clear session
    try {
      const session = new UserSession();
      const userData = { id: 'user_001', name: 'Muhammad Abdul Majid' };
      session.createSession(userData);
      session.clearSession();
      
      if (!session.isAuthenticated && session.userData === null) {
        this.addResult('UserSession - Clear session', true);
      } else {
        this.addResult('UserSession - Clear session', false);
      }
    } catch (error) {
      this.addResult('UserSession - Clear session', false, error.message);
    }
  }

  async runUserEligibilityTests() {
    console.log('✅ Running UserEligibility Tests...');
    
    // Test 1: Check eligible user
    try {
      const eligibility = new UserEligibility();
      const userData = {
        monthlySalary: 3000,
        earnedSalary: 1500,
        accountAge: 45,
        hasActiveLoans: false,
        creditScore: 720
      };
      
      const result = eligibility.checkEligibility(userData);
      
      if (result.isEligible && result.limits.availableBalance === 375) {
        this.addResult('UserEligibility - Check eligible user', true);
      } else {
        this.addResult('UserEligibility - Check eligible user', false);
      }
    } catch (error) {
      this.addResult('UserEligibility - Check eligible user', false, error.message);
    }

    // Test 2: Check ineligible user
    try {
      const eligibility = new UserEligibility();
      const userData = {
        monthlySalary: 800,
        earnedSalary: 400,
        accountAge: 45,
        hasActiveLoans: false,
        creditScore: 720
      };
      
      const result = eligibility.checkEligibility(userData);
      
      if (!result.isEligible && result.reasons.length > 0) {
        this.addResult('UserEligibility - Check ineligible user', true);
      } else {
        this.addResult('UserEligibility - Check ineligible user', false);
      }
    } catch (error) {
      this.addResult('UserEligibility - Check ineligible user', false, error.message);
    }

    // Test 3: Calculate fees
    try {
      const eligibility = new UserEligibility();
      const userData = {
        monthlySalary: 3000,
        earnedSalary: 1500,
        accountAge: 45,
        hasActiveLoans: false,
        creditScore: 720
      };
      
      const fees = eligibility.calculateFees(100, userData);
      
      if (fees.earlyAccessFee === 5 && fees.vatAmount === 0.25 && fees.youReceive === 94.75) {
        this.addResult('UserEligibility - Calculate fees', true);
      } else {
        this.addResult('UserEligibility - Calculate fees', false);
      }
    } catch (error) {
      this.addResult('UserEligibility - Calculate fees', false, error.message);
    }
  }

  async runTransactionHistoryTests() {
    console.log('📊 Running TransactionHistory Tests...');
    
    // Test 1: Add transaction
    try {
      const history = new TransactionHistory();
      const transaction = {
        userId: 'user_001',
        amount: 100,
        type: 'withdrawal',
        status: 'completed'
      };
      
      const result = history.addTransaction(transaction);
      
      if (result.id && result.currency === 'AED' && result.status === 'pending') {
        this.addResult('TransactionHistory - Add transaction', true);
      } else {
        this.addResult('TransactionHistory - Add transaction', false);
      }
    } catch (error) {
      this.addResult('TransactionHistory - Add transaction', false, error.message);
    }

    // Test 2: Get transaction history
    try {
      const history = new TransactionHistory();
      const transaction1 = { userId: 'user_001', amount: 100, type: 'withdrawal' };
      const transaction2 = { userId: 'user_001', amount: 200, type: 'withdrawal' };
      
      history.addTransaction(transaction1);
      history.addTransaction(transaction2);
      
      const userHistory = history.getTransactionHistory('user_001');
      
      if (userHistory.length === 2 && userHistory[0].amount === 200) {
        this.addResult('TransactionHistory - Get transaction history', true);
      } else {
        this.addResult('TransactionHistory - Get transaction history', false);
      }
    } catch (error) {
      this.addResult('TransactionHistory - Get transaction history', false, error.message);
    }
  }

  async runWPSIntegrationTests() {
    console.log('🏦 Running WPSIntegration Tests...');
    
    // Test 1: Validate user with Emirates ID
    try {
      const wps = new WPSIntegration();
      const credentials = { method: 'emiratesId', value: '784-1968-6570305-0' };
      const withdrawalRequest = { id: 'wd_001', amount: 100 };
      
      const result = await wps.validateUser(credentials, withdrawalRequest);
      
      if (result.success && result.message === 'User validated successfully') {
        this.addResult('WPSIntegration - Validate user with Emirates ID', true);
      } else {
        this.addResult('WPSIntegration - Validate user with Emirates ID', false);
      }
    } catch (error) {
      this.addResult('WPSIntegration - Validate user with Emirates ID', false, error.message);
    }

    // Test 2: Reject invalid Emirates ID
    try {
      const wps = new WPSIntegration();
      const credentials = { method: 'emiratesId', value: 'invalid-id' };
      const withdrawalRequest = { id: 'wd_001', amount: 100 };
      
      const result = await wps.validateUser(credentials, withdrawalRequest);
      
      if (!result.success && result.error === 'User validation failed') {
        this.addResult('WPSIntegration - Reject invalid Emirates ID', true);
      } else {
        this.addResult('WPSIntegration - Reject invalid Emirates ID', false);
      }
    } catch (error) {
      this.addResult('WPSIntegration - Reject invalid Emirates ID', false, error.message);
    }

    // Test 3: Process withdrawal successfully
    try {
      const wps = new WPSIntegration();
      const withdrawalRequest = {
        id: 'wd_001',
        amount: 100,
        userData: {
          name: 'Muhammad Abdul Majid',
          emiratesId: '784-1968-6570305-0',
          employerName: 'Emirates NBD',
          wpsPartner: 'Alfardan Exchange'
        }
      };
      
      const validationResult = { success: true, eligibilityCheck: { isEligible: true } };
      
      const result = await wps.processWithdrawal(withdrawalRequest, validationResult);
      
      if (result.success && result.receipt.currency === 'AED') {
        this.addResult('WPSIntegration - Process withdrawal successfully', true);
      } else {
        this.addResult('WPSIntegration - Process withdrawal successfully', false);
      }
    } catch (error) {
      this.addResult('WPSIntegration - Process withdrawal successfully', false, error.message);
    }

    // Test 4: Reject withdrawal with failed validation
    try {
      const wps = new WPSIntegration();
      const withdrawalRequest = { id: 'wd_001', amount: 100 };
      const validationResult = { success: false, error: 'Validation failed' };
      
      const result = await wps.processWithdrawal(withdrawalRequest, validationResult);
      
      if (!result.success && result.error === 'Cannot process withdrawal - validation failed') {
        this.addResult('WPSIntegration - Reject withdrawal with failed validation', true);
      } else {
        this.addResult('WPSIntegration - Reject withdrawal with failed validation', false);
      }
    } catch (error) {
      this.addResult('WPSIntegration - Reject withdrawal with failed validation', false, error.message);
    }
  }

  async runWithdrawalHandlerTests() {
    console.log('💰 Running WithdrawalHandler Tests...');
    
    // Test 1: Initiate valid withdrawal
    try {
      const mockWPS = new WPSIntegration();
      const handler = new WithdrawalHandler(mockWPS);
      const userData = {
        id: 'user_001',
        limits: {
          availableBalance: 500,
          earnedSalary: 1500
        }
      };
      
      const result = handler.initiateWithdrawal(userData, 100, 'salary');
      
      if (result.success && result.withdrawalRequest.amount === 100 && result.withdrawalRequest.currency === 'AED') {
        this.addResult('WithdrawalHandler - Initiate valid withdrawal', true);
      } else {
        this.addResult('WithdrawalHandler - Initiate valid withdrawal', false);
      }
    } catch (error) {
      this.addResult('WithdrawalHandler - Initiate valid withdrawal', false, error.message);
    }

    // Test 2: Reject withdrawal exceeding available balance
    try {
      const mockWPS = new WPSIntegration();
      const handler = new WithdrawalHandler(mockWPS);
      const userData = {
        id: 'user_001',
        limits: {
          availableBalance: 100,
          earnedSalary: 1500
        }
      };
      
      const result = handler.initiateWithdrawal(userData, 200, 'salary');
      
      if (!result.success && result.code === 'EXCEEDS_BALANCE') {
        this.addResult('WithdrawalHandler - Reject withdrawal exceeding available balance', true);
      } else {
        this.addResult('WithdrawalHandler - Reject withdrawal exceeding available balance', false);
      }
    } catch (error) {
      this.addResult('WithdrawalHandler - Reject withdrawal exceeding available balance', false, error.message);
    }

    // Test 3: Reject withdrawal exceeding salary limit
    try {
      const mockWPS = new WPSIntegration();
      const handler = new WithdrawalHandler(mockWPS);
      const userData = {
        id: 'user_001',
        limits: {
          availableBalance: 500,
          earnedSalary: 1000
        }
      };
      
      const result = handler.initiateWithdrawal(userData, 300, 'salary');
      
      if (!result.success && result.code === 'EXCEEDS_SALARY_LIMIT') {
        this.addResult('WithdrawalHandler - Reject withdrawal exceeding salary limit', true);
      } else {
        this.addResult('WithdrawalHandler - Reject withdrawal exceeding salary limit', false);
      }
    } catch (error) {
      this.addResult('WithdrawalHandler - Reject withdrawal exceeding salary limit', false, error.message);
    }
  }

  async runPeyDeySDKTests() {
    console.log('🚀 Running PeyDeySDK Integration Tests...');
    
    // Test 1: Onboard user with Emirates ID
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      const result = await sdk.onboardUser(credentials);
      
      if (result.success && result.userData.name === 'Muhammad Abdul Majid') {
        this.addResult('PeyDeySDK - Onboard user with Emirates ID', true);
      } else {
        this.addResult('PeyDeySDK - Onboard user with Emirates ID', false);
      }
    } catch (error) {
      this.addResult('PeyDeySDK - Onboard user with Emirates ID', false, error.message);
    }

    // Test 2: Get user details after authentication
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      await sdk.onboardUser(credentials);
      const details = sdk.getUserDetails();
      
      if (details.success && details.userData.monthlySalary === 3000) {
        this.addResult('PeyDeySDK - Get user details after authentication', true);
      } else {
        this.addResult('PeyDeySDK - Get user details after authentication', false);
      }
    } catch (error) {
      this.addResult('PeyDeySDK - Get user details after authentication', false, error.message);
    }

    // Test 3: Get transaction history
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      await sdk.onboardUser(credentials);
      const history = sdk.getTransactionHistory();
      
      if (history.success && history.availableBalance === 375) {
        this.addResult('PeyDeySDK - Get transaction history', true);
      } else {
        this.addResult('PeyDeySDK - Get transaction history', false);
      }
    } catch (error) {
      this.addResult('PeyDeySDK - Get transaction history', false, error.message);
    }

    // Test 4: Calculate withdrawal fees
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      await sdk.onboardUser(credentials);
      const fees = sdk.calculateWithdrawalFees(100);
      
      if (fees.success && fees.fees.youReceive === 94.75) {
        this.addResult('PeyDeySDK - Calculate withdrawal fees', true);
      } else {
        this.addResult('PeyDeySDK - Calculate withdrawal fees', false);
      }
    } catch (error) {
      this.addResult('PeyDeySDK - Calculate withdrawal fees', false, error.message);
    }

    // Test 5: Handle withdrawal request
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      await sdk.onboardUser(credentials);
      const result = await sdk.handleWithdrawalRequest(100, 'salary');
      
      if (result.success && result.withdrawalRequest.currency === 'AED') {
        this.addResult('PeyDeySDK - Handle withdrawal request', true);
      } else {
        this.addResult('PeyDeySDK - Handle withdrawal request', false);
      }
    } catch (error) {
      this.addResult('PeyDeySDK - Handle withdrawal request', false, error.message);
    }
  }

  async runEndToEndTests() {
    console.log('🔄 Running End-to-End Flow Tests...');
    
    // Test 1: Complete full withdrawal flow
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      const onboardResult = await sdk.onboardUser(credentials);
      const userDetails = sdk.getUserDetails();
      const history = sdk.getTransactionHistory();
      const fees = sdk.calculateWithdrawalFees(100);
      const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
      
      const wpsCallback = withdrawal.wpsCallback;
      const validation = await wpsCallback.validateUser({
        method: 'emiratesId',
        value: '784-1968-6570305-0'
      });
      const processing = await wpsCallback.processWithdrawal(validation);
      
      if (onboardResult.success && userDetails.success && history.success && 
          fees.success && withdrawal.success && validation.success && processing.success) {
        this.addResult('End-to-End - Complete full withdrawal flow', true);
      } else {
        this.addResult('End-to-End - Complete full withdrawal flow', false);
      }
    } catch (error) {
      this.addResult('End-to-End - Complete full withdrawal flow', false, error.message);
    }

    // Test 2: Handle ineligible user flow
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      await sdk.onboardUser(credentials);
      const result = await sdk.handleWithdrawalRequest(1000, 'salary');
      
      if (!result.success && result.code === 'EXCEEDS_BALANCE') {
        this.addResult('End-to-End - Handle ineligible user flow', true);
      } else {
        this.addResult('End-to-End - Handle ineligible user flow', false);
      }
    } catch (error) {
      this.addResult('End-to-End - Handle ineligible user flow', false, error.message);
    }
  }

  async runErrorHandlingTests() {
    console.log('⚠️ Running Error Handling Tests...');
    
    // Test 1: Handle unauthenticated requests
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const details = sdk.getUserDetails();
      const history = sdk.getTransactionHistory();
      const fees = sdk.calculateWithdrawalFees(100);
      
      if (!details.success && !history.success && !fees.success &&
          details.code === 'NOT_AUTHENTICATED') {
        this.addResult('Error Handling - Handle unauthenticated requests', true);
      } else {
        this.addResult('Error Handling - Handle unauthenticated requests', false);
      }
    } catch (error) {
      this.addResult('Error Handling - Handle unauthenticated requests', false, error.message);
    }

    // Test 2: Handle withdrawal with insufficient balance
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      await sdk.onboardUser(credentials);
      const result = await sdk.handleWithdrawalRequest(1000, 'salary');
      
      if (!result.success && result.code === 'EXCEEDS_BALANCE') {
        this.addResult('Error Handling - Handle withdrawal with insufficient balance', true);
      } else {
        this.addResult('Error Handling - Handle withdrawal with insufficient balance', false);
      }
    } catch (error) {
      this.addResult('Error Handling - Handle withdrawal with insufficient balance', false, error.message);
    }

    // Test 3: Handle invalid WPS credentials
    try {
      const sdk = new PeyDeySDK({ debug: true });
      const credentials = {
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841'
      };
      
      await sdk.onboardUser(credentials);
      const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
      
      const validation = await withdrawal.wpsCallback.validateUser({
        method: 'password',
        value: 'wrong_password'
      });
      
      if (!validation.success && validation.code === 'VALIDATION_FAILED') {
        this.addResult('Error Handling - Handle invalid WPS credentials', true);
      } else {
        this.addResult('Error Handling - Handle invalid WPS credentials', false);
      }
    } catch (error) {
      this.addResult('Error Handling - Handle invalid WPS credentials', false, error.message);
    }
  }

  addResult(testName, passed, error = null) {
    if (passed) {
      this.results.passed++;
      console.log(`  ✅ ${testName}`);
    } else {
      this.results.failed++;
      console.log(`  ❌ ${testName}${error ? ` - ${error}` : ''}`);
    }
    
    this.results.details.push({
      test: testName,
      passed,
      error
    });
  }
}

export default SimpleTestRunner;
