const router = require("express").Router();
const Crypto = require("../config/config.EnDeCrypt");
const ShortlinkPremium = require("../controllers/shortlinkPremium");
const Token = require("../config/config.Jwt");

router.get("/list-product", Token.validation, ShortlinkPremium.listProduct);
router.post(
  "/create",
  Token.validation,
  Crypto._.decrypt,
  ShortlinkPremium.create
);
router.get(
  "/list-url-waiting-payment",
  Token.validation,
  ShortlinkPremium.listUrlWaitingPayment
);
router.post(
  "/status-choose-payment",
  Token.validation,
  Crypto._.decrypt,
  ShortlinkPremium.updateStatusChoosePayment
);

module.exports = router;
