const http = require("http");
const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 2000;

const server = http.createServer(app);

// console.log(port);
 
server.listen(port, () => {
    console.log(`Your server is running on ${process.env.HOST}`);
});