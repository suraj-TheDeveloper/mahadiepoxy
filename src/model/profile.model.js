const mongo = require("../db.config");

const product = new mongo.Schema({
    clientName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gstin: {
        type: String,
        required: true
    },
    stateGstCode: {
        type: String,
        required: true
    },
    sgst: {
        type: String,
        required: true
    },
    cgst: {
        type: String,
        required: true
    },
    igst: {
        type: String,
        required: true
    }
}, {
    collection: 'mahadi_settings_table'
});

const products = mongo.model("mahadi_settings_table", product);

module.exports = products;