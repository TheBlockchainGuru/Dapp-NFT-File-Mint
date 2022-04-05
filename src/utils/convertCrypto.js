const etherPriceUrl = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
const binanceUrl = "https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=GAXZGCUB6WF4QQZIUJKH3VA7UWXRQDTQEE"
const axios = require('axios');

export const getPriceFromCrypto = async (currency, amount) => {
    if (currency == "ethereum") {
        return await axios.get(etherPriceUrl)
        .then(function (response) {
            console.log(response)
            const price = response.data.ethereum.usd
            return {
                success: true,
                value: price * amount,
            }
        }).catch(function (error) {
            return {
                success: false,
                message: error.message,
            }
        });
    } else if (currency == "bnb") {
        return await axios.get(binanceUrl)
        .then(function (response) {
            console.log(response)
            const price = response.data.result.ethusd
            return {
                success: true,
                value: price * amount,
            }
        }).catch(function (error) {
            return {
                success: false,
                message: error.message,
            }
        });
    } else {
        return {
            success: false,
            message: "Error network!"
        }
    }
}

export const getBnbFromEther = async (amount) => {
    let bnb, ether;
    await axios.get(binanceUrl)
    .then(function(response) {
        bnb = response.data.result.ethusd
    })

    await axios.get(etherPriceUrl)
    .then(function(response) {
        ether = response.data.ethereum.usd
    })

    return bnb/ether
}