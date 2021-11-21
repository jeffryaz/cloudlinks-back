const router = require("express").Router();
const ContohController = require("../controllers/contoh.contoller");
const Token = require("../config/config.Jwt");
const Crypto = require("../config/config.EnDeCrypt");

router.get("/contoh_3", ContohController.contoh_3);
router.get("/contoh_1", ContohController.contoh_1);
router.post(
  "/contoh_2",
  Token.validation,
  Crypto._.decrypt,
  ContohController.contoh_2
);

module.exports = router;
