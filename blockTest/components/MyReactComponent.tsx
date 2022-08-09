
//import './styles/App.css';
import * as React from "react";
import { ethers } from "ethers";
import contractAbi from '../artifacts/contractABI.json';
import  { useEffect, useState } from "react";
import { networks } from '../artifacts/networks.js';
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// Add the domain you will be minting

const CONTRACT_ADDRESS = '0xdB612ef569Fa7ab421F2E960Eb42984B08DD81B3';
declare var window: any


interface IMyReactComponentProps {}
const MyReactComponent: React.FC<IMyReactComponentProps> = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    // Add some state data propertie
    const [domain, setDomain] = useState('');
    const [record, setRecord] = useState('');
    const [network, setNetwork] = useState('');
    const [mints, setMints] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get MetaMask -> https://metamask.io/");
          return;
        }
  
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error)
      }
    }

    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log('Make sure you have metamask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
  
      const accounts = await ethereum.request({ method: 'eth_accounts' });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      setNetwork(networks[chainId]);
  
      ethereum.on('chainChanged', handleChainChanged);
  
      // Reload the page when they change networks
      function handleChainChanged(_chainId) {
        window.location.reload();
      }
    };

    // Render methods
    const renderNotConnectedContainer = () => (
  
      <div className="connect-wallet-container">
      
        {/* Call the connectWallet function we just wrote when the button is clicked */}
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
          Connect Wallet
              </button>
      </div>
    );
  
    // Form to enter domain name and data

    const switchNetwork = async () => {
      if (window.ethereum) {
        try {
          // Try to switch to the Mumbai testnet
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
          });
        } catch (error) {
          // This error code means that the chain we want has not been added to MetaMask
          // In this case we ask the user to add it to their MetaMask
          if (error.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x13881',
                    chainName: 'Polygon Mumbai Testnet',
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                    nativeCurrency: {
                      name: "Mumbai Matic",
                      symbol: "MATIC",
                      decimals: 18
                    },
                    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                  },
                ],
              });
            } catch (error) {
              console.log(error);
            }
          }
          console.log(error);
        }
      } else {
        // If window.ethereum is not found then MetaMask is not installed
        alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
      }
    }

    
  const renderInputForm = () => {
    if (network !== 'Polygon Mumbai Testnet') {
      return (
        <div className="connect-wallet-container">
          <p>Please connect to Polygon Mumbai Testnet</p>
          <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
        </div>
      );
    }
}  
  
    // This will take us into edit mode and show us the edit buttons!
    const editRecord = (name) => {
      console.log("Editing record for", name);
      setEditing(true);
      setDomain(name);
    }
    const fetchMints = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          // You know all this
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
  
          // Get all the domain names from our contract
         // const names = await contract.idToEvent();
          contract.idToEvent.call(0, function(err, result){
            if(!err){
               alert(result)
            }
        });
          
          //console.log(names);
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    // This will run any time currentAccount or network are changed
    useEffect(() => {
      if (network === 'Polygon Mumbai Testnet') {
        fetchMints();
      }
    }, [currentAccount, network]);
    useEffect(() => {
      checkIfWalletIsConnected();
    }, []);
  
    return (
      <div className="App">
        <div className="container">
          <div className="header-container">
            <header>
              <div className="left">
                <p className="title">Polygon Test</p>
              
              </div>
              {/* Display a logo and wallet connection status*/}
              <div className="right">

                {currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p>}
              </div>
            </header>
          </div>
  
          {!currentAccount && renderNotConnectedContainer()}
          { currentAccount && renderInputForm()
          }
         
          <div className="footer-container">
          
          </div>
        </div>
      </div>
    );
};
export default MyReactComponent;