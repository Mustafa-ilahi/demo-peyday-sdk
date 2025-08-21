// Test suite for the PeyDey SDK
import { 
  UserSession, 
  UserEligibility, 
  TransactionHistory, 
  WithdrawalHandler, 
  WPSIntegration
} from '../index.js';
import PeyDeySDK from '../index.js';

// Mock console.log for testing
const originalConsoleLog = console.log;
let consoleOutput = [];

beforeEach(() => {
  consoleOutput = [];
  console.log = (...args) => consoleOutput.push(args.join(' '));
});

afterEach(() => {
  console.log = originalConsoleLog;
});

// UserSession Tests
describe('UserSession', () => {
  let session;

  beforeEach(() => {
    session = new UserSession();
  });

  test('should create session with user data', () => {
    const userData = { id: 'user_001', name: 'Muhammad Abdul Majid' };
    const sessionId = session.createSession(userData);
    
    expect(sessionId).toBeDefined();
    expect(session.isAuthenticated).toBe(true);
    expect(session.userData).toEqual(userData);
    expect(session.sessionId).toBe(sessionId);
  });

  test('should get session information', () => {
    const userData = { id: 'user_001', name: 'Muhammad Abdul Majid' };
    session.createSession(userData);
    
    const sessionInfo = session.getSession();
    expect(sessionInfo.isAuthenticated).toBe(true);
    expect(sessionInfo.userData).toEqual(userData);
    expect(sessionInfo.sessionId).toBeDefined();
  });

  test('should clear session', () => {
    const userData = { id: 'user_001', name: 'Muhammad Abdul Majid' };
    session.createSession(userData);
    
    session.clearSession();
    expect(session.isAuthenticated).toBe(false);
    expect(session.sessionId).toBe(null);
    expect(session.userData).toBe(null);
  });
});

// UserEligibility Tests
describe('UserEligibility', () => {
  let eligibility;

  beforeEach(() => {
    eligibility = new UserEligibility();
  });

  test('should check eligible user', () => {
    const userData = {
      monthlySalary: 3000,
      earnedSalary: 1500,
      accountAge: 45,
      hasActiveLoans: false,
      creditScore: 720
    };
    
    const result = eligibility.checkEligibility(userData);
    
    expect(result.isEligible).toBe(true);
    expect(result.reasons).toHaveLength(0);
    expect(result.limits.availableBalance).toBe(375); // 25% of 1500
  });

  test('should check ineligible user - low salary', () => {
    const userData = {
      monthlySalary: 800,
      earnedSalary: 400,
      accountAge: 45,
      hasActiveLoans: false,
      creditScore: 720
    };
    
    const result = eligibility.checkEligibility(userData);
    
    expect(result.isEligible).toBe(false);
    expect(result.reasons).toContain('Monthly salary below minimum requirement (AED 1000)');
  });

  test('should check ineligible user - new account', () => {
    const userData = {
      monthlySalary: 3000,
      earnedSalary: 1500,
      accountAge: 20,
      hasActiveLoans: false,
      creditScore: 720
    };
    
    const result = eligibility.checkEligibility(userData);
    
    expect(result.isEligible).toBe(false);
    expect(result.reasons).toContain('Account age below minimum requirement (30 days)');
  });

  test('should calculate fees correctly', () => {
    const userData = {
      monthlySalary: 3000,
      earnedSalary: 1500,
      accountAge: 45,
      hasActiveLoans: false,
      creditScore: 720
    };
    
    const fees = eligibility.calculateFees(100, userData);
    
    expect(fees.requestedAmount).toBe(100);
    expect(fees.earlyAccessFee).toBe(5); // 5% of 100
    expect(fees.vatAmount).toBe(0.25); // 5% of 5
    expect(fees.totalFee).toBe(5.25);
    expect(fees.youReceive).toBe(94.75);
  });
});

// TransactionHistory Tests
describe('TransactionHistory', () => {
  let history;

  beforeEach(() => {
    history = new TransactionHistory();
  });

  test('should add transaction', () => {
    const transaction = {
      userId: 'user_001',
      amount: 100,
      type: 'withdrawal',
      status: 'completed'
    };
    
    const result = history.addTransaction(transaction);
    
    expect(result.id).toBeDefined();
    expect(result.amount).toBe(100);
    expect(result.currency).toBe('AED');
    expect(result.status).toBe('pending');
  });

  test('should get transaction history', () => {
    const transaction1 = { userId: 'user_001', amount: 100, type: 'withdrawal' };
    const transaction2 = { userId: 'user_001', amount: 200, type: 'withdrawal' };
    
    history.addTransaction(transaction1);
    history.addTransaction(transaction2);
    
    const userHistory = history.getTransactionHistory('user_001');
    
    expect(userHistory).toHaveLength(2);
    expect(userHistory[0].amount).toBe(200); // Most recent first
  });

  test('should format transaction date', () => {
    const timestamp = '2025-02-16T10:30:00.000Z';
    const formattedDate = history.formatTransactionDate(timestamp);
    
    expect(formattedDate).toContain('February 16, 2025');
    expect(formattedDate).toContain('10:30');
  });
});

// WPSIntegration Tests
describe('WPSIntegration', () => {
  let wps;

  beforeEach(() => {
    wps = new WPSIntegration();
  });

  test('should validate user with Emirates ID', async () => {
    const credentials = { method: 'emiratesId', value: '784-1968-6570305-0' };
    const withdrawalRequest = { id: 'wd_001', amount: 100 };
    
    const result = await wps.validateUser(credentials, withdrawalRequest);
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('User validated successfully');
  });

  test('should reject invalid Emirates ID', async () => {
    const credentials = { method: 'emiratesId', value: 'invalid-id' };
    const withdrawalRequest = { id: 'wd_001', amount: 100 };
    
    const result = await wps.validateUser(credentials, withdrawalRequest);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('User validation failed');
  });

  test('should validate user with password', async () => {
    const credentials = { method: 'password', value: 'correct_password' };
    const withdrawalRequest = { id: 'wd_001', amount: 100 };
    
    const result = await wps.validateUser(credentials, withdrawalRequest);
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('User validated successfully');
  });

  test('should reject invalid password', async () => {
    const credentials = { method: 'password', value: 'wrong_password' };
    const withdrawalRequest = { id: 'wd_001', amount: 100 };
    
    const result = await wps.validateUser(credentials, withdrawalRequest);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('User validation failed');
  });

  test('should process withdrawal successfully', async () => {
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
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('Withdrawal processed successfully');
    expect(result.receipt).toBeDefined();
    expect(result.receipt.currency).toBe('AED');
  });

  test('should reject withdrawal with failed validation', async () => {
    const withdrawalRequest = { id: 'wd_001', amount: 100 };
    const validationResult = { success: false, error: 'Validation failed' };
    
    const result = await wps.processWithdrawal(withdrawalRequest, validationResult);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot process withdrawal - validation failed');
  });
});

// WithdrawalHandler Tests
describe('WithdrawalHandler', () => {
  let handler;
  let mockWPS;

  beforeEach(() => {
    mockWPS = new WPSIntegration();
    handler = new WithdrawalHandler(mockWPS);
  });

  test('should initiate valid withdrawal', () => {
    const userData = {
      id: 'user_001',
      limits: {
        availableBalance: 500,
        earnedSalary: 1500
      }
    };
    
    const result = handler.initiateWithdrawal(userData, 100, 'salary');
    
    expect(result.success).toBe(true);
    expect(result.withdrawalRequest.amount).toBe(100);
    expect(result.withdrawalRequest.currency).toBe('AED');
    expect(result.wpsCallback).toBeDefined();
  });

  test('should reject withdrawal exceeding available balance', () => {
    const userData = {
      id: 'user_001',
      limits: {
        availableBalance: 100,
        earnedSalary: 1500
      }
    };
    
    const result = handler.initiateWithdrawal(userData, 200, 'salary');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Amount exceeds available balance of AED 100');
    expect(result.code).toBe('EXCEEDS_BALANCE');
  });

  test('should reject withdrawal exceeding salary limit', () => {
    const userData = {
      id: 'user_001',
      limits: {
        availableBalance: 500,
        earnedSalary: 1000
      }
    };
    
    const result = handler.initiateWithdrawal(userData, 300, 'salary');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Amount exceeds 25% of earned salary limit');
    expect(result.code).toBe('EXCEEDS_SALARY_LIMIT');
  });
});

// PeyDeySDK Integration Tests
describe('PeyDeySDK', () => {
  let sdk;

  beforeEach(() => {
    sdk = new PeyDeySDK({ debug: true });
  });

  test('should onboard user with Emirates ID', async () => {
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    const result = await sdk.onboardUser(credentials);
    
    expect(result.success).toBe(true);
    expect(result.userData.name).toBe('Muhammad Abdul Majid');
    expect(result.userData.employerName).toBe('Emirates NBD');
    expect(result.userData.wpsPartner).toBe('Alfardan Exchange');
  });

  test('should reject invalid credentials', async () => {
    const credentials = {
      emiratesId: 'invalid-id',
      phoneNumber: '+971523213841'
    };
    
    const result = await sdk.onboardUser(credentials);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Authentication failed');
  });

  test('should get user details after authentication', async () => {
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    await sdk.onboardUser(credentials);
    const details = sdk.getUserDetails();
    
    expect(details.success).toBe(true);
    expect(details.userData.monthlySalary).toBe(3000);
    expect(details.userData.earnedSalary).toBe(1500);
    expect(details.userData.limits.availableBalance).toBe(375);
  });

  test('should get transaction history', async () => {
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    await sdk.onboardUser(credentials);
    const history = sdk.getTransactionHistory();
    
    expect(history.success).toBe(true);
    expect(history.availableBalance).toBe(375);
    expect(Array.isArray(history.transactions)).toBe(true);
  });

  test('should calculate withdrawal fees', async () => {
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    await sdk.onboardUser(credentials);
    const fees = sdk.calculateWithdrawalFees(100);
    
    expect(fees.success).toBe(true);
    expect(fees.fees.requestedAmount).toBe(100);
    expect(fees.fees.earlyAccessFee).toBe(5);
    expect(fees.fees.vatAmount).toBe(0.25);
    expect(fees.fees.totalFee).toBe(5.25);
    expect(fees.fees.youReceive).toBe(94.75);
  });

  test('should handle withdrawal request', async () => {
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    await sdk.onboardUser(credentials);
    const result = await sdk.handleWithdrawalRequest(100, 'salary');
    
    expect(result.success).toBe(true);
    expect(result.withdrawalRequest.amount).toBe(100);
    expect(result.withdrawalRequest.currency).toBe('AED');
    expect(result.wpsCallback).toBeDefined();
  });

  test('should exit SDK and clear session', async () => {
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    await sdk.onboardUser(credentials);
    const exitResult = sdk.exitSDK();
    
    expect(exitResult.success).toBe(true);
    expect(exitResult.message).toBe('Successfully exited SDK');
    
    const details = sdk.getUserDetails();
    expect(details.success).toBe(false);
    expect(details.error).toBe('User not authenticated');
  });
});

// End-to-End Flow Tests
describe('End-to-End Flow', () => {
  let sdk;

  beforeEach(() => {
    sdk = new PeyDeySDK({ debug: true });
  });

  test('should complete full withdrawal flow', async () => {
    // Step 1: Onboard user
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    const onboardResult = await sdk.onboardUser(credentials);
    expect(onboardResult.success).toBe(true);
    
    // Step 2: Get user details
    const userDetails = sdk.getUserDetails();
    expect(userDetails.success).toBe(true);
    expect(userDetails.canProceed).toBe(true);
    
    // Step 3: Get transaction history
    const history = sdk.getTransactionHistory();
    expect(history.success).toBe(true);
    expect(history.availableBalance).toBe(375);
    
    // Step 4: Calculate fees
    const fees = sdk.calculateWithdrawalFees(100);
    expect(fees.success).toBe(true);
    expect(fees.fees.youReceive).toBe(94.75);
    
    // Step 5: Initiate withdrawal
    const withdrawal = await sdk.handleWithdrawalRequest(100, 'salary');
    expect(withdrawal.success).toBe(true);
    
    // Step 6: WPS validation
    const wpsCallback = withdrawal.wpsCallback;
    const validation = await wpsCallback.validateUser({
      method: 'emiratesId',
      value: '784-1968-6570305-0'
    });
    expect(validation.success).toBe(true);
    
    // Step 7: WPS processing
    const processing = await wpsCallback.processWithdrawal(validation);
    expect(processing.success).toBe(true);
    expect(processing.receipt.currency).toBe('AED');
  });
});

// Error Handling Tests
describe('Error Handling', () => {
  let sdk;

  beforeEach(() => {
    sdk = new PeyDeySDK({ debug: true });
  });

  test('should handle unauthenticated requests', () => {
    const details = sdk.getUserDetails();
    expect(details.success).toBe(false);
    expect(details.code).toBe('NOT_AUTHENTICATED');
    
    const history = sdk.getTransactionHistory();
    expect(history.success).toBe(false);
    expect(history.code).toBe('NOT_AUTHENTICATED');
    
    const fees = sdk.calculateWithdrawalFees(100);
    expect(fees.success).toBe(false);
    expect(fees.code).toBe('NOT_AUTHENTICATED');
  });

  test('should handle withdrawal with insufficient balance', async () => {
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    };
    
    await sdk.onboardUser(credentials);
    const result = await sdk.handleWithdrawalRequest(1000, 'salary');
    
    expect(result.success).toBe(false);
    expect(result.code).toBe('EXCEEDS_BALANCE');
  });

  test('should handle invalid WPS credentials', async () => {
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
    
    expect(validation.success).toBe(false);
    expect(validation.code).toBe('VALIDATION_FAILED');
  });
});

export { 
  UserSession, 
  UserEligibility, 
  TransactionHistory, 
  WithdrawalHandler, 
  WPSIntegration
};
