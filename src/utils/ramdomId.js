import crypto from "crypto";

export function randomId() {
  const fechaActual = Date.now().toString();
  const numeroAleatorio = Math.random().toString();
  const hash = crypto
    .createHash("sha256")
    .update(fechaActual + numeroAleatorio)
    .digest("hex");
  return hash;
}
