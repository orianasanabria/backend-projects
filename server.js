const express = require('express');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const axios = require('axios');

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.set('port', process.env.PORT || 3000);

// Router
app.use(require('./routes'))

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

let products = [];

const message = [];

io.on("connection", (socket) => {
  console.log("Connected!");
  axios.get("http://localhost:3030/prodList.hbs").then((res) => {
    const template = res.data;
    socket.emit("data", { products, message, template });
  });
  socket.on("addProd", (prod) => {
    products.push(prod);
    io.sockets.emit("newProd", products);
  });
});

const PORT = 3030;
const server = httpServer.listen(PORT, () => {
  console.log(`Port ${server.address().port} listening`);
});

server.on("error", (error) => console.log("Oops, error:" + error));

// Start Server
// app.listen(app.get('port'), () => {
// 	console.log(`Server on Port ${app.get('port')}`)
// })
