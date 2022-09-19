const express = require("express");
const router = express.Router();

const indexController = require("../controller/index.controller");

router.get("/", indexController.indexPage);
router.get("/addservice", indexController.add);

module.exports = router;