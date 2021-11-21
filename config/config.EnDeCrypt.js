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
      console.log("error", error);
      return Response._.clientError(res, null, "Invalid Data");
    }
  },
  encrypt: async (data) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      Nilai.toString()
    ).toString();
  },
};

module.exports._ = Crypto;
