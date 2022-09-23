const mongo = require("../db.config");

const product = new mongo.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    gstin: {
        type: String
    },
    gstStateCode: {
        type: String
    },
    product: [{
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
    }],
}, {
    collection: 'mahadi_cart_table'
});

const products = mongo.model("mahadi_cart_table", product);

module.exports = products;