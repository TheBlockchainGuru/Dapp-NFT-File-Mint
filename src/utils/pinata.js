const key = "3ec6e5bad6c152f9c93d"
const secret = "a3ccf4d2216ab2655ada4cff4273db391574632702711c2e0c80e435bb45e7af"

const axios = require('axios');

export const pinFileToIPFS = (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    let formData = new FormData();
    formData.append('file', file);

    return axios.post(url,
        formData,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${formData._boundary}`,
                'pinata_api_key': key,
                'pinata_secret_api_key': secret
            }
        }
    ).then(function (response) {
        //handle response here
        console.log(response)
        return {
            success: true,
            pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        }
    }).catch(function (error) {
        //handle error here
        console.log(error)
        return {
            success: false,
            message: error.message,
        }
    });
};

export const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
           
    });
};


