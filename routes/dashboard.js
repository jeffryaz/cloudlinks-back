const router = require("express").Router();
const Crypto = require("../config/config.EnDeCrypt");
const Dashboard = require("../controllers/dashboard");
const Token = require("../config/config.Jwt");

router.post(
  "/advertisement",
  Token.validation,
  Crypto._.decrypt,
  Dashboard.advertisement
);

module.exports = router;
