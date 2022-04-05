import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import ethereum from "../assets/images/ethereum.png"
import bnb from "../assets/images/bnb.png"
import solana from "../assets/images/solana.png"

import { getRinkebyEtherGasFee } from "../utils/etherMint";
import { getBSCGasFee } from "../utils/bscMint";

import { getPriceFromCrypto, getBnbFromEther } from "../utils/convertCrypto";

const MainPage = () => {
    const [network, setNetwork] = useState("ETHEREUM")
    const [gasfee, setGasFee] = useState()
    const [platformFee, setFlatformFee] = useState()
    const [totalMintCost, setTotalMintCost] = useState()
    const [totalUSD, setTotalUSD] = useState()

    let history = useHistory();

    const OnEtherClicked = () => {
        setNetwork("ETHEREUM")
        setRinkebyEtherFee()
    }

    const setRinkebyEtherFee = async () => {
        const { platform, mint } =  await getRinkebyEtherGasFee();
        setFlatformFee(platform + " ETH")
        setTotalMintCost(mint.toFixed(6) + " ETH")

        const {success, value} = await getPriceFromCrypto("ethereum", mint)
        if (success) {
            setTotalUSD(value.toFixed(3) + " USD")
        }
    }

    const setBSCFee = async () => {
        const {platform, mint} = await getBSCGasFee();
        setFlatformFee(platform + " BNB")
        setTotalMintCost(mint.toFixed(6) + " BNB")

        const {success, value} = await getPriceFromCrypto("bnb", mint)
        console.log(value)
        if (success) {
            setTotalUSD(value.toFixed(3) + " USD")
        }
    }

    const OnBSCClicked = () => {
        setNetwork("BSC")
        setBSCFee()

        getPriceFromCrypto()
    }

    const OnSolanaClicked = () => {
        setNetwork("SOLANA")
    }

    const OnProceedClicked = () => {
        switch (network) {
            case "ETHEREUM":
                history.push("/ether")
                break;
            case "BSC":
                history.push("/bsc");
                break;
            case "SOLANA":
                // history.push("/solana");
                window.location.href = "/goto/"
                break;
            default:
                break;
        }
    } 

    return (
        <div className="mainPage">
            <div>
                <h1 id="networkTitle">Block Chain Network Selection</h1>
                <br/>
                <br/>
                <div id="descriptionTitle">Select the <p id="networkId">block chain Network</p> from which you want to obtain NFT Token</div>
            </div>
            <br />
            <div className="networkPick">
                <div className={`ethereumStack ${ network === 'ETHEREUM' ? 'active' : '' }`}  onClick={OnEtherClicked}>
                    {/* <Link to="/ether"> */}
                        <button className="btn">
                            <img src={ethereum} alt="logo" />
                        </button>
                    {/* </Link> */}
                </div>
                <div className={`bnbStack ${ network === 'BSC' ? 'active' : '' }`} onClick={OnBSCClicked}>
                    {/* <Link to="/bsc"> */}
                        <button className="btn" >
                            <img src={bnb} />
                        </button>
                    {/* </Link> */}
                </div>
                <div className={`solanaStack ${ network === 'SOLANA' ? 'active' : '' }`} onClick={OnSolanaClicked}>
                    <button className="btn" >
                        <img src={solana} />
                    </button>
                </div>
            </div>

            <br />

            {
             network == 'SOLANA'?
                <p> You can see the mint price while you have choosen Solana network. </p> 
                :
                <>
                    <div className="mintFee">
                        <div>
                            <div className="networkNotice">You have selected <p id="networkId">{network}</p> Network</div>
                            <br />
                            <div className="customFee">
                                <p>Platform Gas Price: </p>
                                <p id="platformfee"> {platformFee} </p>
                            </div>
                        </div>
                        <div className="totalFee">
                            <p id="totalFeeTitle">Total NFT Minting Cost</p>
                            <p>{totalMintCost}</p>
                            <p>{totalUSD}</p>
                        </div>
                    </div>
                </>
            }
            <div className="proceed">
                <button id="proceed" onClick={OnProceedClicked}>PROCEED TO PAY</button>
            </div>
        </div>
    );
}

export default MainPage;