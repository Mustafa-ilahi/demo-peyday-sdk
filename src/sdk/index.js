// Workforce SDK - Payment System Integration
// A comprehensive SDK for integrating with workforce payment systems

/**
 * UserSession Class
 * Manages user authentication state and session data
 */
export class UserSession {
  constructor() {
    this.session = null;
    this.isAuthenticated = false;
  }

  createSession(userData) {
    this.session = {
      id: userData.id || userData.emiratesId,
      phoneNumber: userData.phoneNumber,
      name: userData.name,
      employer: userData.employer,
      monthlySalary: userData.monthlySalary,
      earnedSalary: userData.earnedSalary,
      availableBalance: userData.availableBalance,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    this.isAuthenticated = true;
    return this.session;
  }

  getSession() {
    return this.session;
  }

  clearSession() {
    this.session = null;
    this.isAuthenticated = false;
  }

  isUserAuthenticated() {
    return this.isAuthenticated && this.session !== null;
  }
}

/**
 * UserEligibility Class
 * Handles eligibility checks and withdrawal limits
 */
export class UserEligibility {
  checkEligibility(userData) {
    const reasons = this.getIneligibilityReasons(userData);
    return {
      isEligible: reasons.length === 0,
      reasons: reasons
    };
  }

  getIneligibilityReasons(userData) {
    const reasons = [];

    if (!userData.id && !userData.emiratesId) {
      reasons.push('Missing identification');
    }

    if (!userData.phoneNumber) {
      reasons.push('Missing phone number');
    }

    if (!userData.employer) {
      reasons.push('Missing employer information');
    }

    if (!userData.monthlySalary || userData.monthlySalary <= 0) {
      reasons.push('Invalid monthly salary');
    }

    if (!userData.earnedSalary || userData.earnedSalary <= 0) {
      reasons.push('Invalid earned salary');
    }

    return reasons;
  }

  calculateLimits(userData) {
    const earnedSalary = userData.earnedSalary || 0;
    const availableBalance = Math.floor(earnedSalary * 0.25); // 25% of earned salary

    return {
      earnedSalary,
      availableBalance,
      maxWithdrawal: availableBalance
    };
  }

  calculateFees(amount, userData) {
    const earlyAccessFee = Math.floor(amount * 0.05); // 5% early access fee
    const vat = Math.floor(earlyAccessFee * 0.05); // 5% VAT on fee
    const totalFee = earlyAccessFee + vat;
    const youReceive = amount - totalFee;

    return {
      amount,
      earlyAccessFee,
      vat,
      totalFee,
      youReceive
    };
  }
}

/**
 * TransactionHistory Class
 * Manages transaction records
 */
export class TransactionHistory {
  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction) {
    const newTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...transaction,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  getTransactionHistory(userId, limit = 10) {
    return this.transactions
      .filter(txn => txn.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  updateTransactionStatus(transactionId, status) {
    const transaction = this.transactions.find(txn => txn.id === transactionId);
    if (transaction) {
      transaction.status = status;
      transaction.updatedAt = new Date().toISOString();
    }
    return transaction;
  }

  formatTransactionDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

/**
 * SystemIntegration Class
 * Payment system integration layer
 */
export class SystemIntegration {
  constructor(config = {}) {
    this.endpoint = config.endpoint || 'https://api.example.com';
    this.debug = config.debug || false;
  }

  async validateUser(credentials, withdrawalRequest) {
    if (this.debug) {
      console.log('[SystemIntegration] Validating user:', credentials);
    }

    // Simulate API call to payment system
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      isValid: true,
      userId: credentials.value,
      eligibility: 'eligible',
      limits: {
        maxWithdrawal: 1000,
        dailyLimit: 500
      }
    };
  }

  async checkEligibility(withdrawalRequest) {
    if (this.debug) {
      console.log('[SystemIntegration] Checking eligibility:', withdrawalRequest);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      isEligible: true,
      reason: 'User meets all eligibility criteria',
      limits: {
        maxWithdrawal: 1000,
        dailyLimit: 500
      }
    };
  }

  async processWithdrawal(withdrawalRequest, validationResult) {
    if (this.debug) {
      console.log('[SystemIntegration] Processing withdrawal:', withdrawalRequest);
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      transactionId: `wps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receipt: this.generateReceipt(withdrawalRequest),
      processedAt: new Date().toISOString()
    };
  }

  generateReceipt(withdrawalRequest) {
    const fees = this.calculateFees(withdrawalRequest.amount);
    
    return {
      receiptNumber: `RCP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: withdrawalRequest.amount,
      fees: fees,
      totalFee: fees.totalFee,
      youReceive: fees.youReceive,
      processedAt: new Date().toISOString(),
      status: 'completed'
    };
  }

  calculateFees(amount) {
    const earlyAccessFee = Math.floor(amount * 0.05);
    const vat = Math.floor(earlyAccessFee * 0.05);
    const totalFee = earlyAccessFee + vat;
    const youReceive = amount - totalFee;

    return {
      earlyAccessFee,
      vat,
      totalFee,
      youReceive
    };
  }
}

/**
 * WithdrawalHandler Class
 * Handles withdrawal requests and system integration
 */
export class WithdrawalHandler {
  constructor(systemIntegration) {
    this.systemIntegration = systemIntegration;
  }

  async initiateWithdrawal(userData, amount, type = 'salary') {
    const withdrawalRequest = {
      userId: userData.id || userData.emiratesId,
      amount: amount,
      type: type,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    const validation = await this.validateWithdrawalRequest(userData, amount);
    if (!validation.isValid) {
      throw new Error(validation.reason);
    }

    return {
      ...withdrawalRequest,
      callback: this.createCallback(withdrawalRequest)
    };
  }

  async validateWithdrawalRequest(userData, amount) {
    if (amount <= 0) {
      return { isValid: false, reason: 'Invalid withdrawal amount' };
    }

    if (amount > userData.availableBalance) {
      return { isValid: false, reason: 'Insufficient available balance' };
    }

    return { isValid: true, reason: 'Withdrawal request is valid' };
  }

  createCallback(withdrawalRequest) {
    return {
      validateUser: async (credentials) => {
        return await this.systemIntegration.validateUser(credentials, withdrawalRequest);
      },
      processWithdrawal: async (validationResult) => {
        return await this.systemIntegration.processWithdrawal(withdrawalRequest, validationResult);
      }
    };
  }
}

/**
 * Main Workforce SDK Class
 * Orchestrates the entire flow
 */
export class WorkforceSDK {
  constructor(config = {}) {
    this.config = {
      debug: config.debug || false,
      endpoint: config.endpoint || 'https://api.example.com',
      currency: config.currency || 'USD',
      country: config.country || 'US',
      version: config.version || '1.0.0'
    };

    this.userSession = new UserSession();
    this.userEligibility = new UserEligibility();
    this.transactionHistory = new TransactionHistory();
    this.systemIntegration = new SystemIntegration(this.config);
    this.withdrawalHandler = new WithdrawalHandler(this.systemIntegration);
  }

  /**
   * Step 1: Onboard user with ID
   */
  async onboardUser(credentials) {
    try {
      // Validate credentials
      const eligibility = this.userEligibility.checkEligibility(credentials);
      if (!eligibility.isEligible) {
        throw new Error(`User not eligible: ${eligibility.reasons.join(', ')}`);
      }

      // Calculate limits
      const limits = this.userEligibility.calculateLimits(credentials);
      
      // Create user session
      const userData = {
        ...credentials,
        ...limits
      };
      
      const session = this.userSession.createSession(userData);
      
      if (this.config.debug) {
        console.log(`[WorkforceSDK] User onboarded successfully:`, session);
      }

      return {
        success: true,
        user: session,
        message: 'User onboarded successfully'
      };
    } catch (error) {
      if (this.config.debug) {
        console.error(`[WorkforceSDK] Onboarding failed:`, error);
      }
      throw error;
    }
  }

  /**
   * Step 2: Display user information
   */
  getUserDetails() {
    if (!this.userSession.isUserAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const session = this.userSession.getSession();
    const limits = this.userEligibility.calculateLimits(session);

    return {
      ...session,
      ...limits,
      isAuthenticated: true
    };
  }

  /**
   * Step 3: Get balance and transactions
   */
  getTransactionHistory() {
    if (!this.userSession.isUserAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const session = this.userSession.getSession();
    const transactions = this.transactionHistory.getTransactionHistory(session.id);

    return {
      availableBalance: session.availableBalance,
      transactions: transactions,
      totalTransactions: transactions.length
    };
  }

  /**
   * Step 4: Calculate fees and VAT
   */
  calculateWithdrawalFees(amount) {
    if (!this.userSession.isUserAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const session = this.userSession.getSession();
    return this.userEligibility.calculateFees(amount, session);
  }

  /**
   * Step 5: Initiate withdrawal
   */
  async handleWithdrawalRequest(amount, type = 'salary') {
    if (!this.userSession.isUserAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const session = this.userSession.getSession();
    
    try {
      const withdrawal = await this.withdrawalHandler.initiateWithdrawal(session, amount, type);
      
      // Add to transaction history
      this.transactionHistory.addTransaction({
        userId: session.id,
        type: 'withdrawal',
        amount: amount,
        status: 'pending',
        withdrawalId: withdrawal.id
      });

      if (this.config.debug) {
        console.log(`[WorkforceSDK] Withdrawal initiated:`, withdrawal);
      }

      return withdrawal;
    } catch (error) {
      if (this.config.debug) {
        console.error(`[WorkforceSDK] Withdrawal failed:`, error);
      }
      throw error;
    }
  }

  /**
   * Exit and clear session
   */
  exitSDK() {
    this.userSession.clearSession();
    if (this.config.debug) {
      console.log(`[WorkforceSDK] SDK session cleared`);
    }
  }

  /**
   * Debug logging
   */
  log(message, data = null) {
    if (this.config.debug) {
      console.log(`[WorkforceSDK] ${message}`, data);
    }
  }
}

export default WorkforceSDK;
