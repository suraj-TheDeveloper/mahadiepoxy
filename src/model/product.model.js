const mongo = require("../db.config");

const product = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
}, {
    collection: 'mahadi_product_table'
});

const products = mongo.model("mahadi_product_table", product);

module.exports = products;

