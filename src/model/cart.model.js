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
    }
}, {
    collection: 'mahadi_cart_table'
});

const products = mongo.model("mahadi_cart_table", product);

module.exports = products;

