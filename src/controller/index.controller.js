//importing models
const ProductModel = require("../model/product.model");
const profileModel = require("../model/profile.model");
const cartModel = require("../model/cart.model");
const { default: mongoose } = require("mongoose");

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

exports.cart = async (req, res) => {
    // console.log(req.body);
    const cart = await cartModel.find();
    let data = [];
    let gsttotal = [];
    let grosstotal = [];
    let total = [];
    cart.map(item => {
        // console.log(item);
        item.product.map(items => {
            // console.log(items);
            let itemcost = items.price * items.quantity;
            let gstpercent = parseFloat(items.gst) / 100;
            let gstamount = gstpercent * itemcost;
            let grossamount = (((parseFloat("100%") / 100) + gstpercent) * itemcost);
            grosstotal.push(grossamount);
            gsttotal.push(gstamount);
            data.push({
                productId: items.productId,
                name: items.name,
                price: items.price,
                unit: items.unit,
                hsn: items.hsn,
                quantity: items.quantity,
                total: itemcost.toFixed(2),
                // total: grossamount.toFixed(2),
                // gstcost: gstamount.toFixed(2)
            });
        });
    })      
    let sum = 0;
    let sum1 = 0;
    for(i = 0; i < gsttotal.length; i++) {
        sum += gsttotal[i];
    } 
    for(j = 0; j < grosstotal.length; j++) {
        sum1 += grosstotal[j];
    } 
    // console.log(data);
    res.render("cart.ejs", {result: data, gst: sum.toFixed(2), gross: sum1.toFixed(2)});
}

exports.settings = (req, res) => {
    profileModel.findOne({}, (err, result) => {
        if(err) throw err;
        res.render("settings.ejs", {data: result});
    });
}

exports.invoice = async (req, res) => {
    const itemnumber = await ProductModel.findOne().sort({_id: -1}).exec();
    // console.log(itemnumber);
    const result = await profileModel.findOne().exec();
    const result1 = await cartModel.findOne().exec();
    // console.log(result1);
    res.render("billing.ejs", {data: result, data1: result1});
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
            hsn: data.hsn
        });
        product.save((err, result) => {
            if(err) throw err;
            res.redirect("/");
        })
    }
}

exports.saveSettings = (req, res) => {
    const data = req.body;
    profileModel.findByIdAndUpdate(data.id, {
        clientName: data.companyname,
        address: data.address,
        phone: data.phone,
        email: data.email,
        gstin: data.gstin,
        stateGstCode: data.gstcode,
        cgst: data.cgst,
        sgst: data.sgst,
        igst: data.isgt
    }, (err, result) => {
        if(err) throw err;
        res.redirect("/");
    });
}

exports.customerDetails = async (req, res) => {
    let id = {};
    const data = req.body;
    console.log(data);
    const cartdata = await cartModel.find().sort({_id: -1}).exec();
    for (i = 0; i < cartdata.length; i++) {
        id = {
            cartId: cartdata[i]._id
        }
    }
    cartModel.findByIdAndUpdate(id.cartId, { 
        customerName: data.cname,
        customerAddress: data.address,
        contactNo: data.phone,
        gstin: data.gstin,
        gstStateCode: data.gstcode,
        city: data.city,
        state: data.stt,
        pin: data.pin,
        gstin: data.gstin
    }, (err, result) => {
        if(err) throw err;
        res.redirect("/invoice");
    });
}

exports.addToCart = async (req, res) => {
    // console.log("data");
    const record = req.body;
    const cartdata = await cartModel.find().exec();
    if(cartdata.length == 0) {
        // console.log(record);
        let data = {
            productId: record.productid,
            name: record.name,
            price: record.price,
            unit: record.unit,
            quantity: record.quantity,
            hsn: record.hsn
        }
        // console.log(data);
        const addcart = new cartModel({
            customerName: '',
            customerAddress: '',
            contactNo: '',
            gstin: '',
            gstStateCode: '',
            product: data
        });
        addcart.save((err, result) => {
            if(err) throw err;
            ProductModel.findOneAndUpdate({productId: record.productid}, {$inc: { stock: -record.quantity }}, (err, result) => {
                if(err) throw err;
                res.redirect("/");
            });
        })
    } else {
        let id = {};
        const cartdata = await cartModel.find().sort({_id: -1}).exec();
        for (i = 0; i < cartdata.length; i++) {
            id = {
                cartId: cartdata[i]._id
            }
        }
        let data = {
            productId: record.productid,
            name: record.name,
            price: record.price,
            unit: record.unit,
            quantity: record.quantity,
            hsn: record.hsn
        }
        cartModel.findByIdAndUpdate(id.cartId, {$push: { product: data }}, (err, result) => {
            if(err) throw err;
            ProductModel.findOneAndUpdate({productId: record.productid}, {$inc: { stock: -record.quantity }}, (err, result) => {
                if(err) throw err;
                res.redirect("/");
            });
        });
    }
}