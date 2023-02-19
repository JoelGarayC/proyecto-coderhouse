import express from "express";
import routes from "./routes/index.routes.js";
import pathBase from "./utils/pathBase.js";

// app
const app = express();
const PORT = 8080;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", routes);

app.use("/", (_req, res) => {
  res.sendFile(pathBase, "/public/index.html");
});

// Listening App Server
app.listen(PORT, () => {
  console.log(`Listening in http://localhost:${PORT}`);
});
