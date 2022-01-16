const Nilai = require("./config.RegexMe");
const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");

const Token = {
  validation: async (req, res, next) => {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      jwt.verify(token, Nilai, (error, decoded) => {
        if (error) return Response._.unauthorized(res, null, error.toString());
        req.decoded = decoded;
        next();
      });
    } catch (error) {
      console.log("error -> validation", error);
      return Response._.unauthorized(res, null, error.toString());
    }
  },
  validationToken: async (req, res, next) => {
    try {
      const token = req.body.token;
      jwt.verify(token, Nilai, (error, decoded) => {
        if (error) return Response._.unauthorized(res, null, error.toString());
        req.decoded = decoded;
        next();
      });
    } catch (error) {
      console.log("error -> validationToken", error);
      return Response._.unauthorized(res, null, error.toString());
    }
  },
  get: async (data) => {
    const token = await jwt.sign({ data: data }, Nilai, {
      expiresIn: "8h",
      algorithm: "HS384",
    });
    return token;
  },
};

module.exports = Token;
