import "dotenv/config";
import displayRoutes from "express-routemap";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
import App from "./app.js";
import { createHbs, validateMIME } from "./config.js";
import ProductManager from "./dao/fileSystem/managers/ProductManager.js";
import MessageManager from "./dao/mongoDb/managers/MessageManager.js";

const PORT = process.env.PORT || 8080;

const application = new App();
const server = http.createServer(application.app);
const product = new ProductManager();
const message = new MessageManager();

// configuracion socketio
export const io = new Server(server);

// Configuracion Handlebars como motor de plantillas
createHbs(application.app);
// Configuracion para aceptar js y css en public
validateMIME(application.app);

// Cuando un cliente se conecta, emite la lista actual
io.on("connection", async (socket) => {
  console.log(`Un nuevo cliente se ha conectado con el ID: ${socket.id}`);

  const products = await product.getProducts();
  io.emit("updateList", products);

  // Cuando el cliente agrega un elemento a la lista, actualiza la lista y emite el evento a todos los clientes conectados
  socket.on("submit-form", async (data) => {
    const { title, description, code, stock, price, category, thumbnails } =
      data;
    try {
      const imagesPromises = [];
      if (thumbnails.length > 0) {
        thumbnails.map(async (img) => {
          const imgData = Buffer.from(img.data.split(",")[1], "base64");
          const imgsDir = `${pathBase}/public/imgs`;
          if (!fs.existsSync(imgsDir)) {
            fs.mkdirSync(imgsDir);
          }
          const imgPath = `${imgsDir}/${img.name}`;
          const publicIndex = imgPath.indexOf("imgs");
          const relativePath = "/" + imgPath.slice(publicIndex);

          fs.writeFileSync(imgPath, imgData);
          imagesPromises.push({ name: img.name, path: relativePath });
        });
      }
      const images = await Promise.all(imagesPromises);

      const stockNumber = parseInt(stock);
      const priceNumber = parseInt(price);

      const newProduct = {
        title,
        description,
        code,
        stock: stockNumber,
        price: priceNumber,
        thumbnails: images,
        category,
      };
      const response = await product.addProduct(newProduct);
      socket.emit("form-response", { ok: true, message: response });

      // emite al cliente la actualización de los productos
      if (response.ok) {
        const products = await product.getProducts();
        io.emit("updateList", products);
      }
    } catch (err) {
      socket.emit("form-response", { ok: false, message: err.message });
      console.log(err.message);
    }
  });

  //evento de eliminar el producto
  socket.on("delete-product", async (id) => {
    try {
      const res = await product.deleteProduct(id);
      socket.emit("deleteProd-response", { ok: true, message: res });
    } catch (error) {
      socket.emit("deleteProd-response", { ok: false, message: err });
    }
  });

  // CHAT - MONGODB
  const msgs = await message.getMessages();
  io.emit("update-chat", msgs);

  socket.on("chat", async (data) => {
    try {
      const msg = {
        user: data.user,
        message: data.message,
      };
      const res = await message.addMessage(msg);
      if (res) {
        const updatedMsgs = await message.getMessages();
        io.emit("update-chat", updatedMsgs);
      } else {
        socket.emit("chat", "error");
      }
    } catch (error) {
      console.error(error);
      socket.emit("chat", "error");
    }
  });
});

// Listening App Server
server.listen(PORT, () => {
  displayRoutes(application.app);
  console.log(`Listening in http://localhost:${PORT}`);
});
