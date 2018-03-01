/**
 * Schemas for all of our IDM calls
 * Varies from KYC Checks to AML TXs
*/

  /**
   * For Stage One KYC Check 
   * @memberof KYC
   */
module.exports.STAGE_ONE_SCHEMA = {
    ph : { required: true},
    bfn : { required: true},
    bln : { required: true},
    tea : { required: true},
    ip : { required: true},
    dfp: { required: true},
    dft: { required: true},
    man : { required: true},
    tid : { required: true},
    stage : { required: true}
};

  /**
   * For Stage Two KYC Check 
   * @memberof KYC
   */
module.exports.STAGE_TWO_SCHEMA = {
    ph : { required: true},
    bfn : { required: true},
    bln : { required: true},
    dob : { required: true},
    bsn : { required: true},
    bc : { required: true},
    bs : { required: true},
    bz : { required: true},
    bco : { required: true},
    tea : { required: true},
    ip : { required: true},
    dfp: { required: true},
    dft: { required: true},
    man : { required: true},
    tid : { required: true},
    stage : { required: true}
};

  /**
   * For Stage Three KYC Check 
   * @memberof KYC
   */
module.exports.STAGE_THREE_SCHEMA = {
    ph : { required: true},
    bfn : { required: true},
    bln : { required: true},
    dob : { required: true},
    bsn : { required: true},
    bc : { required: true},
    bs : { required: true},
    bz : { required: true},
    bco : { required: true},
    tea : { required: true},
    assn : { required: true},
    scanData : { required: true},
    backsideImageData : { required: true},
    docType : { required: true},
    docCountry : { required: true},
    ip : { required: true},
    dfp: { required: true},
    dft: { required: true},
    man : { required: true},
    tid : { required: true},
    stage : { required: true}
};

  /**
   * For Card Redepemtion AML Log
   * @memberof AML
   */
module.exports.REDEMPTION_SCHEMA = {
    ph : { required: true},
    bfn : { required: true},
    bln : { required: true},
    bsn : { required: true},
    bc : { required: true},
    bs : { required: true},
    bz : { required: true},
    bco : { required: true},
    tea : { required: true},
    man : { required: true},
    amt : { required: true},
    ccy : { required: true},
    dphash : { required: true},
    phash : { required: true},
    memo : { required: true}
};

  /**
   * For Coin Purchase AML Log
   * @memberof AML
   */
module.exports.PURCHASE_SCHEMA = {
    ph : { required: true},
    bfn : { required: true},
    bln : { required: true},
    bsn : { required: true},
    bc : { required: true},
    bs : { required: true},
    bz : { required: true},
    bco : { required: true},
    tea : { required: true},
    man : { required: true},
    amt : { required: true},
    ccy : { required: true},
    dphash : { required: true},
    phash : { required: true},
    memo : { required: true}
};
