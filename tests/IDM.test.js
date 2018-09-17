const IDM = require('../lib/IDM');
const assert = require('chai').assert;

var idm = new IDM();


describe('Test IDM KYC', () => {

    var values = {
        ph : "2514218828",
        bfn : "Fred",
        bln : "Smith",
        tea : "fredsmith@gmailc.om",
        ip : "68.113.83.95",
        dfp: "15197168100864009711057120523936390628035",
        dft: "AU",
        man : "2514218828",
        tid : "2514218828",
        stage : "1"
    };

    it('validate items', () => {
        assert.exists(idm);
    });

    it('test api-sig', () => {
        assert.isString(idm.getApiSig());
    });

    it('test nonce', () => {
        let nonce = idm.getNonce();
        setTimeout (() => {
            expect(idm.getNonce()).toBeGreaterThan(nonce);
        }, 2000);
    });

    it('should successfully call API', () => {
        return idm.postRequest('/im/account/consumer', values)
            .then( (res) => {
                expect(res.status).toBe(200);
                expect(res.data.tid).toBe(values.tid)
        });
    });

    it('should able to make stage one kyc call', () => {
        return idm.evaluateConsumer(values)
            .then( (res) => {
                return expect(res).toBe("ACCEPT");
        });
    });

    it('should NOT be able to make stage one kyc call', () => {
        values.bfn = null;
        return idm.evaluateConsumer(values)
            .then( (res) => {
                values.bfn = "Fred";
                return expect(res).toBe("Missing Required Field");
        });
        
    });

    it('should NOT be able to make stage two kyc call', () => {
        values.stage = "2";
        return idm.evaluateConsumer(values)
            .then(()=>{})
            .catch((err) => { expect(err).toBe("Missing Required Field"); });  
    });


    it('should be able to make stage two kyc call', () => {
        values = Object.assign({}, values, {
            dob : "1992-02-01",
            bsn : "42 Wallaby Way",
            bc : "Sydney",
            bs : "New South Wales",
            bz : "2000",
            bco : "AU",
        })
        return idm.evaluateConsumer(values)
            .then( (res) => {
                expect(res).toBe("ACCEPT");
        });
    });

    it('should be able to make stage three kyc call', () => {
        values = Object.assign({}, {
            ph : "2564278828",
            bfn : "Fred",
            bln : "Smith",
            dob : "1992-02-01",
            bsn : "42 Wallaby Way",
            bc : "Sydney",
            bs : "New South Wales",
            bz : "2000",
            bco : "AU",
            tea : "fredsmith@gmailc.om",
            ip : "68.113.83.95",
            dfp: "15197168100864009711057120523936390628035",
            dft: "AU",
            man : "2564278828",
            tid : "2564278828",
            assn : "US:123456789",
            scanData : "http://www.policestateusa.com/wp-content/uploads/2015/01/REAL-id-sample.jpg",
            backsideImageData : "http://www.policestateusa.com/wp-content/uploads/2015/01/REAL-id-sample.jpg",
            docType : "DL",
            docCountry : "US",
            stage: "3"
        });
        return idm.evaluateConsumer(values)
            .then( (res) => {
                expect(res).toBe("ACCEPT");
        });
    });

    it('should be able to do a redeem AML call', () => {

        values = Object.assign({}, {
            ph : "2564278828",
            bfn : "Fred",
            bln : "Smith",
            bsn : "42 Wallaby Way",
            bc : "Sydney",
            bs : "New South Wales",
            bz : "2000",
            bco : "AU",
            tea : "fredsmith@gmailc.om",
            man : "2564278828",
            amt : 100,
            ccy : "AUD",
            dphash : "YC_WALLET",
            phash: "PIN",
            memo: "#53424343243278"
        });

        return idm.postRedemption(values)
            .then( (res) => {
                expect(res).toBe("ACCEPT");
        });
    });

    it('should NOT be able to do a redeem AML call', () => {

        values.memo = null;
        return idm.postRedemption(values)
            .then(()=>{values.memo = "#53424343243278";})
            .catch((err) => { expect(err).toBe("Missing Required Field"); });  
    });

    it('should be able to do a purchase AML call', () => {
        values = Object.assign({}, {
            ph : "2564278828",
            bfn : "Fred",
            bln : "Smith",
            bsn : "42 Wallaby Way",
            bc : "Sydney",
            bs : "New South Wales",
            bz : "2000",
            bco : "AU",
            tea : "fredsmith@gmailc.om",
            man : "2564278828",
            amt : 100,
            ccy : "AUD",
            dphash : "YC_WALLET",
            phash: "PIN",
            memo: "#53424343243278"
        });
        return idm.postPurchase(values)
            .then( (res) => {
                console.log(res);
                expect(res).toBe("ACCEPT");
        });
    });

    it('should NOT be able to do a purchase AML call', () => {
        values = Object.assign({}, {
            bfn : "Fred",
            bln : "Smith",
            bsn : "42 Wallaby Way",
            bc : "Sydney",
            bs : "New South Wales",
            bz : "2000",
            bco : "AU",
            tea : "fredsmith@gmailc.om",
            man : "2564278828",
            amt : 100,
            ccy : "AUD",
            dphash : "YC_WALLET",
            phash: "PIN",
            memo: "#53424343243278"
        });
        return idm.postPurchase(values)
            .then( (res) => {
                expect(res).toBe("Missing Required Field");
        });
    });




})













 

