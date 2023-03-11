import express from "express";
import { connectDB } from "./database/connectDB.js";
import routes from "./routes/index.routes.js";
import viewsRoutes from "./routes/views.routes.js";

class App {
  constructor() {
    this.app = express();
    this.connectDataBase();
    this.midlewares();
    this.routes();
  }

  connectDataBase() {
    connectDB();
  }

  midlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use("/", viewsRoutes);
    this.app.use("/api/v1", routes);
  }
}

export default App;
