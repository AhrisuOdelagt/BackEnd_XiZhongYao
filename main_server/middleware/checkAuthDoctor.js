import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";

const checkAuthDoctor = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.doctor = await Doctor.findById(decoded.id).select(
                "-nameDoctor -surnameDoctor -passwordDoctor -telefonoDoctor -direccion -direccion_maps -isConfirmed -isAccepted -especialidad -documentos -tokenDoctor"
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

export default checkAuthDoctor;
