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
        type: String,
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
        type: String,
        required: true
    }
}, {
    collection: 'mahadi_product_table'
});

const products = mongo.model("mahadi_product_table", product);

module.exports = products;

