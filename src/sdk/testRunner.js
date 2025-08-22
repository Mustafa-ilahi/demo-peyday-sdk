// Simple test runner for the Workforce SDK
// Run this file to execute all tests automatically

import WorkforceSDK from './index.js';

class TestRunner {
  constructor() {
    this.results = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  addResult(testName, passed, error = null) {
    this.totalTests++;
    if (passed) {
      this.passedTests++;
      console.log(`✅ ${testName}`);
    } else {
      this.failedTests++;
      console.log(`❌ ${testName}: ${error || 'Test failed'}`);
    }
    
    this.results.push({ testName, passed, error });
  }

  async runAllTests() {
    console.log('🧪 Running Workforce SDK Tests...\n');
    
    try {
      // UserSession Tests
      await this.runUserSessionTests();
      
      // UserEligibility Tests
      await this.runUserEligibilityTests();
      
      // TransactionHistory Tests
      await this.runTransactionHistoryTests();
      
      // SystemIntegration Tests
      await this.runSystemIntegrationTests();
      
      // WithdrawalHandler Tests
      await this.runWithdrawalHandlerTests();
      
      // WorkforceSDK Integration Tests
      await this.runWorkforceSDKTests();
      
      // End-to-End Tests
      await this.runEndToEndTests();
      
      // Error Handling Tests
      await this.runErrorHandlingTests();
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
    }
    
    this.printSummary();
  }

  async runUserSessionTests() {
    console.log('🔐 Running UserSession Tests...');
    
    try {
      const session = new UserSession();
      
      // Test 1: Create session
      const userData = { id: '123', phoneNumber: '+1234567890' };
      const result = session.createSession(userData);
      this.addResult('UserSession - Create session', !!result);
      
      // Test 2: Get session
      const retrieved = session.getSession();
      this.addResult('UserSession - Get session', !!retrieved);
      
      // Test 3: Clear session
      session.clearSession();
      this.addResult('UserSession - Clear session', !session.isUserAuthenticated());
      
    } catch (error) {
      this.addResult('UserSession - Test execution', false, error.message);
    }
  }

  async runUserEligibilityTests() {
    console.log('✅ Running UserEligibility Tests...');
    
    try {
      const eligibility = new UserEligibility();
      
      // Test 1: Check eligibility
      const userData = { id: '123', phoneNumber: '+1234567890', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      const result = eligibility.checkEligibility(userData);
      this.addResult('UserEligibility - Check eligibility', result.isEligible);
      
      // Test 2: Calculate limits
      const limits = eligibility.calculateLimits(userData);
      this.addResult('UserEligibility - Calculate limits', limits.availableBalance === 375);
      
      // Test 3: Calculate fees
      const fees = eligibility.calculateFees(100, userData);
      this.addResult('UserEligibility - Calculate fees', fees.totalFee > 0);
      
    } catch (error) {
      this.addResult('UserEligibility - Test execution', false, error.message);
    }
  }

  async runTransactionHistoryTests() {
    console.log('📊 Running TransactionHistory Tests...');
    
    try {
      const history = new TransactionHistory();
      
      // Test 1: Add transaction
      const transaction = { userId: '123', amount: 100, type: 'withdrawal' };
      const result = history.addTransaction(transaction);
      this.addResult('TransactionHistory - Add transaction', !!result.id);
      
      // Test 2: Get history
      const retrieved = history.getTransactionHistory('123');
      this.addResult('TransactionHistory - Get history', retrieved.length > 0);
      
    } catch (error) {
      this.addResult('TransactionHistory - Test execution', false, error.message);
    }
  }

  async runSystemIntegrationTests() {
    console.log('🏦 Running SystemIntegration Tests...');
    
    try {
      const integration = new SystemIntegration({ debug: false });
      
      // Test 1: Validate user
      const credentials = { method: 'id', value: '123' };
      const validation = await integration.validateUser(credentials, {});
      this.addResult('SystemIntegration - Validate user', validation.isValid);
      
      // Test 2: Check eligibility
      const eligibility = await integration.checkEligibility({});
      this.addResult('SystemIntegration - Check eligibility', eligibility.isEligible);
      
      // Test 3: Process withdrawal
      const processing = await integration.processWithdrawal({ amount: 100 }, {});
      this.addResult('SystemIntegration - Process withdrawal', processing.success);
      
      // Test 4: Generate receipt
      const receipt = integration.generateReceipt({ amount: 100 });
      this.addResult('SystemIntegration - Generate receipt', !!receipt.receiptNumber);
      
    } catch (error) {
      this.addResult('SystemIntegration - Test execution', false, error.message);
    }
  }

  async runWithdrawalHandlerTests() {
    console.log('💰 Running WithdrawalHandler Tests...');
    
    try {
      const integration = new SystemIntegration();
      const handler = new WithdrawalHandler(integration);
      
      // Test 1: Initiate withdrawal
      const userData = { id: '123', availableBalance: 500 };
      const withdrawal = await handler.initiateWithdrawal(userData, 100);
      this.addResult('WithdrawalHandler - Initiate withdrawal', !!withdrawal.callback);
      
      // Test 2: Validate withdrawal
      const validation = await handler.validateWithdrawalRequest(userData, 100);
      this.addResult('WithdrawalHandler - Validate withdrawal', validation.isValid);
      
      // Test 3: Create callback
      const callback = handler.createCallback({});
      this.addResult('WithdrawalHandler - Create callback', !!callback.validateUser);
      
    } catch (error) {
      this.addResult('WithdrawalHandler - Test execution', false, error.message);
    }
  }

  async runWorkforceSDKTests() {
    console.log('🚀 Running WorkforceSDK Integration Tests...');
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 1: Onboard user with ID
      const credentials = { id: '123', phoneNumber: '+1234567890', name: 'John Doe', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      const onboardResult = await sdk.onboardUser(credentials);
      this.addResult('WorkforceSDK - Onboard user with ID', onboardResult.success);
      
    } catch (error) {
      this.addResult('WorkforceSDK - Onboard user with ID', false, error.message);
    }
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 2: Get user details after authentication
      const credentials = { id: '123', phoneNumber: '+1234567890', name: 'John Doe', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      await sdk.onboardUser(credentials);
      const userDetails = sdk.getUserDetails();
      this.addResult('WorkforceSDK - Get user details after authentication', !!userDetails.name);
      
    } catch (error) {
      this.addResult('WorkforceSDK - Get user details after authentication', false, error.message);
    }
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 3: Get transaction history
      const credentials = { id: '123', phoneNumber: '+1234567890', name: 'John Doe', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      await sdk.onboardUser(credentials);
      const history = sdk.getTransactionHistory();
      this.addResult('WorkforceSDK - Get transaction history', !!history.availableBalance);
      
    } catch (error) {
      this.addResult('WorkforceSDK - Get transaction history', false, error.message);
    }
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 4: Calculate withdrawal fees
      const credentials = { id: '123', phoneNumber: '+1234567890', name: 'John Doe', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      await sdk.onboardUser(credentials);
      const fees = sdk.calculateWithdrawalFees(100);
      this.addResult('WorkforceSDK - Calculate withdrawal fees', fees.totalFee > 0);
      
    } catch (error) {
      this.addResult('WorkforceSDK - Calculate withdrawal fees', false, error.message);
    }
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 5: Handle withdrawal request
      const credentials = { id: '123', phoneNumber: '+1234567890', name: 'John Doe', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      await sdk.onboardUser(credentials);
      const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
      this.addResult('WorkforceSDK - Handle withdrawal request', !!withdrawal.callback);
      
    } catch (error) {
      this.addResult('WorkforceSDK - Handle withdrawal request', false, error.message);
    }
  }

  async runEndToEndTests() {
    console.log('🔄 Running End-to-End Tests...');
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 1: Complete user flow
      const credentials = { id: '123', phoneNumber: '+1234567890', name: 'John Doe', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      const onboardResult = await sdk.onboardUser(credentials);
      const userDetails = sdk.getUserDetails();
      const history = sdk.getTransactionHistory();
      const fees = sdk.calculateWithdrawalFees(100);
      const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
      
      this.addResult('End-to-End - Complete user flow', 
        onboardResult.success && 
        !!userDetails.name && 
        !!history.availableBalance && 
        fees.totalFee > 0 && 
        !!withdrawal.callback
      );
      
    } catch (error) {
      this.addResult('End-to-End - Complete user flow', false, error.message);
    }
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 2: WPS integration flow
      const credentials = { id: '123', phoneNumber: '+1234567890', name: 'John Doe', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      await sdk.onboardUser(credentials);
      const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
      
      const validation = await withdrawal.callback.validateUser({ method: 'id', value: '123' });
      const processing = await withdrawal.callback.processWithdrawal(validation);
      
      this.addResult('End-to-End - WPS integration flow', 
        validation.isValid && 
        processing.success
      );
      
    } catch (error) {
      this.addResult('End-to-End - WPS integration flow', false, error.message);
    }
  }

  async runErrorHandlingTests() {
    console.log('⚠️ Running Error Handling Tests...');
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 1: Invalid credentials
      try {
        await sdk.onboardUser({});
        this.addResult('Error Handling - Invalid credentials', false, 'Should have thrown error');
      } catch (error) {
        this.addResult('Error Handling - Invalid credentials', true);
      }
      
    } catch (error) {
      this.addResult('Error Handling - Invalid credentials', false, error.message);
    }
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 2: Unauthenticated access
      try {
        sdk.getUserDetails();
        this.addResult('Error Handling - Unauthenticated access', false, 'Should have thrown error');
      } catch (error) {
        this.addResult('Error Handling - Unauthenticated access', true);
      }
      
    } catch (error) {
      this.addResult('Error Handling - Unauthenticated access', false, error.message);
    }
    
    try {
      const sdk = new WorkforceSDK({ debug: true });
      
      // Test 3: Invalid withdrawal amount
      const credentials = { id: '123', phoneNumber: '+1234567890', name: 'John Doe', employer: 'Test Corp', monthlySalary: 3000, earnedSalary: 1500 };
      await sdk.onboardUser(credentials);
      
      try {
        await sdk.handleWithdrawalRequest(0, 'salary');
        this.addResult('Error Handling - Invalid withdrawal amount', false, 'Should have thrown error');
      } catch (error) {
        this.addResult('Error Handling - Invalid withdrawal amount', true);
      }
      
    } catch (error) {
      this.addResult('Error Handling - Invalid withdrawal amount', false, error.message);
    }
  }

  printSummary() {
    console.log('\n📊 Test Summary');
    console.log('================');
    console.log(`Total Tests: ${this.totalTests}`);
    console.log(`✅ Passed: ${this.passedTests}`);
    console.log(`❌ Failed: ${this.failedTests}`);
    console.log(`Success Rate: ${Math.round((this.passedTests / this.totalTests) * 100)}%`);
    
    if (this.failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`  - ${r.testName}: ${r.error || 'Test failed'}`));
    }
    
    console.log('\n🎉 Test execution completed!');
  }
}

// Auto-run tests when imported
const runner = new TestRunner();
runner.runAllTests();

export default TestRunner;
