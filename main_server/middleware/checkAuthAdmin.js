import jwt from "jsonwebtoken";
import Administrador from "../models/Administrador.js";

const checkAuthAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.administrador = await Administrador.findById(decoded.id).select(
                "-nameAdmin -surnameAdmin -passwordAdmin -isConfirmed -isAdmin -listaPaciente -listaDoctoresPendientes -listaDoctoresAceptados -listaProductos -listaPedidos -tokenAdmin"
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

export default checkAuthAdmin;
