const { default: mongoose } = require("mongoose");
const mongo = require("../db.config");

const product = new mongo.Schema({
    customerName: {
        type: String,
    },
    customerAddress: {
        type: String,
    },
    contactNo: {
        type: String,
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
        },
        name: {
            type: String,
        },
        price: {
            type: mongoose.Types.Decimal128,
        },
        unit: {
            type: String,
        },
        gst: {
            type: Number,
        },
        quantity: {
            type: Number,
        }
    }],
}, {
    collection: 'mahadi_cart_table'
});

const products = mongo.model("mahadi_cart_table", product);

module.exports = products;