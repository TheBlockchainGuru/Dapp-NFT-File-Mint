import { pinJSONToIPFS } from "./pinata.js";
import Web3 from 'web3'

const web3 = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")

// const web3 = new Web3("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")

const contractABI = require('../abi/contract-abi-ether.json')
const contractAddress = "0x10c7e12FccF3473c5123491EB36ffA40D2236796";


export const connectMetamaskWallet = async () => {
  if (window.ethereum) { 
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Fill text forms above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You should install Metamask in your browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "Connect to Metamask.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You should install Metamask in your browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(contractABI, contractAddress);
}

export const mintZIPNFT = async (url, name, description) => {
  //make metadata
  const metadata = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  console.log(metadata)

  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    return {
      success: true,
      status:
        "✅ Please check your transaction on rinkeby.etherscan.io " +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};
  

export const getRinkebyEtherGasFee = async () => {
    const result = await web3.eth.getGasPrice();
    if(result) {
          let platformGasFee = await web3.utils.fromWei(result, 'ether')
          let mintFee = platformGasFee * 546570

          return {
            platform: platformGasFee,
            mint: mintFee,
          }
    } else {
      return {
        platform: '',
        mint: ''
      }
    }
}