import express from "express";
import { createHbs, validateMIME } from "./config.js";
import { connectDB } from "./database/connectDB.js";
import routes from "./routes/index.routes.js";

class App {
  constructor() {
    this.app = express();
    this.connectDataBase();
    this.config();
    this.midlewares();
    this.routes();
  }

  connectDataBase() {
    connectDB();
  }

  config() {
    // Configuracion Handlebars como motor de plantillas
    createHbs(this.app);
    // Configuracion para aceptar js y css en public
    validateMIME(this.app);
  }

  midlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use("/api/v1", routes);
  }
}

export default App;
