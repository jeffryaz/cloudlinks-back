const router = require("express").Router();
const Crypto = require("../config/config.EnDeCrypt");
const ShortlinkNoPremium = require("../controllers/shortlinkNoPremium");

router.post("/create", Crypto._.decrypt, ShortlinkNoPremium.create);
router.post("/go", Crypto._.decrypt, ShortlinkNoPremium.go);

module.exports = router;
