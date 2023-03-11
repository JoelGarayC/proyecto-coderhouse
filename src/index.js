import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import App from "./app.js";

const PORT = process.env.PORT || 8080;

const application = new App();
const server = http.createServer(application.app);

// configuracion socketio
export const io = new Server(server);

// Cuando un cliente se conecta, emite la lista actual
io.on("connection", async (socket) => {
  console.log(`Un nuevo cliente se ha conectado con el ID: ${socket.id}`);
});

// Listening App Server
server.listen(PORT, () => {
  console.log(`Listening in http://localhost:${PORT}`);
});
