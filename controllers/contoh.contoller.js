const moment = require("moment");
const knex = require("../config/config.db");
// const Crypto = require("../config/config.EnDeCrypt");
const Token = require("../config/config.Jwt");
const Response = require("../helpers/response");

const ContohController = {
  contoh_1: async (req, res, next) => {
    try {
      var data = { token: await Token.get({ id: "test" }) };
      return Response._.clientOk(res, data);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  contoh_2: async (req, res, next) => {
    try {
      var data = {
        bodyDecoded: req.body,
        resultQuery: await knex.select().from("employees"),
      };
      return Response._.clientOk(res, data);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  contoh_3: async (req, res, next) => {
    try {
      return res.status(200).send({ response: "I am alive" });
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
};
module.exports = ContohController;
