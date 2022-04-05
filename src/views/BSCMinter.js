import { useEffect, useState } from "react";
import {
  bscConnectMetamaskWallet,
  bscGetWalletConnected,
  bscMintZIPNFT
} from "../utils/bscMint";
import { pinFileToIPFS } from "../utils/pinata.js";

const BSCMinter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [url, setURL] = useState("");
  var url = ""
 
  useEffect(async () => {
    const {address, status} = await bscGetWalletConnected();
    setWallet(address)
    setStatus(status);
    
    walletDetecter(); 
  }, []);

  const connectWalletClicked = async () => {
    const response = await bscConnectMetamaskWallet();
    setStatus(response.status);
    setWallet(response.address);
  };

  function walletDetecter() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("Please connect to Metamask.");
        }
      });
    } else {
      setStatus(
        <p>
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You should install Metamask in your browser.
          </a>
        </p>
      );
    }
  }
  
  const setUploadZipToPinata = async () => {
    if (selectedFile == null)
      return;

    const waitStatus = "Please wait.";
    setStatus(waitStatus)
    var pinataResponse  = await pinFileToIPFS(selectedFile)
    if (pinataResponse.success) {
      console.log(pinataResponse.pinataUrl)
      // setURL(pinataResponse.pinataUrl)
      url = pinataResponse.pinataUrl
      return true;
    } else {
      return false;
    }
  }

  const onMintPressed = async () => {
    if (walletAddress == "")
      return;

    var uploadSuccess = await setUploadZipToPinata();

    if (url.trim() == "" || name.trim() == "" || description.trim() == "") {
      const typeError = "Please make sure all fields are completed before minting."
      setStatus(typeError);
      return;
    }

    if (uploadSuccess) {
      const { success, status } = await bscMintZIPNFT(url, name, description);
      setStatus(status);
      if (success) {
        setName("");
        setDescription("");
        url = ""
      }
    } else {
      const retryStatus = "Please retry to mint.";
      setStatus(retryStatus)      
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletClicked}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">File Mint on BSC</h1>
      <p>
        Please select a file and fill name & description, then press "Mint"
      </p>
      <form>
        <h2>Select the file</h2>
        <p>You can select only .zip .rar .mp3 .mp4 .avi files.</p>
        <input 
          type="file"
          accept=".zip,.rar,.mp3,.mp4,.avi"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <h2> Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first zip NFT"
          onChange={(event) => setName(event.target.value)}
        />
        <h2> Description: </h2>
        <input
          type="text"
          placeholder="e.g. Technical asset NFT"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint
      </button>
      <p id="statusLabel">Status</p>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default BSCMinter;
