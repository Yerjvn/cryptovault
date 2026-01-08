import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Проверка наличия MetaMask
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Получение баланса
  const fetchBalance = useCallback(async (address, provider) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error('Ошибка при получении баланса:', err);
    }
  }, []);

  // Подключение кошелька
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask не установлен. Пожалуйста, установите MetaMask.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Запрос на подключение аккаунтов
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const network = await browserProvider.getNetwork();

        setProvider(browserProvider);
        setSigner(signer);
        setAccount(accounts[0]);
        setChainId(network.chainId.toString());

        await fetchBalance(accounts[0], browserProvider);
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('Вы отклонили запрос на подключение.');
      } else {
        setError('Ошибка подключения: ' + err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Отключение кошелька
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  };

  // Отправка транзакции
  const sendTransaction = async (to, amount) => {
    if (!signer) {
      throw new Error('Кошелёк не подключён');
    }

    try {
      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount)
      });

      // Ожидаем подтверждения транзакции
      const receipt = await tx.wait();
      
      // Обновляем баланс после транзакции
      await fetchBalance(account, provider);

      return receipt;
    } catch (err) {
      if (err.code === 4001) {
        throw new Error('Транзакция отменена пользователем');
      }
      throw err;
    }
  };

  // Список поддерживаемых сетей
  const NETWORKS = {
    '1': {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      symbol: 'ETH',
      rpcUrls: ['https://mainnet.infura.io/v3/'],
      blockExplorerUrls: ['https://etherscan.io']
    },
    '11155111': {
      chainId: '0xaa36a7',
      chainName: 'Sepolia Testnet',
      symbol: 'SepoliaETH',
      rpcUrls: ['https://sepolia.infura.io/v3/'],
      blockExplorerUrls: ['https://sepolia.etherscan.io']
    },
    '5': {
      chainId: '0x5',
      chainName: 'Goerli Testnet',
      symbol: 'GoerliETH',
      rpcUrls: ['https://goerli.infura.io/v3/'],
      blockExplorerUrls: ['https://goerli.etherscan.io']
    },
    '137': {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      symbol: 'MATIC',
      rpcUrls: ['https://polygon-rpc.com'],
      blockExplorerUrls: ['https://polygonscan.com']
    },
    '80001': {
      chainId: '0x13881',
      chainName: 'Mumbai Testnet',
      symbol: 'MATIC',
      rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com']
    },
    '56': {
      chainId: '0x38',
      chainName: 'BSC Mainnet',
      symbol: 'BNB',
      rpcUrls: ['https://bsc-dataseed.binance.org'],
      blockExplorerUrls: ['https://bscscan.com']
    },
    '97': {
      chainId: '0x61',
      chainName: 'BSC Testnet',
      symbol: 'tBNB',
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
      blockExplorerUrls: ['https://testnet.bscscan.com']
    },
    '42161': {
      chainId: '0xa4b1',
      chainName: 'Arbitrum One',
      symbol: 'ETH',
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      blockExplorerUrls: ['https://arbiscan.io']
    },
    '421614': {
      chainId: '0x66eee',
      chainName: 'Arbitrum Sepolia',
      symbol: 'ETH',
      rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
      blockExplorerUrls: ['https://sepolia.arbiscan.io']
    }
  };

  // Получение названия сети
  const getNetworkName = (chainId) => {
    return NETWORKS[chainId]?.chainName || `Сеть #${chainId}`;
  };

  // Получение символа валюты сети
  const getNetworkSymbol = (chainId) => {
    return NETWORKS[chainId]?.symbol || 'ETH';
  };

  // Переключение сети
  const switchNetwork = async (targetChainId) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask не установлен');
    }

    const network = NETWORKS[targetChainId];
    if (!network) {
      throw new Error('Сеть не поддерживается');
    }

    try {
      // Пробуем переключиться на сеть
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }]
      });
    } catch (switchError) {
      // Если сети нет в MetaMask, добавляем её
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: network.chainId,
              chainName: network.chainName,
              nativeCurrency: {
                name: network.symbol,
                symbol: network.symbol,
                decimals: 18
              },
              rpcUrls: network.rpcUrls,
              blockExplorerUrls: network.blockExplorerUrls
            }]
          });
        } catch (addError) {
          throw new Error('Не удалось добавить сеть: ' + addError.message);
        }
      } else if (switchError.code === 4001) {
        throw new Error('Переключение сети отменено');
      } else {
        throw switchError;
      }
    }
  };

  // Слушатели событий MetaMask
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        if (provider) {
          await fetchBalance(accounts[0], provider);
        }
      }
    };

    const handleChainChanged = (chainId) => {
      // Перезагружаем страницу при смене сети (рекомендация MetaMask)
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, provider, fetchBalance]);

  // Проверяем, был ли уже подключён кошелёк
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });

        if (accounts.length > 0) {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await browserProvider.getSigner();
          const network = await browserProvider.getNetwork();

          setProvider(browserProvider);
          setSigner(signer);
          setAccount(accounts[0]);
          setChainId(network.chainId.toString());

          await fetchBalance(accounts[0], browserProvider);
        }
      } catch (err) {
        console.error('Ошибка при проверке подключения:', err);
      }
    };

    checkConnection();
  }, [fetchBalance]);

  // Обновление баланса каждые 15 секунд
  useEffect(() => {
    if (!account || !provider) return;

    const interval = setInterval(() => {
      fetchBalance(account, provider);
    }, 15000);

    return () => clearInterval(interval);
  }, [account, provider, fetchBalance]);

  return {
    account,
    balance,
    chainId,
    provider,
    signer,
    isConnecting,
    error,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    networkName: chainId ? getNetworkName(chainId) : null,
    networkSymbol: chainId ? getNetworkSymbol(chainId) : 'ETH',
    networks: NETWORKS,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    switchNetwork,
    refreshBalance: () => account && provider && fetchBalance(account, provider)
  };
};

