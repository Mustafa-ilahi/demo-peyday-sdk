// 🚀 PeyDey SDK Integration Template
// Copy this file into your project and customize as needed

// ============================================================================
// STEP 1: Import the SDK
// ============================================================================
import { PeyDeySDK } from 'peydey-sdk';

// ============================================================================
// STEP 2: Initialize the SDK
// ============================================================================
const sdk = new PeyDeySDK({
  debug: true,                    // Set to false in production
  wpsEndpoint: 'https://wps.peydey.ae', // Your WPS endpoint
  currency: 'AED',                // Currency (default: AED)
  country: 'UAE'                  // Country (default: UAE)
});

// ============================================================================
// STEP 3: Core Integration Functions
// ============================================================================

/**
 * Authenticate user with Emirates ID and phone number
 * @param {string} emiratesId - User's Emirates ID
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object>} Authentication result
 */
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

/**
 * Get user details and eligibility information
 * @returns {Object} User details
 */
function getUserDetails() {
  try {
    const details = sdk.getUserDetails();
    
    if (details.success) {
      console.log('✅ User details retrieved');
      return details;
    } else {
      console.error('❌ Failed to get user details:', details.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user details:', error.message);
    return null;
  }
}

/**
 * Get user's transaction history and available balance
 * @returns {Object} Transaction history
 */
function getTransactionHistory() {
  try {
    const history = sdk.getTransactionHistory();
    
    if (history.success) {
      console.log('✅ Transaction history retrieved');
      return history;
    } else {
      console.error('❌ Failed to get transaction history:', history.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting transaction history:', error.message);
    return null;
  }
}

/**
 * Calculate withdrawal fees and VAT
 * @param {number} amount - Withdrawal amount in AED
 * @returns {Object} Fee breakdown
 */
function calculateFees(amount) {
  try {
    const fees = sdk.calculateWithdrawalFees(amount);
    
    if (fees.success) {
      console.log('✅ Fees calculated successfully');
      return fees;
    } else {
      console.error('❌ Failed to calculate fees:', fees.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error calculating fees:', error.message);
    return null;
  }
}

/**
 * Initiate a withdrawal request
 * @param {number} amount - Withdrawal amount in AED
 * @param {string} type - Withdrawal type (default: 'salary')
 * @returns {Promise<Object>} Withdrawal result
 */
async function initiateWithdrawal(amount, type = 'salary') {
  try {
    const withdrawal = await sdk.handleWithdrawalRequest(amount, type);
    
    if (withdrawal.success) {
      console.log('✅ Withdrawal request initiated');
      return withdrawal;
    } else {
      console.error('❌ Withdrawal request failed:', withdrawal.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error initiating withdrawal:', error.message);
    return null;
  }
}

/**
 * Validate user with WPS system
 * @param {Object} wpsCallback - WPS callback from withdrawal
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} Validation result
 */
async function validateWithWPS(wpsCallback, credentials) {
  try {
    const validation = await wpsCallback.validateUser(credentials);
    
    if (validation.success) {
      console.log('✅ WPS validation successful');
      return validation;
    } else {
      console.error('❌ WPS validation failed:', validation.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error during WPS validation:', error.message);
    return null;
  }
}

/**
 * Process withdrawal through WPS
 * @param {Object} wpsCallback - WPS callback from withdrawal
 * @param {Object} validationResult - Validation result
 * @returns {Promise<Object>} Processing result
 */
async function processWithWPS(wpsCallback, validationResult) {
  try {
    const processing = await wpsCallback.processWithdrawal(validationResult);
    
    if (processing.success) {
      console.log('✅ WPS processing successful');
      return processing;
    } else {
      console.error('❌ WPS processing failed:', processing.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error during WPS processing:', error.message);
    return null;
  }
}

/**
 * Complete PeyDey flow from start to finish
 * @param {string} emiratesId - User's Emirates ID
 * @param {string} phoneNumber - User's phone number
 * @param {number} amount - Withdrawal amount
 * @returns {Promise<Object>} Flow result
 */
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

/**
 * Logout user and cleanup session
 * @returns {Object} Logout result
 */
function logout() {
  try {
    const result = sdk.exitSDK();
    console.log('✅ Logout successful:', result.message);
    return result;
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    return null;
  }
}

/**
 * Check current session status
 * @returns {Object} Session status
 */
function checkSession() {
  try {
    const session = sdk.userSession.getSession();
    console.log('Session status:', session);
    return session;
  } catch (error) {
    console.error('❌ Session check error:', error.message);
    return null;
  }
}

// ============================================================================
// STEP 4: Usage Examples
// ============================================================================

// Example 1: Simple authentication
async function example1() {
  console.log('🔐 Example 1: User Authentication');
  
  const result = await authenticateUser('784-1968-6570305-0', '+971523213841');
  
  if (result) {
    console.log('User logged in:', result.userData.name);
    
    // Get user details
    const details = getUserDetails();
    console.log('Available balance:', details.userData.limits.availableBalance, 'AED');
    
    // Logout
    logout();
  }
}

// Example 2: Complete withdrawal flow
async function example2() {
  console.log('💳 Example 2: Complete Withdrawal Flow');
  
  const flowResult = await completePeyDeyFlow(
    '784-1968-6570305-0', 
    '+971523213841', 
    100
  );
  
  if (flowResult.success) {
    console.log('🎉 Withdrawal completed!');
    console.log('Receipt:', flowResult.receipt);
  } else {
    console.log('❌ Flow failed at step:', flowResult.step);
  }
}

// Example 3: Fee calculation
function example3() {
  console.log('💰 Example 3: Fee Calculation');
  
  const fees = calculateFees(200);
  
  if (fees) {
    console.log('Requested Amount:', fees.fees.requestedAmount, 'AED');
    console.log('Early Access Fee:', fees.fees.earlyAccessFee, 'AED');
    console.log('VAT (5%):', fees.fees.vatAmount, 'AED');
    console.log('Total Fee:', fees.fees.totalFee, 'AED');
    console.log('You Receive:', fees.fees.youReceive, 'AED');
  }
}

// ============================================================================
// STEP 5: Export Functions (for use in other modules)
// ============================================================================
export {
  sdk,
  authenticateUser,
  getUserDetails,
  getTransactionHistory,
  calculateFees,
  initiateWithdrawal,
  validateWithWPS,
  processWithWPS,
  completePeyDeyFlow,
  logout,
  checkSession,
  example1,
  example2,
  example3
};

// ============================================================================
// STEP 6: Auto-run examples (remove in production)
// ============================================================================
if (typeof window !== 'undefined') {
  // Browser environment
  window.PeyDeySDKTemplate = {
    example1,
    example2,
    example3,
    authenticateUser,
    getUserDetails,
    getTransactionHistory,
    calculateFees,
    initiateWithdrawal,
    completePeyDeyFlow,
    logout
  };
  
  console.log('🚀 PeyDey SDK Template loaded!');
  console.log('Run examples:');
  console.log('- PeyDeySDKTemplate.example1() - Authentication');
  console.log('- PeyDeySDKTemplate.example2() - Complete Flow');
  console.log('- PeyDeySDKTemplate.example3() - Fee Calculation');
} else {
  // Node.js environment
  console.log('🚀 PeyDey SDK Template loaded in Node.js!');
  console.log('Import the functions to use them in your application');
}

// ============================================================================
// STEP 7: Customization Notes
// ============================================================================
/*
CUSTOMIZE THIS TEMPLATE:

1. Update the WPS endpoint in the SDK initialization
2. Modify error handling to match your application's needs
3. Add logging to your preferred logging system
4. Integrate with your authentication system
5. Add your own business logic and validation
6. Customize the UI components for your design system
7. Add proper error boundaries and fallbacks
8. Implement retry logic for failed operations
9. Add analytics and monitoring
10. Configure for your production environment

TEST CREDENTIALS:
- Emirates ID: 784-1968-6570305-0
- Phone: +971523213841

These credentials work with the mock data in the SDK.
*/
