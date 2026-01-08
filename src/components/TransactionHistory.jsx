function TransactionHistory({ transactions, wallet }) {
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getExplorerUrl = (hash) => {
    const explorers = {
      '1': 'https://etherscan.io',
      '11155111': 'https://sepolia.etherscan.io',
      '5': 'https://goerli.etherscan.io',
      '137': 'https://polygonscan.com',
      '80001': 'https://mumbai.polygonscan.com',
      '56': 'https://bscscan.com',
      '97': 'https://testnet.bscscan.com',
      '42161': 'https://arbiscan.io',
      '421614': 'https://sepolia.arbiscan.io'
    };
    const baseUrl = explorers[wallet?.chainId] || 'https://etherscan.io';
    return `${baseUrl}/tx/${hash}`;
  };

  const openExplorer = (hash) => {
    window.open(getExplorerUrl(hash), '_blank');
  };

  return (
    <div className="transaction-history">
      <div className="section-header">
        <h2>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          История транзакций
        </h2>
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="15" width="60" height="50" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M10 28H70" stroke="currentColor" strokeWidth="2"/>
              <rect x="18" y="36" width="25" height="4" rx="2" fill="currentColor" opacity="0.3"/>
              <rect x="18" y="46" width="35" height="4" rx="2" fill="currentColor" opacity="0.2"/>
              <rect x="18" y="56" width="20" height="4" rx="2" fill="currentColor" opacity="0.1"/>
            </svg>
            <p>Транзакций пока нет</p>
            <span>Совершённые транзакции появятся здесь</span>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div 
              key={tx.hash} 
              className="transaction-item"
              onClick={() => openExplorer(tx.hash)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="tx-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="tx-details">
                <span className="tx-type">Отправлено</span>
                <span className="tx-address">Кому: {formatAddress(tx.to)}</span>
              </div>
              <div className="tx-amount">
                <span className="tx-value">-{parseFloat(tx.amount).toFixed(4)}</span>
                <span className="tx-currency">{wallet?.networkSymbol || 'ETH'}</span>
              </div>
              <div className="tx-meta">
                <span className="tx-time">{formatTime(tx.timestamp)}</span>
                <span className={`tx-status ${tx.status}`}>
                  {tx.status === 'success' ? '✓' : '⏳'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;

