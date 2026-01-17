import { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import WalletConnect from './components/WalletConnect';
import WalletInfo from './components/WalletInfo';
import SendTransaction from './components/SendTransaction';
import TransactionHistory from './components/TransactionHistory';
import NetworkSelector from './components/NetworkSelector';
import './App.css';

function App() {
  const wallet = useWallet();
  const [transactions, setTransactions] = useState([]);

  const handleTransactionSuccess = (tx, to, amount) => {
    setTransactions(prev => [{
      hash: tx.hash,
      to,
      amount,
      timestamp: Date.now(),
      status: 'success'
    }, ...prev]);
  };

  return (
    <div className="app">
      <div className="background-effects">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M20 4V36" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
              <path d="M4 12L36 28" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
              <path d="M36 12L4 28" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
              <circle cx="20" cy="20" r="6" fill="currentColor" opacity="0.8"/>
            </svg>
          </div>
          <span className="logo-text">CryptoVault</span>
        </div>
        
        {wallet.account && (
          <NetworkSelector wallet={wallet} />
        )}
      </header>

      <main className="main-content">
        {!wallet.account ? (
          <WalletConnect wallet={wallet} />
        ) : (
          <div className="dashboard">
            <WalletInfo wallet={wallet} />
            <div className="dashboard-grid">
              <SendTransaction 
                wallet={wallet} 
                onSuccess={handleTransactionSuccess}
              />
              <TransactionHistory transactions={transactions} wallet={wallet} />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by Ethereum • MetaMask required</p>
      </footer>
    </div>
  );
}

export default App;

