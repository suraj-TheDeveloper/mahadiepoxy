//importing models
const ProductModel = require("../model/product.model");

//front end
exports.indexPage = (req, res) => {
    ProductModel.find({}, (err, result) => {
        res.render("index.ejs", {data: result});
    });
}

exports.add = (req, res) => {
    res.render("addServices.ejs");
}

exports.showProduct = (req, res) => {
    ProductModel.find({}, (err, result) => {
        res.render("showproduct.ejs", {data: result});
    });
}

exports.cart = (req, res) => {
    res.render("cart.ejs");
}

exports.settings = (req, res) => {
    res.render("settings.ejs");
}

//backend
exports.addData = async (req, res) => {
    // console.log(req.body);
    const data = req.body;
    if(data.pname == "" || data.price == "") {
        res.render("addServices.ejs", {message: "Please fill the fields"});
    } else {
        const itemnumber = await ProductModel.findOne().sort({_id: -1}).exec();
        let number = itemnumber ? itemnumber.productId : 0;
        const product = new ProductModel({
            productId: ++number,
            name: data.pname,
            price: data.price,
            unit: data.unit,
            stock: data.stock,
            gst: data.gst
        });
        product.save((err, result) => {
            if(err) throw err;
            res.redirect("/");
        })
    }
}