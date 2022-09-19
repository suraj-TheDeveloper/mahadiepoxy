const http = require("http");
const app = require("./app");
require("dotenv").config();

const port = 2000 || process.env.PORT;

const server = http.createServer(app);

console.log(port);
 
server.listen(port);