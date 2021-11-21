const router = require("express").Router();
const Crypto = require("../config/config.EnDeCrypt");
const shortlinkNoPremium = require("../controllers/shortlinkNoPremium");

router.post("/create", Crypto._.decrypt, shortlinkNoPremium.create);
router.post("/go", Crypto._.decrypt, shortlinkNoPremium.go);

module.exports = router;
