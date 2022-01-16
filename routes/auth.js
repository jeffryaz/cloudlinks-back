const router = require("express").Router();
const Crypto = require("../config/config.EnDeCrypt");
const auth = require("../controllers/auth");
const Token = require("../config/config.Jwt");

router.post("/register", Crypto._.decrypt, auth.register);
router.post(
  "/verify_email",
  Crypto._.decrypt,
  Token.validationToken,
  auth.verifyEmail
);
router.post("/login", Crypto._.decrypt, auth.login);
router.post("/re_verify_email", Crypto._.decrypt, auth.reVerifyEmail);
router.post("/forgot_password", Crypto._.decrypt, auth.getPassword);

module.exports = router;
