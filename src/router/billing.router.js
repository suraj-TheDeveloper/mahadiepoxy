const express = require("express");
const router = express.Router();

const indexController = require("../controller/index.controller");

router.get("/", indexController.indexPage);
router.get("/addservice", indexController.add);
router.post("/addservice", indexController.addData);
router.get("/products", indexController.showProduct);
router.get("/cart", indexController.cart);
router.get("/settings", indexController.settings);

module.exports = router;