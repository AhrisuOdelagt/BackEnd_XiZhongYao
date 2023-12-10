import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import admistradorRoutes from "./routes/administradorRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import productoRoutes from "./routes/productoRoutes.js"

// Iniciamos la aplicación
const app = express();
app.use(express.json())

// Ocultamos la información confidencial
dotenv.config();

// Conectar con la Base de Datos
conectarDB();

// Permitimos peticiones por CORS
app.use(cors());

// Importamos la API Cloudinary para el manejo de imágenes
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLD_N, 
  api_key: process.env.APK, 
  api_secret: process.env.APS 
});

// Routing
app.use("/api/administradores", admistradorRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/doctores", doctorRoutes);
app.use("/api/productos", productoRoutes);

const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
    console.log(`Este servidor se encuentra corriendo en el puerto ${PORT}.`)
});
