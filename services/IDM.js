const axios = require('axios');
const validate = require('./utils').validate;
const getBase64 = require('./utils').getBase64;
const schemas = require('./schemas');
require('dotenv').config();


/**
 * The IDM Class is a wrapper library used for communicating with the Identity Mind Global eDNA API.
 * Functionality is limited to KYC Consumer and AML TXs
 * 
 */

class IDM {
    /**
     * IDM Class Constructor
     * 
     * @param {any} apiKey 
     * @param {any} apiSecret 
     * @param {string} apiProtocol 
     * @param {string} apiHost 
     * @param {string} apiVersion 
     * 
     */
    constructor(
        apiKey = null,
        apiSecret = null,
        apiProtocol = 'https',
        apiHost = process.env.BASE_URL,
        apiVersion = 'v1.22'
    ) {
        this.__lastNonce = Math.floor(new Date().getTime() / 1000);
        this.__apiProtocol = apiProtocol;
        this.__apiHost = apiHost;
        this.__apiVersion = apiVersion;
        this.__apiKey = apiKey;
        this.__apiSecret = apiSecret;   
        this._url = `${this.__apiProtocol}://${this.__apiHost}`;
        //KYC: Consumer Application
        this.CONSUMER = "/im/account/consumer";
        this.MERCHANT = "/im/account/merchant";
        this.REDEEMPTION = "/im/account/transferin";
        this.PURCHASE = "/im/account/transferout";

        //Schemas
        this.STAGE_ONE_SCHEMA = schemas.STAGE_ONE_SCHEMA; 
        this.STAGE_TWO_SCHEMA = schemas.STAGE_TWO_SCHEMA; 
        this.STAGE_THREE_SCHEMA = schemas.STAGE_THREE_SCHEMA; 
        this.REDEMPTION_SCHEMA = schemas.REDEMPTION_SCHEMA;
        this.PURCHASE_SCHEMA = schemas.PURCHASE_SCHEMA;

        if(process.env.BASE_URL == "https://sandbox.identitymind.com/") {
            console.log(1);
            this.PASSWORD_IDM = process.env.SANDBOX_PASSWORD_IDM;
        } else if (process.env.BASE_URL == "https://staging.identitymind.com/") {
            this.PASSWORD_IDM = process.env.STAGING_PASSWORD_IDM;
        }

        this.config = {
            baseURL: process.env.BASE_URL,
            withCredentials: true,
            auth: {
                username: process.env.USERNAME_IDM,
                password: this.PASSWORD_IDM
            }
        };
    }
  /**
   * Gets API Signature
   * @returns {string} signature for headers
   *
   * @memberof IDM
   */
    getApiSig() {
       return'Basic ' + new Buffer(this.__apiKey + ':' + this.__apiSecret).toString('base64'); // Authorization Header
    }


  /**
   * Gets Nonce
   * @returns {string} nonce
   *
   * @memberof IDM
   */
    getNonce() {
        this.__lastNonce = Math.floor(new Date().getTime() / 1000);
        return this.__lastNonce;
    }


  /**
   * Universal function for executing a POST request on the eDNA API
   * 
   * @param {string} uri  
   * @param {string} requestData 
   * 
   * @returns {string} Response of POST request - Either response or err msg
   *
   * @memberof IDM
   */
    postRequest(uri, requestData) {       
        return axios.post(uri, requestData, this.config) 
            .then( (response) => { 
                return response; 
            })
            .catch( (err) => { 
                return err; 
            });   
    }

  /**
   * KYC Check for Each Stage
   * 
   * @param {object} consumerData  
   * @returns {object} Response of POST request - Either response or err msg
   *
   * @memberof IDM
   */
    evaluateConsumer(consumerData) {
        if (consumerData.stage == "1") {
            return validate(this.STAGE_ONE_SCHEMA, consumerData)
                .then( (res) => { 
                    return this.postRequest(this.CONSUMER, consumerData)
                        .then( (res) => { return res.data.res; });
                })
                .catch( (err) => { return err; } );           
        }
        if (consumerData.stage == "2") {
            return validate(this.STAGE_TWO_SCHEMA, consumerData)
                .then( (res) => { 
                    return this.postRequest(this.CONSUMER, consumerData)
                        .then( (res) => { return res.data.res; });
                })
                .catch( (err) => { return err; } );   
            
        }

        if (consumerData.stage == "3") {
            return validate(this.STAGE_THREE_SCHEMA, consumerData)
                .then( (res) => { 
                    return this.encodeImage(consumerData.scanData)
                        .then( (res) => { consumerData.scanData = res; })
                        .then( () => { 
                            return this.encodeImage(consumerData.backsideImageData)
                                .then( (res) => { consumerData.backsideImageData = res;})
                                .then ( () => { 
                                    return this.postRequest(this.CONSUMER, consumerData)
                                        .then( (res) => { return res.data.res; });
                                })
                                .catch ( (err) => { return err; });
                        })
                        .catch( (err) => { return err; });

                })
                .catch( (err) => { return err; } );   
        }
    }


  /**
   * AML Posting for Redemption of Pin
   * 
   * @param {object} consumerData  
   * @returns {object} Response of POST request - Either response or err msg
   *
   * @memberof IDM
   */
    postRedemption(consumerData) {
        return validate(this.REDEMPTION_SCHEMA, consumerData)
            .then( (res) => { 
                return this.postRequest(this.REDEEMPTION, consumerData)
                    .then( (res) => { return res.data.res; });
            })
            .catch( (err) => { return err } );          
    }

    
  /**
   * AML Posting for Purchase of a Coin
   * 
   * @param {object} consumerData  
   * @returns {object} Response of POST request - Either response or err msg
   *
   * @memberof IDM
   */
    postPurchase(consumerData) {
        return validate(this.PURCHASE_SCHEMA, consumerData)
            .then( (res) => { 
                return this.postRequest(this.PURCHASE, consumerData)
                    .then( (res) => { return res.data.res; });
            })
            .catch( (err) => { return err; } );     
    }

    encodeImage(url) {
        return getBase64(axios, url)
            .then( (res) => { return res; })
            .catch( (err) => { return err; });
    }



}

module.exports = IDM;

