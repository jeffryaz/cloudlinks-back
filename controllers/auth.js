const moment = require("moment");
const knex = require("../config/config.db");
const Crypto = require("../config/config.EnDeCrypt");
const Token = require("../config/config.Jwt");
const Response = require("../helpers/response");
const geoip = require("geoip-lite");
const Mail = require("../config/mailer/mailer");
const ejs = require("ejs");

const Auth = {
  register: async (req, res) => {
    try {
      const { name, email, password, ip4 } = req.body;
      let checkUser = await knex("user")
        .where({
          email,
        })
        .select();
      if (checkUser.length > 0)
        return Response._.clientOk(res, null, "registered user");
      const location = await geoip.lookup(ip4);
      const templateEmail = await Mail._.reader("registration");
      const getTokenVery = await Token.get({ name, email });
      const renderEmail = ejs.render(templateEmail, {
        link: process.env.BASE_HOST_FRONT + `/verification?id=${getTokenVery}`,
        location:
          location?.country && location.country == "ID" ? "indonesia" : "luar",
      });
      const encryptPassword = await Crypto._.encryptPassword(password);
      let item = {
        name,
        email,
        email_verified: false,
        password: encryptPassword,
        created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        latitude: location?.ll[0],
        longitude: location?.ll[1],
        country: location?.country,
        city: location?.city,
      };
      let respons = await knex
        .transaction(function (trx) {
          knex("user")
            .transacting(trx)
            .insert(item)
            .returning(["id", "name", "email", "created_at", "updated_at"])
            .then(function (resp) {
              return resp[0];
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function (resp) {
          return resp;
        });
      await Mail._.send(email, "Registration User", renderEmail, res);
      return Response._.clientOk(res, respons);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const { email } = req.decoded.data;
      let respons = await knex
        .transaction(function (trx) {
          knex("user")
            .transacting(trx)
            .where({ email, email_verified: false })
            .update(
              {
                email_verified: true,
                updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              },
              ["id", "name", "email", "created_at", "updated_at"]
            )
            .then(function (resp) {
              return resp[0];
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function (resp) {
          return resp;
        });
      if (!respons) return Response._.clientError(res, null, "verified email");
      return Response._.clientOk(res, respons);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      let respons = await knex("user").where({ email }).select();
      if (respons.length === 0)
        return Response._.clientOk(res, null, "user not found");
      respons = respons[0];
      if (respons.email_verified == false)
        return Response._.clientOk(res, null, "email not verified");
      const decryptPassword = await Crypto._.decryptPassword(respons.password);
      if (password != decryptPassword)
        return Response._.clientError(res, null, "password don't match");
      delete respons.password;
      const token = await Token.get(respons);
      respons.token = token;
      return Response._.clientOk(res, respons);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  reVerifyEmail: async (req, res) => {
    try {
      const { email, ip4 } = req.body;
      const location = await geoip.lookup(ip4);
      const templateEmail = await Mail._.reader("registration");
      const getTokenVery = await Token.get({ email });
      const renderEmail = ejs.render(templateEmail, {
        link: process.env.BASE_HOST_FRONT + `/verification?id=${getTokenVery}`,
        location:
          location?.country && location.country == "ID" ? "indonesia" : "luar",
      });
      await Mail._.send(email, "Registration User", renderEmail, res);
      return Response._.clientOk(res, null);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  getPassword: async (req, res) => {
    try {
      const { email, ip4 } = req.body;
      let respons = await knex("user").where({ email }).select();
      if (respons.length === 0)
        return Response._.clientOk(res, null, "user not found");
      respons = respons[0];
      const decryptPassword = await Crypto._.decryptPassword(respons.password);
      const location = await geoip.lookup(ip4);
      const templateEmail = await Mail._.reader("forgotPassword");
      const renderEmail = ejs.render(templateEmail, {
        password: decryptPassword,
        location:
          location?.country && location.country == "ID" ? "indonesia" : "luar",
      });
      await Mail._.send(email, "Get Password User", renderEmail, res);
      return Response._.clientOk(res, null);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
};
module.exports = Auth;
