import { useState } from 'react';
import { ethers } from 'ethers';

function SendTransaction({ wallet, onSuccess }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateAddress = (address) => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!recipient || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Invalid amount');
      return;
    }

    if (numAmount > parseFloat(wallet.balance)) {
      setError('Insufficient funds');
      return;
    }

    setIsSending(true);

    try {
      const receipt = await wallet.sendTransaction(recipient, amount);
      setSuccess(`Transaction successful! Hash: ${receipt.hash.slice(0, 10)}...`);
      onSuccess(receipt, recipient, amount);
      setRecipient('');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Error sending transaction');
    } finally {
      setIsSending(false);
    }
  };

  const setMaxAmount = () => {
    // Leave some for gas
    const maxAmount = Math.max(0, parseFloat(wallet.balance) - 0.001);
    setAmount(maxAmount.toFixed(6));
  };

  return (
    <div className="send-transaction">
      <div className="section-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Send
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="send-form">
        <div className="form-group">
          <label htmlFor="recipient">Recipient address</label>
          <input
            type="text"
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isSending}
            className={recipient && !validateAddress(recipient) ? 'invalid' : ''}
          />
          {recipient && !validateAddress(recipient) && (
            <span className="field-error">Invalid address format</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="amount">
            Amount ({wallet.networkSymbol})
            <button type="button" className="max-btn" onClick={setMaxAmount}>
              MAX
            </button>
          </label>
          <div className="amount-input-wrapper">
            <input
              type="number"
              id="amount"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSending}
              step="0.0001"
              min="0"
            />
            <span className="currency-label">{wallet.networkSymbol}</span>
          </div>
          <span className="available-balance">
            Available: {parseFloat(wallet.balance).toFixed(4)} {wallet.networkSymbol}
          </span>
        </div>

        {error && (
          <div className="form-error">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="form-success">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {success}
          </div>
        )}

        <button 
          type="submit" 
          className="send-button"
          disabled={isSending || !recipient || !amount}
        >
          {isSending ? (
            <>
              <span className="spinner"></span>
              Sending...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Send Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default SendTransaction;

