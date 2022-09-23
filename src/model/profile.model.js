const mongo = require("../db.config");

const product = new mongo.Schema({
    companyName: {
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
    }
}, {
    collection: 'mahadi_settings_table'
});

const products = mongo.model("mahadi_settings_table", product);

module.exports = products;