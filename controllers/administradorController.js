import Administrador from "../models/Administrador.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

// Autenticación, Registro y Confirmación de Administradores
const registrarAdministrador = async (req, res) => {
    // Evitamos registros duplicados (con el mismo correo)
    const { emailAdmin } = req.body;
    const existeAdmin = await Administrador.findOne({ emailAdmin });
    if (existeAdmin) {
        console.log(existeAdmin);
        const error = new Error("Este administrador ya está registrado.");
        return res.status(400).json({ msg: error.message});
    }
    try {
        const administrador = new Administrador(req.body);
        // Generamos el username
        administrador.usernameAdmin = administrador.nameAdmin + " " + administrador.surnameAdmin;
        // Generamos el token
        administrador.tokenAdmin = generarId();
        const administradorAlmacenado = await administrador.save();
        console.log(administradorAlmacenado);
        res.json({ msg: "Administrador registrado correctamente." });
    } catch (error) {
        console.log(error);
    }
};

const loginAdministrador = async (req, res) => {
    // Comprobamos que el administrador exista
    const { emailAdmin, passwordAdmin } = req.body;
    const administrador = await Administrador.findOne({ emailAdmin });
    if (!administrador) {
        const error = new Error("El administrador no existe.")
        return res.status(404).json({ msg: error.message});
    }

    // Comprobamos que el administrador esté confirmado
    if (!administrador.isConfirmed) {
        const error = new Error("Esta cuenta de administrador no está confirmada.");
        return res.status(403).json({ msg: error.message});
    }

    // Comprobamos la password
    if (await administrador.comprobarPassword) {
        res.json({ 
            _id: administrador._id,
            nameAdmin: administrador.nameAdmin,
            surnameAdmin: administrador.surnameAdmin,
            usernameAdmin: administrador.usernameAdmin,
            emailAdmin: administrador.emailAdmin,
            token: generarJWT(administrador._id)
         });
    }
    else {
        const error = new Error("La contraseña ingresada es incorrecta.");
        return res.status(403).json({ msg: error.message});
    }
};

const confirmarAdministrador = async (req, res) => {
    const { tokenAdmin } = req.params;
    const adminConfirmar = await Administrador.findOne({ tokenAdmin });
    if (adminConfirmar) {
        try {
            adminConfirmar.isConfirmed = true;
            adminConfirmar.isAdmin = true;
            adminConfirmar.tokenAdmin = undefined;
            await adminConfirmar.save();
            res.json({ msg: "Cuenta confirmada con éxito." });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

export { registrarAdministrador,
    loginAdministrador,
    confirmarAdministrador };
