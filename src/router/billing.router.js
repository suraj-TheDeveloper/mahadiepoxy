const express = require("express");
const router = express.Router();

const indexController = require("../controller/index.controller");

router.get("/", indexController.indexPage);
router.get("/addservice", indexController.add);
router.post("/addservice", indexController.addData);
router.get("/products", indexController.showProduct);
router.get("/cart", indexController.cart);
router.get("/settings", indexController.settings);
router.post("/settingsupdate", indexController.saveSettings);
router.post("/addtocart", indexController.addToCart);
router.post("/addtocart/customer", indexController.customerDetails);
router.get("/invoice", indexController.invoice);
router.get("/list", indexController.listHistory);
router.get("/list/:id", indexController.invoiceHistory);
router.get("/products/:id", indexController.showOne);
router.post("/products/update", indexController.updateProduct);

module.exports = router;