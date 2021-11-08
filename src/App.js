import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  let isReturningUser = 0;
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
   const contractAddress = "0xce7D43b8F6636BA7B945bd427B8C8c775eDFdC2E";
   const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        console.log("Chain ID : ", ethereum.chainId);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts =  await ethereum.request({
        method: "eth_requestAccounts",
        params: [
          {
            eth_accounts: {}
          }
        ]
      });

      if (!isReturningUser) {
        // Runs only they are brand new, or have hit the disconnect button
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [
              {
                eth_accounts: {}
              }
            ]
          });
        }
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum && ethereum.chainId ==='0x4') {
        console.log("Retrieved total chainId...", ethereum.chainId);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else if (ethereum && ethereum.chainId !=='0x4') {
        console.log("Retrieved total chainId...", ethereum.chainId);
        alert("Please connect to the rinkeby network!");
        console.log("Ethereum object exists but not the right network!");
      } else {
        console.log("Retrieved total chainId...", ethereum.chainId);
        alert("Please connect to the rinkeby network!");
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const disconnectWallet =async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        setCurrentAccount("");
        isReturningUser = 1-isReturningUser;
        console.log("Account set to 0! Is this user returning?", isReturningUser);
      } else {
        console.log("No account detected!");
      }
    }
    catch (error) {
      console.log(error)
    }
  } 

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Abdou and I love computers and maths. <br/> Connect your Ethereum wallet and wave at me!
        </div>

        
        {currentAccount && (
          <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        )}

        {currentAccount && (
          <div className="bio" >
            Connected with address : {currentAccount}
          </div>)
        }

        {/*
        * If there is no currentAccount render this button
        */}
        {currentAccount && (
          <button className="disconnectButton" onClick={disconnectWallet}>
          Disconnect Wallet
          </button>
        )}
        {!currentAccount && (
          <button className="connectButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App