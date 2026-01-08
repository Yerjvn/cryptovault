function WalletInfo({ wallet }) {
  const { account, balance, networkName, networkSymbol, disconnectWallet, refreshBalance } = wallet;

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
  };

  return (
    <div className="wallet-info">
      <div className="wallet-card">
        <div className="wallet-card-header">
          <div className="wallet-status">
            <span className="status-dot"></span>
            <span>Подключено</span>
          </div>
          <button className="disconnect-btn" onClick={disconnectWallet}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Отключить
          </button>
        </div>

        <div className="balance-section">
          <span className="balance-label">Баланс</span>
          <div className="balance-amount">
            <span className="balance-value">{parseFloat(balance).toFixed(4)}</span>
            <span className="balance-currency">{networkSymbol}</span>
          </div>
          <button className="refresh-btn" onClick={refreshBalance} title="Обновить баланс">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4V10H7M23 20V14H17M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1112 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="wallet-details">
          <div className="detail-row">
            <span className="detail-label">Адрес</span>
            <div className="address-display">
              <span className="address-text">{formatAddress(account)}</span>
              <button className="copy-btn" onClick={copyAddress} title="Скопировать адрес">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.24162C20 6.7034 19.7831 6.18789 19.3982 5.81161L16.0832 2.56999C15.7098 2.20459 15.2083 2 14.685 2H10C8.89543 2 8 2.89543 8 4Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V9C4 7.89543 4.89543 7 6 7H8" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="detail-row">
            <span className="detail-label">Сеть</span>
            <span className="network-badge">{networkName}</span>
          </div>
        </div>

        <div className="wallet-card-bg">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default WalletInfo;

