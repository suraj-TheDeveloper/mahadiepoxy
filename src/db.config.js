const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGOURL, (err) => {
    if(err) throw err;
    console.log("connected");
})

module.exports = mongoose;