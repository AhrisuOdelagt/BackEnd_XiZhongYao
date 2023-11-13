import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import admistradorRoutes from "./routes/administradorRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"


const app = express();
app.use(express.json())

// Ocultamos la información confidencial
dotenv.config();

// Conectar con la Base de Datos
conectarDB();

// Routing
app.use("/api/administradores", admistradorRoutes);
app.use("/api/pacientes", pacienteRoutes)
app.use("/api/doctor", doctorRoutes)

const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
    console.log(`Este servidor se encuentra corriendo en el puerto ${PORT}.`)
});
