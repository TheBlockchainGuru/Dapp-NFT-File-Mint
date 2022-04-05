import { pinJSONToIPFS } from "./pinata.js";
import Web3 from 'web3'
import { getBnbFromEther } from "./convertCrypto.js";

const web3 = new Web3("https://bsc-dataseed.binance.org/")

const contractABI = require('../abi/contract-abi-bsc.json')
const contractAddress = "0x7f9b97D9BBD4ffd8135E7707E10f256030b5d30C";


export const bscConnectMetamaskWallet = async () => {
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

export const bscGetWalletConnected = async () => {
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

export const bscMintZIPNFT = async (url, name, description) => {
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
        "✅ Please check your transaction on bscscan.com " +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};
  
export const getBSCGasFee = async () => {
  const result = await web3.eth.getGasPrice();
  if(result) {
        console.log()
        let platformGasFee = await web3.utils.fromWei(result, 'ether')
        let mintFee = await getBnbFromEther(platformGasFee * 34584)

        return {
          platform: platformGasFee,
          mint: platformGasFee * 34584,
        }
  } else {
    return {
      platform: '',
      mint: ''
    }
  }
}