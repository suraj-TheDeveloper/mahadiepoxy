//importing models
const ProductModel = require("../model/product.model");

//front end
exports.indexPage = (req, res) => {
    res.render("index.ejs")
}

exports.add = (req, res) => {
    res.render("addServices.ejs");
}

//backend
exports.addData = (req, res) => {
    // console.log(req.body);
    const data = req.body;
    if(data.pname == "" || data.price == "") {
        res.render("addServices.ejs", {message: "Please fill the fields"});
    } else {
        const product = new ProductModel({
            name: data.pname,
            price: data.price
        });
        product.save((err, result) => {
            if(err) throw err;
            res.redirect("/");
        })
    }
}