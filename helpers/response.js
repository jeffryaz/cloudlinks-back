const Crypto = require("../config/config.EnDeCrypt");
const Logger = require("../helpers/logger");

const Response = {
  clientOk: async (res, data, message = "OK", code = 200) => {
    const responst =
      process.env.NODE_ENV === "development"
        ? {
            code,
            message,
            data,
          }
        : await Crypto._.encrypt({
            code,
            message,
            data,
          });
    return res.status(200).json(responst);
  },
  clientError: async (res, data, message = "CLIENT_ERROR", code = 400) => {
    await Logger.error(message);
    const responst =
      process.env.NODE_ENV === "development"
        ? {
            code,
            message,
            data,
          }
        : await Crypto._.encrypt({
            code,
            message,
            data,
          });
    return res.status(400).json(responst);
  },
  unauthorized: async (res, data, message = "UNAUTORIZED", code = 401) => {
    await Logger.error(message);
    const responst =
      process.env.NODE_ENV === "development"
        ? {
            code,
            message,
            data,
          }
        : await Crypto._.encrypt({
            code,
            message,
            data,
          });
    return res.status(401).json(responst);
  },
};

module.exports._ = Response;
