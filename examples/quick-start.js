// 🚀 PeyDey SDK Quick Start Example
// This file shows the simplest way to integrate the PeyDey SDK

// Import the SDK
import { PeyDeySDK } from 'peydey-sdk';

// Initialize SDK with your configuration
const sdk = new PeyDeySDK({
  debug: true,                    // Enable debug logging
  wpsEndpoint: 'https://wps.peydey.ae', // Your WPS endpoint
  currency: 'AED',                // Currency (default: AED)
  country: 'UAE'                  // Country (default: UAE)
});

// 🔐 Step 1: User Authentication
async function authenticateUser(emiratesId, phoneNumber) {
  try {
    const result = await sdk.onboardUser({ emiratesId, phoneNumber });
    
    if (result.success) {
      console.log('✅ User authenticated successfully');
      console.log('User:', result.userData.name);
      console.log('Session ID:', result.sessionId);
      return true;
    } else {
      console.error('❌ Authentication failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return false;
  }
}

// 👤 Step 2: Get User Information
function getUserInformation() {
  try {
    const details = sdk.getUserDetails();
    
    if (details.success) {
      console.log('✅ User details retrieved');
      console.log('Monthly Salary:', details.userData.monthlySalary, 'AED');
      console.log('Available Balance:', details.userData.limits.availableBalance, 'AED');
      console.log('Eligible for withdrawal:', details.canProceed);
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

// 📊 Step 3: Get Transaction History
function getTransactionHistory() {
  try {
    const history = sdk.getTransactionHistory();
    
    if (history.success) {
      console.log('✅ Transaction history retrieved');
      console.log('Available Balance:', history.availableBalance, 'AED');
      console.log('Transaction Count:', history.transactions.length);
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

// 💰 Step 4: Calculate Withdrawal Fees
function calculateFees(amount) {
  try {
    const fees = sdk.calculateWithdrawalFees(amount);
    
    if (fees.success) {
      console.log('✅ Fees calculated successfully');
      console.log('Requested Amount:', fees.fees.requestedAmount, 'AED');
      console.log('Early Access Fee:', fees.fees.earlyAccessFee, 'AED');
      console.log('VAT (5%):', fees.fees.vatAmount, 'AED');
      console.log('Total Fee:', fees.fees.totalFee, 'AED');
      console.log('You Receive:', fees.fees.youReceive, 'AED');
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

// 💳 Step 5: Initiate Withdrawal
async function initiateWithdrawal(amount, type = 'salary') {
  try {
    const withdrawal = await sdk.handleWithdrawalRequest(amount, type);
    
    if (withdrawal.success) {
      console.log('✅ Withdrawal request initiated');
      console.log('Request ID:', withdrawal.withdrawalRequest.id);
      console.log('Amount:', withdrawal.withdrawalRequest.amount, 'AED');
      console.log('Status:', withdrawal.withdrawalRequest.status);
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

// 🔒 Step 6: WPS Validation
async function validateWithWPS(wpsCallback, credentials) {
  try {
    const validation = await wpsCallback.validateUser(credentials);
    
    if (validation.success) {
      console.log('✅ WPS validation successful');
      console.log('Message:', validation.message);
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

// ⚙️ Step 7: WPS Processing
async function processWithWPS(wpsCallback, validationResult) {
  try {
    const processing = await wpsCallback.processWithdrawal(validationResult);
    
    if (processing.success) {
      console.log('✅ WPS processing successful');
      console.log('Receipt Number:', processing.receipt.receiptNumber);
      console.log('Transaction ID:', processing.transactionId);
      console.log('Status:', processing.receipt.status);
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

// 🔄 Complete Flow Example
async function completePeyDeyFlow() {
  console.log('🚀 Starting PeyDey SDK Flow...\n');
  
  // Step 1: Authenticate user
  const isAuthenticated = await authenticateUser('784-1968-6570305-0', '+971523213841');
  if (!isAuthenticated) {
    console.log('❌ Flow stopped: Authentication failed');
    return;
  }
  
  console.log('\n--- User Authenticated ---\n');
  
  // Step 2: Get user information
  const userDetails = getUserInformation();
  if (!userDetails) {
    console.log('❌ Flow stopped: Failed to get user details');
    return;
  }
  
  console.log('\n--- User Details Retrieved ---\n');
  
  // Step 3: Get transaction history
  const history = getTransactionHistory();
  if (!history) {
    console.log('❌ Flow stopped: Failed to get transaction history');
    return;
  }
  
  console.log('\n--- Transaction History Retrieved ---\n');
  
  // Step 4: Calculate fees for withdrawal
  const withdrawalAmount = 100;
  const fees = calculateFees(withdrawalAmount);
  if (!fees) {
    console.log('❌ Flow stopped: Failed to calculate fees');
    return;
  }
  
  console.log('\n--- Fees Calculated ---\n');
  
  // Step 5: Initiate withdrawal
  const withdrawal = await initiateWithdrawal(withdrawalAmount, 'salary');
  if (!withdrawal) {
    console.log('❌ Flow stopped: Failed to initiate withdrawal');
    return;
  }
  
  console.log('\n--- Withdrawal Initiated ---\n');
  
  // Step 6: WPS validation
  const wpsCallback = withdrawal.wpsCallback;
  const validation = await validateWithWPS(wpsCallback, {
    method: 'emiratesId',
    value: '784-1968-6570305-0'
  });
  
  if (!validation) {
    console.log('❌ Flow stopped: WPS validation failed');
    return;
  }
  
  console.log('\n--- WPS Validation Successful ---\n');
  
  // Step 7: WPS processing
  const processing = await processWithWPS(wpsCallback, validation);
  if (!processing) {
    console.log('❌ Flow stopped: WPS processing failed');
    return;
  }
  
  console.log('\n--- WPS Processing Successful ---\n');
  
  // Success!
  console.log('🎉 PeyDey SDK Flow Completed Successfully!');
  console.log('Receipt:', processing.receipt);
  
  // Exit SDK
  const exitResult = sdk.exitSDK();
  console.log('SDK Exit:', exitResult.message);
}

// 🧪 Test the SDK
async function testSDK() {
  console.log('🧪 Testing PeyDey SDK...\n');
  
  try {
    // Test authentication
    const authResult = await authenticateUser('784-1968-6570305-0', '+971523213841');
    
    if (authResult) {
      // Test getting user details
      getUserInformation();
      
      // Test fee calculation
      calculateFees(100);
      
      // Test transaction history
      getTransactionHistory();
      
      // Exit SDK
      sdk.exitSDK();
    }
  } catch (error) {
    console.error('❌ SDK test failed:', error.message);
  }
}

// Export functions for use in other modules
export {
  sdk,
  authenticateUser,
  getUserInformation,
  getTransactionHistory,
  calculateFees,
  initiateWithdrawal,
  validateWithWPS,
  processWithWPS,
  completePeyDeyFlow,
  testSDK
};

// 🚀 Run the complete flow if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.PeyDeySDKExample = {
    completeFlow: completePeyDeyFlow,
    testSDK: testSDK
  };
  
  console.log('🚀 PeyDey SDK Example loaded!');
  console.log('Run: PeyDeySDKExample.completeFlow() to start the flow');
  console.log('Run: PeyDeySDKExample.testSDK() to test the SDK');
} else {
  // Node.js environment
  console.log('🚀 PeyDey SDK Example loaded in Node.js!');
  console.log('Import the functions to use them in your application');
}
