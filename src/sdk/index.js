// PeyDey SDK - UAE Workforce Payment System Integration

/**
 * User session management
 */
export class UserSession {
  constructor() {
    this.isAuthenticated = false;
    this.userData = null;
    this.sessionId = null;
  }

  createSession(userData) {
    this.userData = userData;
    this.isAuthenticated = true;
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return this.sessionId;
  }

  getSession() {
    return {
      sessionId: this.sessionId,
      isAuthenticated: this.isAuthenticated,
      userData: this.userData
    };
  }

  clearSession() {
    this.isAuthenticated = false;
    this.userData = null;
    this.sessionId = null;
  }
}

/**
 * UAE-specific user eligibility and limits management
 */
export class UserEligibility {
  constructor() {
    this.eligibilityRules = {
      minSalary: 1000, // AED
      maxWithdrawalPercent: 0.25, // 25% of earned salary
      minAccountAge: 30, // days
      earlyAccessFee: 0.05, // 5% fee
      vatRate: 0.05 // 5% VAT
    };
  }

  checkEligibility(userData) {
    const { monthlySalary, earnedSalary, accountAge, hasActiveLoans, creditScore } = userData;
    
    const isEligible = 
      monthlySalary >= this.eligibilityRules.minSalary &&
      accountAge >= this.eligibilityRules.minAccountAge &&
      !hasActiveLoans &&
      creditScore >= 650 &&
      earnedSalary > 0;

    return {
      isEligible,
      reasons: !isEligible ? this.getIneligibilityReasons(userData) : [],
      limits: this.calculateLimits(userData)
    };
  }

  getIneligibilityReasons(userData) {
    const reasons = [];
    const { monthlySalary, accountAge, hasActiveLoans, creditScore, earnedSalary } = userData;

    if (monthlySalary < this.eligibilityRules.minSalary) {
      reasons.push(`Monthly salary below minimum requirement (AED ${this.eligibilityRules.minSalary})`);
    }
    if (accountAge < this.eligibilityRules.minAccountAge) {
      reasons.push(`Account age below minimum requirement (${this.eligibilityRules.minAccountAge} days)`);
    }
    if (hasActiveLoans) {
      reasons.push('Active loans detected');
    }
    if (creditScore < 650) {
      reasons.push('Credit score below minimum requirement (650)');
    }
    if (earnedSalary <= 0) {
      reasons.push('No earned salary available');
    }

    return reasons;
  }

  calculateLimits(userData) {
    const { monthlySalary, earnedSalary, accountAge } = userData;
    const availableBalance = earnedSalary * this.eligibilityRules.maxWithdrawalPercent;
    
    return {
      monthlySalary,
      earnedSalary,
      availableBalance: Math.round(availableBalance * 100) / 100,
      maxWithdrawalPercent: this.eligibilityRules.maxWithdrawalPercent * 100,
      accountAge,
      earlyAccessFee: this.eligibilityRules.earlyAccessFee,
      vatRate: this.eligibilityRules.vatRate
    };
  }

  calculateFees(amount, userData) {
    const { earlyAccessFee, vatRate } = this.eligibilityRules;
    const earlyAccessFeeAmount = amount * earlyAccessFee;
    const vatAmount = earlyAccessFeeAmount * vatRate;
    const totalFee = earlyAccessFeeAmount + vatAmount;
    const youReceive = amount - totalFee;

    return {
      requestedAmount: amount,
      earlyAccessFee: Math.round(earlyAccessFeeAmount * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      totalFee: Math.round(totalFee * 100) / 100,
      youReceive: Math.round(youReceive * 100) / 100
    };
  }
}

/**
 * Transaction history management for UAE
 */
export class TransactionHistory {
  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction) {
    const newTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      currency: 'AED',
      ...transaction
    };
    
    this.transactions.unshift(newTransaction);
    return newTransaction;
  }

  getTransactionHistory(userId, limit = 10) {
    return this.transactions
      .filter(tx => tx.userId === userId)
      .slice(0, limit);
  }

  updateTransactionStatus(transactionId, status) {
    const transaction = this.transactions.find(tx => tx.id === transactionId);
    if (transaction) {
      transaction.status = status;
      transaction.updatedAt = new Date().toISOString();
    }
    return transaction;
  }

  formatTransactionDate(timestamp) {
    const date = new Date(timestamp);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }
}

/**
 * PeyDey withdrawal handling and WPS integration
 */
export class WithdrawalHandler {
  constructor(wpsIntegration) {
    this.wpsIntegration = wpsIntegration;
    this.withdrawalRequests = [];
  }

  initiateWithdrawal(userData, amount, withdrawalType = 'salary') {
    // Validate withdrawal request
    const validation = this.validateWithdrawalRequest(userData, amount);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
        code: validation.code
      };
    }

    // Create withdrawal request
    const withdrawalRequest = {
      id: `wd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userData.id,
      amount,
      withdrawalType,
      status: 'pending',
      timestamp: new Date().toISOString(),
      currency: 'AED',
      userData: {
        name: userData.name,
        emiratesId: userData.emiratesId,
        phoneNumber: userData.phoneNumber,
        employerName: userData.employerName,
        wpsPartner: userData.wpsPartner
      }
    };

    this.withdrawalRequests.push(withdrawalRequest);

    // Expose callback to WPS for their side of logic
    const wpsCallback = this.createWPSCallback(withdrawalRequest);
    
    return {
      success: true,
      withdrawalRequest,
      wpsCallback,
      message: 'Withdrawal request created. Proceed with WPS validation.'
    };
  }

  validateWithdrawalRequest(userData, amount) {
    const { availableBalance, earnedSalary } = userData.limits;
    
    if (amount <= 0) {
      return { isValid: false, error: 'Invalid withdrawal amount', code: 'INVALID_AMOUNT' };
    }
    
    if (amount > availableBalance) {
      return { 
        isValid: false, 
        error: `Amount exceeds available balance of AED ${availableBalance}`, 
        code: 'EXCEEDS_BALANCE' 
      };
    }

    if (amount > earnedSalary * 0.25) {
      return { 
        isValid: false, 
        error: 'Amount exceeds 25% of earned salary limit', 
        code: 'EXCEEDS_SALARY_LIMIT' 
      };
    }

    return { isValid: true };
  }

  createWPSCallback(withdrawalRequest) {
    return {
      requestId: withdrawalRequest.id,
      validateUser: async (credentials) => {
        return await this.wpsIntegration.validateUser(credentials, withdrawalRequest);
      },
      processWithdrawal: async (validationResult) => {
        return await this.wpsIntegration.processWithdrawal(withdrawalRequest, validationResult);
      }
    };
  }

  getWithdrawalStatus(requestId) {
    return this.withdrawalRequests.find(wd => wd.id === requestId);
  }
}

/**
 * UAE WPS Integration Layer
 */
export class WPSIntegration {
  constructor() {
    this.validationMethods = ['password', 'pin', 'emiratesId'];
    this.processingStatuses = ['pending', 'processing', 'completed', 'failed'];
  }

  async validateUser(credentials, withdrawalRequest) {
    const { method, value } = credentials;
    
    if (!this.validationMethods.includes(method)) {
      return {
        success: false,
        error: 'Invalid validation method',
        code: 'INVALID_METHOD'
      };
    }

    // Simulate WPS user validation
    const isValid = await this.performWPSValidation(method, value, withdrawalRequest);
    
    if (!isValid) {
      return {
        success: false,
        error: 'User validation failed',
        code: 'VALIDATION_FAILED'
      };
    }

    // Perform eligibility check on WPS side
    const eligibilityCheck = await this.checkWPSEligibility(withdrawalRequest);
    
    if (!eligibilityCheck.isEligible) {
      return {
        success: false,
        error: 'User not eligible for withdrawal',
        code: 'NOT_ELIGIBLE',
        reasons: eligibilityCheck.reasons
      };
    }

    return {
      success: true,
      message: 'User validated successfully',
      eligibilityCheck
    };
  }

  async performWPSValidation(method, value, withdrawalRequest) {
    // Simulate WPS validation logic
    await this.simulateWPSCall();
    
    // Mock validation - in real implementation, this would call WPS API
    if (method === 'emiratesId') {
      return value === '784-1968-6570305-0';
    } else if (method === 'password') {
      return value === 'correct_password';
    } else if (method === 'pin') {
      return value === '1234';
    }
    return false;
  }

  async checkWPSEligibility(withdrawalRequest) {
    // Simulate WPS eligibility check
    await this.simulateWPSCall();
    
    // Mock eligibility - in real implementation, this would call WPS API
    return {
      isEligible: true,
      reasons: [],
      wpsLimits: {
        dailyLimit: 5000,
        monthlyLimit: 20000,
        remainingDaily: 4500,
        remainingMonthly: 18000
      }
    };
  }

  async processWithdrawal(withdrawalRequest, validationResult) {
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Cannot process withdrawal - validation failed',
        code: 'VALIDATION_FAILED'
      };
    }

    // Simulate WPS withdrawal processing
    await this.simulateWPSCall();
    
    // Mock successful processing
    const receipt = this.generateReceipt(withdrawalRequest);
    
    return {
      success: true,
      message: 'Withdrawal processed successfully',
      receipt,
      status: 'completed',
      transactionId: `wps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  generateReceipt(withdrawalRequest) {
    return {
      receiptNumber: `RCP_${Date.now()}`,
      date: new Date().toISOString(),
      amount: withdrawalRequest.amount,
      currency: 'AED',
      user: withdrawalRequest.userData.name,
      emiratesId: withdrawalRequest.userData.emiratesId,
      employer: withdrawalRequest.userData.employerName,
      wpsPartner: withdrawalRequest.userData.wpsPartner,
      status: 'completed',
      message: 'Transaction is in process and will be completed shortly'
    };
  }

  async simulateWPSCall() {
    // Simulate network delay for WPS API calls
    return new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Main PeyDey SDK Class
 */
export class PeyDeySDK {
  constructor(config = {}) {
    this.config = {
      debug: false,
      version: '1.0.0',
      wpsEndpoint: config.wpsEndpoint || 'https://wps.peydey.ae',
      currency: 'AED',
      country: 'UAE',
      ...config
    };
    
    this.userSession = new UserSession();
    this.userEligibility = new UserEligibility();
    this.transactionHistory = new TransactionHistory();
    this.wpsIntegration = new WPSIntegration();
    this.withdrawalHandler = new WithdrawalHandler(this.wpsIntegration);
    
    this.calls = [];
  }

  // Step 1: Onboard / Login with Emirates ID
  async onboardUser(userCredentials) {
    try {
      // Simulate user authentication with Emirates ID
      const userData = await this.authenticateUser(userCredentials);
      
      if (!userData) {
        return {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_FAILED'
        };
      }

      // Create user session
      const sessionId = this.userSession.createSession(userData);
      
      this.log('User onboarded successfully', { userId: userData.id, sessionId });
      
      return {
        success: true,
        sessionId,
        userData,
        message: 'User onboarded successfully'
      };
    } catch (error) {
      this.log('Onboarding failed', { error: error.message });
      return {
        success: false,
        error: 'Onboarding failed',
        code: 'ONBOARDING_ERROR'
      };
    }
  }

  // Display user details (Welcome to PeyDey screen)
  getUserDetails() {
    const session = this.userSession.getSession();
    
    if (!session.isAuthenticated) {
      return {
        success: false,
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      };
    }

    const userData = session.userData;
    const eligibility = this.userEligibility.checkEligibility(userData);
    const transactionHistory = this.transactionHistory.getTransactionHistory(userData.id);

    this.log('User details retrieved', { userId: userData.id });

    return {
      success: true,
      userData: {
        ...userData,
        limits: eligibility.limits
      },
      eligibility,
      transactionHistory,
      canProceed: eligibility.isEligible
    };
  }

  // Get available balance and transaction history
  getTransactionHistory() {
    const session = this.userSession.getSession();
    
    if (!session.isAuthenticated) {
      return {
        success: false,
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      };
    }

    const userData = session.userData;
    const eligibility = this.userEligibility.checkEligibility(userData);
    const transactions = this.transactionHistory.getTransactionHistory(userData.id);

    return {
      success: true,
      availableBalance: eligibility.limits.availableBalance,
      transactions: transactions.map(tx => ({
        ...tx,
        formattedDate: this.transactionHistory.formatTransactionDate(tx.timestamp)
      }))
    };
  }

  // Calculate fees for withdrawal amount
  calculateWithdrawalFees(amount) {
    const session = this.userSession.getSession();
    
    if (!session.isAuthenticated) {
      return {
        success: false,
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      };
    }

    const userData = session.userData;
    const fees = this.userEligibility.calculateFees(amount, userData);

    return {
      success: true,
      fees
    };
  }

  // Handle withdrawal request (Get Paid screen)
  async handleWithdrawalRequest(amount, withdrawalType = 'salary') {
    const session = this.userSession.getSession();
    
    if (!session.isAuthenticated) {
      return {
        success: false,
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      };
    }

    const userData = session.userData;
    const eligibility = this.userEligibility.checkEligibility(userData);
    
    if (!eligibility.isEligible) {
      return {
        success: false,
        error: 'User not eligible for withdrawal',
        code: 'NOT_ELIGIBLE',
        reasons: eligibility.reasons
      };
    }

    // Add limits to userData for withdrawal validation
    userData.limits = eligibility.limits;

    // Initiate withdrawal
    const withdrawalResult = this.withdrawalHandler.initiateWithdrawal(userData, amount, withdrawalType);
    
    if (withdrawalResult.success) {
      this.log('Withdrawal request initiated', { 
        requestId: withdrawalResult.withdrawalRequest.id,
        amount,
        userId: userData.id
      });
    }

    return withdrawalResult;
  }

  // Exit SDK
  exitSDK() {
    this.userSession.clearSession();
    this.log('User exited SDK');
    return {
      success: true,
      message: 'Successfully exited SDK'
    };
  }

  // Utility methods
  log(message, data = {}) {
    if (this.config.debug) {
      console.log(`[PeyDeySDK] ${message}`, data);
    }
    this.calls.push({ 
      type: 'log', 
      message, 
      data, 
      timestamp: Date.now() 
    });
  }

  getCallHistory() {
    return this.calls;
  }

  clearHistory() {
    this.calls = [];
  }

  getStats() {
    return {
      totalCalls: this.calls.length,
      callTypes: this.calls.reduce((acc, call) => {
        acc[call.type] = (acc[call.type] || 0) + 1;
        return acc;
      }, {}),
      lastCall: this.calls[this.calls.length - 1]
    };
  }

  // Mock authentication method for UAE users
  async authenticateUser(credentials) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock user data - in real implementation, this would call your auth API
    const mockUsers = {
      '784-1968-6570305-0': {
        id: 'user_001',
        name: 'Muhammad Abdul Majid',
        emiratesId: '784-1968-6570305-0',
        phoneNumber: '+971523213841',
        email: 'muhammad@example.com',
        monthlySalary: 3000,
        earnedSalary: 1500,
        accountAge: 45,
        hasActiveLoans: false,
        creditScore: 720,
        employerName: 'Emirates NBD',
        wpsPartner: 'Alfardan Exchange',
        profilePicture: 'https://example.com/profile.jpg'
      }
    };

    const user = mockUsers[credentials.emiratesId];
    return user && credentials.phoneNumber === '+971523213841' ? user : null;
  }
}

// Default export
export default PeyDeySDK;
