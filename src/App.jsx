import { useState, useEffect } from 'react'
import './App.css'
import PeyDeySDK from './sdk/index.js'
import SimpleTestRunner from './sdk/testRunner.js'

function App() {
  const [sdk] = useState(() => new PeyDeySDK({ debug: true }))
  const [testResults, setTestResults] = useState(null)
  const [activeTab, setActiveTab] = useState('demo')
  const [userState, setUserState] = useState({
    isAuthenticated: false,
    userData: null,
    sessionId: null
  })
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: 100,
    type: 'salary'
  })
  const [wpsCredentials, setWpsCredentials] = useState({
    method: 'emiratesId',
    value: '784-1968-6570305-0'
  })
  const [currentStep, setCurrentStep] = useState('login')
  const [flowResults, setFlowResults] = useState({})

  const runTests = async () => {
    const runner = new SimpleTestRunner()
    const results = await runner.runAllTests()
    setTestResults(results)
    sdk.log(`Tests completed: ${results.passed}/${results.total} passed`)
  }

  const handleLogin = async () => {
    const credentials = {
      emiratesId: '784-1968-6570305-0',
      phoneNumber: '+971523213841'
    }
    
    const result = await sdk.onboardUser(credentials)
    
    if (result.success) {
      setUserState({
        isAuthenticated: true,
        userData: result.userData,
        sessionId: result.sessionId
      })
      setCurrentStep('userDetails')
      sdk.log('User logged in successfully')
    } else {
      alert(`Login failed: ${result.error}`)
    }
  }

  const handleLogout = () => {
    sdk.exitSDK()
    setUserState({
      isAuthenticated: false,
      userData: null,
      sessionId: null
    })
    setCurrentStep('login')
    setFlowResults({})
    sdk.log('User logged out')
  }

  const getUserDetails = () => {
    const details = sdk.getUserDetails()
    if (details.success) {
      setFlowResults(prev => ({ ...prev, userDetails: details }))
      setCurrentStep('transactionHistory')
    } else {
      alert(`Failed to get user details: ${details.error}`)
    }
  }

  const getTransactionHistory = () => {
    const history = sdk.getTransactionHistory()
    if (history.success) {
      setFlowResults(prev => ({ ...prev, transactionHistory: history }))
      setCurrentStep('withdrawal')
    } else {
      alert(`Failed to get transaction history: ${history.error}`)
    }
  }

  const calculateFees = () => {
    const fees = sdk.calculateWithdrawalFees(withdrawalForm.amount)
    if (fees.success) {
      setFlowResults(prev => ({ ...prev, fees: fees.fees }))
    } else {
      alert(`Failed to calculate fees: ${fees.error}`)
    }
  }

  const handleWithdrawalRequest = async () => {
    const result = await sdk.handleWithdrawalRequest(withdrawalForm.amount, withdrawalForm.type)
    
    if (result.success) {
      setFlowResults(prev => ({ ...prev, withdrawalRequest: result }))
      setCurrentStep('wpsValidation')
      sdk.log('Withdrawal request initiated')
    } else {
      alert(`Withdrawal request failed: ${result.error}`)
    }
  }

  const handleWPSValidation = async () => {
    const { withdrawalRequest } = flowResults
    if (!withdrawalRequest?.wpsCallback) {
      alert('No withdrawal request found')
      return
    }

    const validationResult = await withdrawalRequest.wpsCallback.validateUser(wpsCredentials)
    
    if (validationResult.success) {
      setFlowResults(prev => ({ ...prev, wpsValidation: validationResult }))
      setCurrentStep('wpsProcessing')
      sdk.log('WPS validation successful')
    } else {
      alert(`WPS validation failed: ${validationResult.error}`)
    }
  }

  const handleWPSProcessing = async () => {
    const { withdrawalRequest, wpsValidation } = flowResults
    if (!withdrawalRequest?.wpsCallback || !wpsValidation) {
      alert('Missing required data for WPS processing')
      return
    }

    const processResult = await withdrawalRequest.wpsCallback.processWithdrawal(wpsValidation)
    
    if (processResult.success) {
      setFlowResults(prev => ({ ...prev, wpsProcessing: processResult }))
      setCurrentStep('success')
      sdk.log('WPS processing completed')
    } else {
      alert(`WPS processing failed: ${processResult.error}`)
    }
  }

  const resetFlow = () => {
    setCurrentStep('login')
    setFlowResults({})
    setWithdrawalForm({ amount: 100, type: 'salary' })
    setWpsCredentials({ method: 'emiratesId', value: '784-1968-6570305-0' })
  }

  const quickAmountSelect = (amount) => {
    setWithdrawalForm(prev => ({ ...prev, amount }))
    calculateFees()
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏦 PeyDey SDK Demo</h1>
        <p>UAE Workforce Payment System Integration</p>
      </header>

      <nav className="tab-nav">
        <button 
          className={activeTab === 'demo' ? 'active' : ''} 
          onClick={() => setActiveTab('demo')}
        >
          SDK Flow Demo
        </button>
        <button 
          className={activeTab === 'tests' ? 'active' : ''} 
          onClick={() => setActiveTab('tests')}
        >
          Run Tests
        </button>
        <button 
          className={activeTab === 'docs' ? 'active' : ''} 
          onClick={() => setActiveTab('docs')}
        >
          Documentation
        </button>
      </nav>

      <main className="App-main">
        {activeTab === 'demo' && (
          <div className="demo-section">
            <div className="flow-container">
              {/* Step 1: Login/Onboard */}
              {currentStep === 'login' && (
                <div className="flow-step">
                  <h3>🔐 Step 1: Get Started</h3>
                  <div className="step-content">
                    <p>Welcome to PeyDey - Fill in your details to get in</p>
                    <div className="login-form">
                      <div className="form-group">
                        <label>Emirates ID</label>
                        <input 
                          type="text" 
                          value="784-1968-6570305-0" 
                          disabled 
                          placeholder="784-1968-6570305-0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <div className="phone-input">
                          <span className="uae-flag">🇦🇪</span>
                          <input 
                            type="tel" 
                            value="+971523213841" 
                            disabled 
                            placeholder="+971523213841"
                          />
                        </div>
                      </div>
                      <button onClick={handleLogin} className="primary-btn">
                        🚀 Continue
                      </button>
                    </div>
                    <div className="step-info">
                      <p><strong>Mock Credentials:</strong></p>
                      <p>Emirates ID: 784-1968-6570305-0</p>
                      <p>Phone: +971523213841</p>
                      <p className="terms">By continuing you agree to <strong>peydey</strong> Terms of Use & Privacy Policy</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Welcome to PeyDey */}
              {currentStep === 'userDetails' && (
                <div className="flow-step">
                  <h3>👤 Step 2: Welcome to PeyDey</h3>
                  <div className="step-content">
                    <p>User profile and financial overview</p>
                    <button onClick={getUserDetails} className="primary-btn">
                      📊 Get User Details
                    </button>
                    
                    {flowResults.userDetails && (
                      <div className="user-details">
                        <div className="profile-card">
                          <h4>👤 User Information</h4>
                          <div className="profile-info">
                            <div className="profile-picture">
                              <span>👨‍💼</span>
                            </div>
                            <div className="profile-text">
                              <p><strong>Employee name:</strong> {flowResults.userDetails.userData.name}</p>
                              <p><strong>Employer name:</strong> {flowResults.userDetails.userData.employerName}</p>
                              <p><strong>WPS Partner:</strong> {flowResults.userDetails.userData.wpsPartner}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="financial-card">
                          <h4>💰 Financial Summary</h4>
                          <div className="financial-info">
                            <div className="financial-item">
                              <span className="icon">📅</span>
                              <span><strong>Monthly Salary:</strong> {flowResults.userDetails.userData.monthlySalary.toLocaleString()} AED</span>
                            </div>
                            <div className="financial-item">
                              <span className="icon">💰</span>
                              <span><strong>Earned Salary:</strong> {flowResults.userDetails.userData.earnedSalary.toLocaleString()} AED</span>
                              <small>16 February 2025</small>
                            </div>
                            <div className="financial-item">
                              <span className="icon">💳</span>
                              <span><strong>Available Balance:</strong> {flowResults.userDetails.userData.limits.availableBalance.toLocaleString()} AED</span>
                            </div>
                          </div>
                        </div>
                        
                        <button onClick={getTransactionHistory} className="primary-btn">
                          💰 Get Paid
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Transaction History */}
              {currentStep === 'transactionHistory' && (
                <div className="flow-step">
                  <h3>📊 Step 3: Transaction History</h3>
                  <div className="step-content">
                    <p>Available balance and transaction list</p>
                    <button onClick={getTransactionHistory} className="primary-btn">
                      📊 Get Transaction History
                    </button>
                    
                    {flowResults.transactionHistory && (
                      <div className="transaction-history">
                        <div className="balance-card">
                          <h4>💰 Available Balance</h4>
                          <div className="balance-info">
                            <p><strong>{flowResults.transactionHistory.availableBalance.toLocaleString()}</strong> AED</p>
                            <p>You can apply to get paid of your available balance</p>
                          </div>
                        </div>
                        
                        <div className="history-list">
                          <h4>📋 Transaction History</h4>
                          {flowResults.transactionHistory.transactions.length > 0 ? (
                            flowResults.transactionHistory.transactions.map((tx, index) => (
                              <div key={index} className="transaction-item">
                                <span className="transaction-icon">💸</span>
                                <span className="transaction-details">
                                  {tx.amount} AED Withdrawal {tx.formattedDate}
                                </span>
                                <span className="transaction-arrow">→</span>
                              </div>
                            ))
                          ) : (
                            <p>No transactions yet</p>
                          )}
                        </div>
                        
                        <button onClick={() => setCurrentStep('withdrawal')} className="primary-btn">
                          💰 Get Paid
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Get Paid */}
              {currentStep === 'withdrawal' && (
                <div className="flow-step">
                  <h3>💰 Step 4: Get Paid</h3>
                  <div className="step-content">
                    <p>Enter the amount you want to withdraw</p>
                    <div className="withdrawal-form">
                      <div className="amount-input">
                        <h4>💜 Enter the amount</h4>
                        <p>You can request up to {flowResults.userDetails?.userData?.limits?.availableBalance || 0} AED</p>
                        <input
                          type="number"
                          value={withdrawalForm.amount}
                          onChange={(e) => {
                            setWithdrawalForm(prev => ({ ...prev, amount: Number(e.target.value) }))
                            calculateFees()
                          }}
                          min="1"
                          max={flowResults.userDetails?.userData?.limits?.availableBalance || 1000}
                          placeholder="Type your amount here"
                        />
                      </div>
                      
                      <div className="quick-amounts">
                        <button 
                          onClick={() => quickAmountSelect(100)} 
                          className={`quick-amount ${withdrawalForm.amount === 100 ? 'active' : ''}`}
                        >
                          AED 100
                        </button>
                        <button 
                          onClick={() => quickAmountSelect(250)} 
                          className={`quick-amount ${withdrawalForm.amount === 250 ? 'active' : ''}`}
                        >
                          AED 250
                        </button>
                        <button 
                          onClick={() => quickAmountSelect(500)} 
                          className={`quick-amount ${withdrawalForm.amount === 500 ? 'active' : ''}`}
                        >
                          AED 500
                        </button>
                        <button 
                          onClick={() => quickAmountSelect(750)} 
                          className={`quick-amount ${withdrawalForm.amount === 750 ? 'active' : ''}`}
                        >
                          AED 750
                        </button>
                      </div>
                      
                      {flowResults.fees && (
                        <div className="fees-breakdown">
                          <h4>💰 Transaction Details</h4>
                          <div className="fee-item">
                            <span>Requested Amount:</span>
                            <span>{flowResults.fees.requestedAmount.toLocaleString()} AED</span>
                          </div>
                          <div className="fee-item">
                            <span>Early access fee:</span>
                            <span>{flowResults.fees.earlyAccessFee.toLocaleString()} AED</span>
                          </div>
                          <div className="fee-item">
                            <span>5% VAT:</span>
                            <span>{flowResults.fees.vatAmount.toLocaleString()} AED</span>
                          </div>
                          <div className="fee-item total">
                            <span>Total Fee:</span>
                            <span>{flowResults.fees.totalFee.toLocaleString()} AED</span>
                          </div>
                          <div className="fee-item you-receive">
                            <span>You Receive:</span>
                            <span>{flowResults.fees.youReceive.toLocaleString()} AED</span>
                          </div>
                        </div>
                      )}
                      
                      <button onClick={handleWithdrawalRequest} className="primary-btn">
                        💳 Apply Now
                      </button>
                    </div>
                    
                    <div className="step-info">
                      <p><strong>Available Balance:</strong> {flowResults.userDetails?.userData?.limits?.availableBalance || 0} AED</p>
                      <p><strong>Note:</strong> On withdrawal click/press, callback will be exposed to WPS for their side of logic</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: WPS Validation */}
              {currentStep === 'wpsValidation' && (
                <div className="flow-step">
                  <h3>🔒 Step 5: WPS Validate User</h3>
                  <div className="step-content">
                    <p>WPS system validates user credentials and eligibility</p>
                    <div className="wps-form">
                      <div className="form-group">
                        <label>Validation Method:</label>
                        <select
                          value={wpsCredentials.method}
                          onChange={(e) => setWpsCredentials(prev => ({ ...prev, method: e.target.value }))}
                        >
                          <option value="emiratesId">Emirates ID</option>
                          <option value="password">Password</option>
                          <option value="pin">PIN</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Value:</label>
                        <input
                          type={wpsCredentials.method === 'password' ? 'password' : 'text'}
                          value={wpsCredentials.value}
                          onChange={(e) => setWpsCredentials(prev => ({ ...prev, value: e.target.value }))}
                          placeholder={wpsCredentials.method === 'emiratesId' ? '784-1968-6570305-0' : 
                                     wpsCredentials.method === 'password' ? 'correct_password' : '1234'}
                        />
                      </div>
                      <button onClick={handleWPSValidation} className="primary-btn">
                        ✅ Validate User
                      </button>
                    </div>
                    
                    <div className="step-info">
                      <p><strong>Mock WPS Credentials:</strong></p>
                      <p>Emirates ID: 784-1968-6570305-0</p>
                      <p>Password: correct_password</p>
                      <p>PIN: 1234</p>
                      <p><strong>Note:</strong> WPS performs additional eligibility check</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: WPS Processing */}
              {currentStep === 'wpsProcessing' && (
                <div className="flow-step">
                  <h3>⚙️ Step 6: WPS Process Withdrawal</h3>
                  <div className="step-content">
                    <p>WPS processes the withdrawal and generates receipt</p>
                    <button onClick={handleWPSProcessing} className="primary-btn">
                      🚀 Process Withdrawal
                    </button>
                    
                    <div className="step-info">
                      <p><strong>WPS will:</strong></p>
                      <ul>
                        <li>Validate withdrawal request</li>
                        <li>Process transaction</li>
                        <li>Generate receipt</li>
                        <li>Update status</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Success */}
              {currentStep === 'success' && (
                <div className="flow-step">
                  <h3>🎉 Step 7: Success & Receipt</h3>
                  <div className="step-content">
                    <p>Transaction completed successfully</p>
                    
                    {flowResults.wpsProcessing && (
                      <div className="success-details">
                        <h4>Transaction Receipt:</h4>
                        <div className="receipt">
                          <div className="receipt-item">
                            <span>Receipt Number:</span>
                            <span>{flowResults.wpsProcessing.receipt.receiptNumber}</span>
                          </div>
                          <div className="receipt-item">
                            <span>Amount:</span>
                            <span>{flowResults.wpsProcessing.receipt.amount.toLocaleString()} AED</span>
                          </div>
                          <div className="receipt-item">
                            <span>User:</span>
                            <span>{flowResults.wpsProcessing.receipt.user}</span>
                          </div>
                          <div className="receipt-item">
                            <span>Emirates ID:</span>
                            <span>{flowResults.wpsProcessing.receipt.emiratesId}</span>
                          </div>
                          <div className="receipt-item">
                            <span>Employer:</span>
                            <span>{flowResults.wpsProcessing.receipt.employer}</span>
                          </div>
                          <div className="receipt-item">
                            <span>WPS Partner:</span>
                            <span>{flowResults.wpsProcessing.receipt.wpsPartner}</span>
                          </div>
                          <div className="receipt-item">
                            <span>Status:</span>
                            <span className="status-completed">{flowResults.wpsProcessing.receipt.status}</span>
                          </div>
                          <div className="receipt-item">
                            <span>Message:</span>
                            <span>{flowResults.wpsProcessing.receipt.message}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="action-buttons">
                      <button onClick={() => setCurrentStep('userDetails')} className="secondary-btn">
                        🔄 Back to Dashboard
                      </button>
                      <button onClick={resetFlow} className="primary-btn">
                        🏠 Go to Homepage
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Flow Navigation */}
            <div className="flow-navigation">
              <h3>🧭 Flow Navigation</h3>
              <div className="flow-steps">
                <div className={`flow-step-indicator ${currentStep === 'login' ? 'active' : ''}`}>
                  1. Get Started
                </div>
                <div className={`flow-step-indicator ${currentStep === 'userDetails' ? 'active' : ''}`}>
                  2. Welcome
                </div>
                <div className={`flow-step-indicator ${currentStep === 'transactionHistory' ? 'active' : ''}`}>
                  3. History
                </div>
                <div className={`flow-step-indicator ${currentStep === 'withdrawal' ? 'active' : ''}`}>
                  4. Get Paid
                </div>
                <div className={`flow-step-indicator ${currentStep === 'wpsValidation' ? 'active' : ''}`}>
                  5. WPS Validation
                </div>
                <div className={`flow-step-indicator ${currentStep === 'wpsProcessing' ? 'active' : ''}`}>
                  6. WPS Processing
                </div>
                <div className={`flow-step-indicator ${currentStep === 'success' ? 'active' : ''}`}>
                  7. Success
                </div>
              </div>
              
              <div className="flow-actions">
                <button onClick={resetFlow} className="secondary-btn">
                  🔄 Reset Flow
                </button>
                {userState.isAuthenticated && (
                  <button onClick={handleLogout} className="danger-btn">
                    🚪 Logout
                  </button>
                )}
              </div>
            </div>

            {/* SDK Stats */}
            <div className="sdk-stats">
              <h3>📈 SDK Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Calls:</span>
                  <span className="stat-value">{sdk.getStats().totalCalls}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Version:</span>
                  <span className="stat-value">{sdk.config.version}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Debug Mode:</span>
                  <span className="stat-value">{sdk.config.debug ? 'On' : 'Off'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">WPS Endpoint:</span>
                  <span className="stat-value">{sdk.config.wpsEndpoint}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Currency:</span>
                  <span className="stat-value">{sdk.config.currency}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Country:</span>
                  <span className="stat-value">{sdk.config.country}</span>
                </div>
              </div>
              <button onClick={() => sdk.clearHistory()}>Clear History</button>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="tests-section">
            <h3>🧪 Automated Tests</h3>
            <p>Click the button below to run all PeyDey SDK tests automatically.</p>
            <button className="run-tests-btn" onClick={runTests}>
              🚀 Run All Tests
            </button>
            
            {testResults && (
              <div className="test-results">
                <h4>Test Results</h4>
                <div className="results-summary">
                  <div className="result-item">
                    <span>Total Tests:</span>
                    <span>{testResults.total}</span>
                  </div>
                  <div className="result-item">
                    <span>Passed:</span>
                    <span className="passed">{testResults.passed}</span>
                  </div>
                  <div className="result-item">
                    <span>Failed:</span>
                    <span className="failed">{testResults.failed}</span>
                  </div>
                  <div className="result-item">
                    <span>Success Rate:</span>
                    <span>{testResults.successRate}%</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="test-info">
              <h4>Test Coverage</h4>
              <ul>
                <li>✅ UserSession management (3 tests)</li>
                <li>✅ UserEligibility checks (3 tests)</li>
                <li>✅ TransactionHistory management (2 tests)</li>
                <li>✅ WPSIntegration validation (4 tests)</li>
                <li>✅ WithdrawalHandler processing (3 tests)</li>
                <li>✅ PeyDeySDK integration (5 tests)</li>
                <li>✅ End-to-End flow testing (2 tests)</li>
                <li>✅ Error handling scenarios (3 tests)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="docs-section">
            <h3>📚 PeyDey SDK Documentation</h3>
            
            <div className="doc-section">
              <h4>🏗️ Architecture Overview</h4>
              <p>The PeyDey SDK follows the exact flow from your mobile screens:</p>
              <ol>
                <li><strong>Get Started:</strong> Emirates ID and phone number authentication</li>
                <li><strong>Welcome to PeyDey:</strong> User profile, employer info, and financial summary</li>
                <li><strong>Transaction History:</strong> Available balance and transaction list</li>
                <li><strong>Get Paid:</strong> Amount selection with fee breakdown (5% fee + 5% VAT)</li>
                <li><strong>WPS Validation:</strong> WPS validates user and checks eligibility</li>
                <li><strong>WPS Processing:</strong> WPS processes withdrawal and generates receipt</li>
                <li><strong>Success:</strong> Show receipt and return to dashboard option</li>
              </ol>
            </div>

            <div className="doc-section">
              <h4>🇦🇪 UAE-Specific Features</h4>
              <ul>
                <li><strong>Emirates ID Authentication:</strong> Primary identification method</li>
                <li><strong>UAE Phone Numbers:</strong> +971 format support</li>
                <li><strong>AED Currency:</strong> All amounts in UAE Dirhams</li>
                <li><strong>VAT Calculation:</strong> 5% VAT on early access fees</li>
                <li><strong>WPS Integration:</strong> UAE Workforce Payment System</li>
                <li><strong>Employer Partnerships:</strong> Emirates NBD, Alfardan Exchange</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>💰 Financial Calculations</h4>
              <ul>
                <li><strong>Available Balance:</strong> 25% of earned salary</li>
                <li><strong>Early Access Fee:</strong> 5% of withdrawal amount</li>
                <li><strong>VAT:</strong> 5% on early access fee</li>
                <li><strong>Total Fee:</strong> Early access fee + VAT</li>
                <li><strong>You Receive:</strong> Requested amount - Total fee</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>🔐 UserSession Class</h4>
              <p>Manages user authentication state and session data:</p>
              <ul>
                <li><code>createSession(userData)</code> - Create new user session</li>
                <li><code>getSession()</code> - Get current session information</li>
                <li><code>clearSession()</code> - Clear session and logout user</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>✅ UserEligibility Class</h4>
              <p>Handles UAE-specific eligibility checks and withdrawal limits:</p>
              <ul>
                <li><code>checkEligibility(userData)</code> - Check if user is eligible for withdrawals</li>
                <li><code>getIneligibilityReasons(userData)</code> - Get reasons why user is ineligible</li>
                <li><code>calculateLimits(userData)</code> - Calculate available balance based on earned salary</li>
                <li><code>calculateFees(amount, userData)</code> - Calculate early access fees and VAT</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>📊 TransactionHistory Class</h4>
              <p>Manages UAE transaction records with AED currency:</p>
              <ul>
                <li><code>addTransaction(transaction)</code> - Add new transaction</li>
                <li><code>getTransactionHistory(userId, limit)</code> - Get user's transaction history</li>
                <li><code>updateTransactionStatus(transactionId, status)</code> - Update transaction status</li>
                <li><code>formatTransactionDate(timestamp)</code> - Format dates for UAE display</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>💰 WithdrawalHandler Class</h4>
              <p>Handles PeyDey withdrawal requests and WPS integration:</p>
              <ul>
                <li><code>initiateWithdrawal(userData, amount, type)</code> - Create withdrawal request</li>
                <li><code>validateWithdrawalRequest(userData, amount)</code> - Validate withdrawal parameters</li>
                <li><code>createWPSCallback(withdrawalRequest)</code> - Create WPS integration callback</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>🏦 WPSIntegration Class</h4>
              <p>UAE Workforce Payment System integration layer:</p>
              <ul>
                <li><code>validateUser(credentials, withdrawalRequest)</code> - Validate user with WPS</li>
                <li><code>checkWPSEligibility(withdrawalRequest)</code> - Check eligibility on WPS side</li>
                <li><code>processWithdrawal(withdrawalRequest, validationResult)</code> - Process withdrawal through WPS</li>
                <li><code>generateReceipt(withdrawalRequest)</code> - Generate UAE transaction receipt</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>🚀 PeyDeySDK Class</h4>
              <p>Main SDK class orchestrating the entire UAE flow:</p>
              <ul>
                <li><code>onboardUser(credentials)</code> - Step 1: Emirates ID authentication</li>
                <li><code>getUserDetails()</code> - Step 2: Display user information</li>
                <li><code>getTransactionHistory()</code> - Step 3: Get balance and transactions</li>
                <li><code>calculateWithdrawalFees(amount)</code> - Step 4: Calculate fees and VAT</li>
                <li><code>handleWithdrawalRequest(amount, type)</code> - Step 5: Initiate withdrawal</li>
                <li><code>exitSDK()</code> - Exit and clear session</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>🔄 WPS Callback Flow</h4>
              <p>The SDK exposes callbacks to WPS for their side of logic:</p>
              <ul>
                <li><strong>validateUser:</strong> WPS validates Emirates ID and eligibility</li>
                <li><strong>processWithdrawal:</strong> WPS processes the withdrawal and generates receipt</li>
                <li><strong>Return to Dashboard:</strong> After successful processing, user returns to main interface</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>⚙️ Configuration</h4>
              <p>SDK can be configured with various UAE-specific options:</p>
              <ul>
                <li><code>debug</code> - Enable/disable debug logging</li>
                <li><code>wpsEndpoint</code> - WPS API endpoint URL</li>
                <li><code>currency</code> - Currency (default: AED)</li>
                <li><code>country</code> - Country (default: UAE)</li>
                <li><code>version</code> - SDK version string</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
