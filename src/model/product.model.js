const { default: mongoose } = require("mongoose");
const mongo = require("../db.config");

const product = new mongo.Schema({
    productId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    }
}, {
    collection: 'mahadi_product_table'
});

const products = mongo.model("mahadi_product_table", product);

module.exports = products;