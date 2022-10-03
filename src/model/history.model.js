const { default: mongoose } = require("mongoose");
const mongo = require("../db.config");

const product = new mongo.Schema({
    invoiceNo: {
        type: Number
    },
    date: {
        type: Date
    },
    customerName: {
        type: String,
    },
    customerAddress: {
        type: String,
    },
    contactNo: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pin: {
        type: String,
    },
    gstin: {
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
        hsn: {
            type: Number,
        },
        quantity: {
            type: Number,
        }
    }],
}, {
    collection: 'mahadi_history_table'
});

const products = mongo.model("mahadi_history_table", product);

module.exports = products;