const Nilai = require("./config.RegexMe");
const CryptoJS = require("crypto-js");
const Response = require("../helpers/response");

const Crypto = {
  decrypt: async (req, res, next) => {
    try {
      var bytes = CryptoJS.AES.decrypt(req.body.encrypt, Nilai.toString());
      req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      next();
    } catch (error) {
      console.log("error -> decrypt", error);
      return Response._.clientError(
        res,
        null,
        "error -> decryptCrypto ->" + error.toString()
      );
    }
  },
  encrypt: async (data) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      Nilai.toString()
    ).toString();
  },
  decryptPassword: async (data, res) => {
    try {
      var bytes = CryptoJS.AES.decrypt(data, Nilai.toString() + "|| Password");
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.log("error -> decryptPassword", error);
      return Response._.clientError(
        res,
        null,
        "error -> decryptPasswordCrypto ->" + error.toString()
      );
    }
  },
  encryptPassword: async (data) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      Nilai.toString() + "|| Password"
    ).toString();
  },
};

module.exports._ = Crypto;
