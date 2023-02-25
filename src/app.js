import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createHbs, validateMIME } from "./config.js";
import routes from "./routes/index.routes.js";
import ProductManager from "./store/ProductManager.js";

const product = new ProductManager();

// app
const PORT = 8080;
const app = express();
const server = http.createServer(app);

// configuracion socketio
export const io = new Server(server);

// Configuracion Handlebars como motor de plantillas
createHbs(app);
// Configuracion para aceptar js y css en public
validateMIME(app);

// Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public"));
app.use("/", routes);


// Cuando un cliente se conecta, emite la lista actual
io.on('connection', async (socket) => {

  const products = await product.getProducts();
  io.emit('updateList', products);

  // Cuando el cliente agrega un elemento a la lista, actualiza la lista y emite el evento a todos los clientes conectados
  socket.on('submit-form', async (data) => {
    const { title, description, code, stock, price, category } = data;
    try {
      const stockNumber = parseInt(stock);
      const priceNumber = parseInt(price);
      const newProduct = {
        title,
        description,
        code,
        stock: stockNumber,
        price: priceNumber,
        thumbnails: [],
        category,
      };
      const response = await product.addProduct(newProduct);
      socket.emit('form-response', { ok: true, message: response });
      console.log(response);

      // emite al cliente la actualización de los productos
      io.emit('updateList', products);
    } catch (err) {
      socket.emit('form-response', { ok: false, message: err });
    }
  });

  socket.on('delete-product', async (id) => {
    try {
      const res = await product.deleteProduct(id);
      socket.emit('deleteProd-response', { ok: true, message: res });
    } catch (error) {
      socket.emit('deleteProd-response', { ok: false, message: err });
    }
  })
})

// Listening App Server
server.listen(PORT, () => {
  console.log(`Listening in http://localhost:${PORT}`);
});

