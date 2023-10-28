import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

const app = express();

// Ocultamos la información confidencial
dotenv.config();

// Conectar con la Base de Datos
conectarDB();
const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
    console.log(`Este servidor se encuentra corriendo en el puerto ${PORT}.`)
});
