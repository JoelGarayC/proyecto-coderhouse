import multer from "multer";
import pathBase from "../utils/pathBase.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathBase + "/public/imgs"); // Indica la carpeta donde se almacenarán las imágenes subidas
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Indica el nombre que tendrá el archivo subido
  },
});

export const uploader = multer({ storage: storage });

