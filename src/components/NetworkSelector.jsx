import { useState } from 'react';

function NetworkSelector({ wallet }) {
  const { chainId, networks, switchNetwork, networkName } = wallet;
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState(null);

  // Separate networks into mainnets and testnets
  const mainnetNetworks = ['1', '137', '56', '42161'];
  const testnetNetworks = ['11155111', '5', '80001', '97', '421614'];

  const handleSwitch = async (targetChainId) => {
    if (targetChainId === chainId) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    setError(null);

    try {
      await switchNetwork(targetChainId);
      setIsOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSwitching(false);
    }
  };

  const currentNetwork = networks[chainId];

  return (
    <div className="network-selector">
      <button 
        className="network-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
      >
        <span className="network-dot" data-testnet={testnetNetworks.includes(chainId)}></span>
        <span className="network-name">{networkName}</span>
        <svg 
          className={`chevron ${isOpen ? 'open' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="network-dropdown">
          <div className="dropdown-section">
            <span className="section-label">Mainnets</span>
            {mainnetNetworks.map((id) => (
              <button
                key={id}
                className={`network-option ${id === chainId ? 'active' : ''}`}
                onClick={() => handleSwitch(id)}
                disabled={isSwitching}
              >
                <span className="network-dot mainnet"></span>
                <span>{networks[id].chainName}</span>
                <span className="network-symbol">{networks[id].symbol}</span>
                {id === chainId && <span className="check-icon">✓</span>}
              </button>
            ))}
          </div>

          <div className="dropdown-section">
            <span className="section-label">Testnets</span>
            {testnetNetworks.map((id) => (
              <button
                key={id}
                className={`network-option ${id === chainId ? 'active' : ''}`}
                onClick={() => handleSwitch(id)}
                disabled={isSwitching}
              >
                <span className="network-dot testnet"></span>
                <span>{networks[id].chainName}</span>
                <span className="network-symbol">{networks[id].symbol}</span>
                {id === chainId && <span className="check-icon">✓</span>}
              </button>
            ))}
          </div>

          {error && (
            <div className="network-error">
              {error}
            </div>
          )}

          <div className="dropdown-footer">
            <a 
              href="https://sepoliafaucet.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="faucet-link"
            >
              Get Sepolia test tokens
            </a>
          </div>
        </div>
      )}

      {isOpen && <div className="network-overlay" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}

export default NetworkSelector;

