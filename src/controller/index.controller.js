//importing packages
const numberwords = require("number-to-words");
const moment = require("moment");

//importing models
const ProductModel = require("../model/product.model");
const profileModel = require("../model/profile.model");
const historyModel = require("../model/history.model");
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

exports.showOne = (req, res) => {
    ProductModel.findById(req.params.id, (err, result) => {
        res.render("updateproduct.ejs", {data: result});
    });
}

exports.updateProduct = (req, res) => {
    ProductModel.findByIdAndUpdate(req.body.id, {
        name: req.body.pname,
        price: req.body.price,
        unit: req.body.unit,
        stock: req.body.stock,
        hsn: req.body.hsn
    }, (err, result) => {
        if(err) throw err;
        res.redirect("/products");
    })
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
    res.render("cart.ejs", {result: data, gst: sum.toFixed(2), gross: sum1.toFixed(2), message: ""});
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
    const result1 = await historyModel.findOne().sort({_id: -1}).exec();
    // console.log(result1);
    let datas = [];
    let gsttotal = [];
    let grosstotal = [];
    let total = {};
    let items = [];
    let sgstamount = [];
    let cgstamount = [];
    let costs = [];
    // console.log(result1);
    if(result1.state != "Tamil Nadu") {
        // console.log(result1.product);
        let itemcostt = [];
        result1.product.map(item => {
            // console.log(item);
            costs.push(Number(item.price));
            let itemcost = item.price * item.quantity;;
            let gstpercent = parseFloat(result.igst) / 100;
            let gstamount = gstpercent * itemcost;
            let grossamount = (((parseFloat("100%") / 100) + gstpercent) * itemcost);
            items.push(item.quantity);
            grosstotal.push(grossamount);
            gsttotal.push(gstamount);
            datas.push({
                productId: item.productId,
                name: item.name,
                price: item.price,
                unit: item.unit,
                hsn: item.hsn,
                quantity: item.quantity,
                // total: itemcost.toFixed(2),
                total: grossamount.toFixed(2),
                gstcost: gstamount.toFixed(2)
            });
        })      
        // console.log(itemcostt);
        let sum = 0;
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        for(i = 0; i < gsttotal.length; i++) {
            sum += gsttotal[i];
        } 
        for(j = 0; j < grosstotal.length; j++) {
            sum1 += grosstotal[j];
        } 
        for(k = 0; k < items.length; k++) {
            sum2 += items[k]
        }
        for(l = 0; l < costs.length; l++) {
            sum3 += costs[l];
        }
        console.log(sum3);
        total = {
            overallGst: sum.toFixed(2),
            overallAmt: sum1.toFixed(2),
            itemTotal: sum2,
            itemcost: sum3.toFixed(2),
            words: numberwords.toWords(sum1)
        }
        // console.log(datas);
    } else {
        result1.product.map(item => {
            // console.log(item);
            costs.push(item.price);
            let itemcost = item.price * item.quantity;
            let gstpercent = parseFloat(result.igst) / 100;
            let sgstpercent = parseFloat(result.sgst) / 100;
            let cgstpercent = parseFloat(result.cgst) / 100;
            let gstamount = gstpercent * itemcost;
            let cgstcost = cgstpercent * itemcost;
            let sgstcost = sgstpercent * itemcost;
            let grossamount = (((parseFloat("100%") / 100) + gstpercent) * itemcost);
            cgstamount.push(cgstcost);
            sgstamount.push(sgstcost);
            items.push(item.quantity);
            grosstotal.push(grossamount);
            gsttotal.push(gstamount);
            datas.push({
                productId: item.productId,
                name: item.name,
                price: item.price,
                unit: item.unit,
                hsn: item.hsn,
                quantity: item.quantity,
                // total: itemcost.toFixed(2),
                total: grossamount.toFixed(2),
                gstcost: gstamount.toFixed(2),
                cgstCost: cgstcost.toFixed(2),
                sgstCost: sgstcost.toFixed(2)
            });
        })      
        let sum = 0;
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        let sum4 = 0;
        let sum5 = 0;
        for(i = 0; i < gsttotal.length; i++) {
            sum += gsttotal[i];
        } 
        for(j = 0; j < grosstotal.length; j++) {
            sum1 += grosstotal[j];
        } 
        for(k = 0; k < items.length; k++) {
            sum2 += items[k]
        }
        for(l = 0; l < cgstamount.length; l++) {
            sum3 += cgstamount[l];
        }
        for(m = 0; m < sgstamount.length; m++) {
            sum4 += sgstamount[m];
        }
        // for(o = 0; o < costs.length; l++) {
        //     sum5 += costs[o];
        // }
        // console.log(costs);
        total = {
            overallGst: sum.toFixed(2),
            overallAmt: sum1.toFixed(2),
            itemTotal: sum2,
            // itemcost: sum5.toFixed(2),
            words: numberwords.toWords(sum1),
            overAllCgst: sum3.toFixed(2),
            overAllSgst: sum4.toFixed(2)
        }
        // console.log(datas);      
    }
    res.render("billing.ejs", {data: result, data1: result1, data2: datas, totals: total, invoice: result1.invoiceNo, date: moment(result1.date).format("DD-MM-YYYY")});
}

exports.listHistory = async (req, res) => {
    let history = await historyModel.find().exec();
    res.render("list.ejs", {list: history});
}

exports.invoiceHistory = async (req, res) => {
    const itemnumber = await ProductModel.findOne().sort({_id: -1}).exec();
    // console.log(itemnumber);
    const result = await profileModel.findOne().exec();
    const result1 = await historyModel.findById(req.params.id);
    // console.log(result1);
    let datas = [];
    let gsttotal = [];
    let grosstotal = [];
    let total = {};
    let items = [];
    let sgstamount = [];
    let cgstamount = [];
    let costs = [];
    // console.log(result1);
    if(result1.state != "Tamil Nadu") {
        // console.log(result1.product);
        let itemcostt = [];
        result1.product.map(item => {
            // console.log(item);
            costs.push(Number(item.price));
            let itemcost = item.price * item.quantity;;
            let gstpercent = parseFloat(result.igst) / 100;
            let gstamount = gstpercent * itemcost;
            let grossamount = (((parseFloat("100%") / 100) + gstpercent) * itemcost);
            items.push(item.quantity);
            grosstotal.push(grossamount);
            gsttotal.push(gstamount);
            datas.push({
                productId: item.productId,
                name: item.name,
                price: item.price,
                unit: item.unit,
                hsn: item.hsn,
                quantity: item.quantity,
                // total: itemcost.toFixed(2),
                total: grossamount.toFixed(2),
                gstcost: gstamount.toFixed(2)
            });
        })      
        // console.log(itemcostt);
        let sum = 0;
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        for(i = 0; i < gsttotal.length; i++) {
            sum += gsttotal[i];
        } 
        for(j = 0; j < grosstotal.length; j++) {
            sum1 += grosstotal[j];
        } 
        for(k = 0; k < items.length; k++) {
            sum2 += items[k]
        }
        for(l = 0; l < costs.length; l++) {
            sum3 += costs[l];
        }
        console.log(sum3);
        total = {
            overallGst: sum.toFixed(2),
            overallAmt: sum1.toFixed(2),
            itemTotal: sum2,
            itemcost: sum3.toFixed(2),
            words: numberwords.toWords(sum1)
        }
        // console.log(datas);
    } else {
        result1.product.map(item => {
            // console.log(item);
            costs.push(item.price);
            let itemcost = item.price * item.quantity;
            let gstpercent = parseFloat(result.igst) / 100;
            let sgstpercent = parseFloat(result.sgst) / 100;
            let cgstpercent = parseFloat(result.cgst) / 100;
            let gstamount = gstpercent * itemcost;
            let cgstcost = cgstpercent * itemcost;
            let sgstcost = sgstpercent * itemcost;
            let grossamount = (((parseFloat("100%") / 100) + gstpercent) * itemcost);
            cgstamount.push(cgstcost);
            sgstamount.push(sgstcost);
            items.push(item.quantity);
            grosstotal.push(grossamount);
            gsttotal.push(gstamount);
            datas.push({
                productId: item.productId,
                name: item.name,
                price: item.price,
                unit: item.unit,
                hsn: item.hsn,
                quantity: item.quantity,
                // total: itemcost.toFixed(2),
                total: grossamount.toFixed(2),
                gstcost: gstamount.toFixed(2),
                cgstCost: cgstcost.toFixed(2),
                sgstCost: sgstcost.toFixed(2)
            });
        })      
        let sum = 0;
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        let sum4 = 0;
        let sum5 = 0;
        for(i = 0; i < gsttotal.length; i++) {
            sum += gsttotal[i];
        } 
        for(j = 0; j < grosstotal.length; j++) {
            sum1 += grosstotal[j];
        } 
        for(k = 0; k < items.length; k++) {
            sum2 += items[k]
        }
        for(l = 0; l < cgstamount.length; l++) {
            sum3 += cgstamount[l];
        }
        for(m = 0; m < sgstamount.length; m++) {
            sum4 += sgstamount[m];
        }
        // for(o = 0; o < costs.length; l++) {
        //     sum5 += costs[o];
        // }
        // console.log(costs);
        total = {
            overallGst: sum.toFixed(2),
            overallAmt: sum1.toFixed(2),
            itemTotal: sum2,
            // itemcost: sum5.toFixed(2),
            words: numberwords.toWords(sum1),
            overAllCgst: sum3.toFixed(2),
            overAllSgst: sum4.toFixed(2)
        }
        // console.log(datas);      
    }
    res.render("history.ejs", {data: result, data1: result1, data2: datas, totals: total, invoice: result1.invoiceNo, date: moment(result1.date).format("DD-MM-YYYY")});
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
    // console.log(data);
    let igsts = Number(data.cgst) + Number(data.sgst);
    profileModel.findByIdAndUpdate(data.id, {
        companyName: data.companyname,
        address: data.address,
        phone: data.phone,
        email: data.email,
        gstin: data.gstin,
        stateGstCode: data.gstcode,
        cgst: data.cgst,
        sgst: data.sgst,
        igst: igsts
    }, (err, result) => {
        if(err) throw err;
        res.redirect("/");
    });
}

exports.customerDetails = async (req, res) => {
    let id = {};
    const data = req.body;
    const cart = await cartModel.find();
    let datas = [];
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
            datas.push({
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
    let productData = [];
    if(data.cname == "" || data.address == "" || data.phone == "" || data.gstcode == "" || data.city == "" || data.stt == "" || data.pin == "") {
        res.render("cart.ejs", {message: "Please fill the fields", result: datas});
    } else {
        // console.log(data);  
        const no = await cartModel.findOne().sort({_id: -1}).exec();
        const his = await historyModel.findOne().sort({_id: -1}).exec();
        // console.log(no);
        let noinc = his ? his.invoiceNo : 0;
        // console.log(++noinc);
        const todayDate = new Date();   
        const history = new historyModel({
            invoiceNo: ++noinc,
            date: todayDate,
            customerName: data.cname,
            customerAddress: data.address,
            contactNo: data.phone,
            city: data.city,
            state: data.stt,
            pin: data.pin,
            gstin: data.gstin,
            product: no.product
        });
        history.save((err, result) => {
            if(err) throw err;
            cartModel.deleteMany().exec();
            res.redirect("/invoice");
        })
    }
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