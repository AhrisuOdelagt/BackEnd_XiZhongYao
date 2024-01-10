import jwt from "jsonwebtoken";
import Paciente from "../models/Paciente.js";

const checkAuthPaciente = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.paciente = await Paciente.findById(decoded.id).select(
                "-namePaciente -surnamePaciente -passwordPaciente -telefonoPaciente -tarjetaPaciente -historialAnalisis -isConfirmed -citasPaciente -pedidosPaciente -carritoCompras -tokenPaciente"
            );
            return next();
        } catch (error) {
            return res.status(404).json({ msg: "La sesión ha expirado." });
        }
    }
    if (!token) {
        return res.status(401).json({ msg: "Hubo un error." });
    }
};

export default checkAuthPaciente;
