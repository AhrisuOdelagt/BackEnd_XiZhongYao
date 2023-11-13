import Administrador from "../models/Administrador.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRestablecer } from "../helpers/emails.js";

// Autenticación, Registro y Confirmación de Administradores
const registrarAdministrador = async (req, res) => {
    // Evitamos registros duplicados (con el mismo correo)
    const { emailAdmin } = req.body;
    const existeAdmin = await Administrador.findOne({ emailAdmin });
    if (existeAdmin) {
        const error = new Error("Este administrador ya está registrado.");
        return res.status(400).json({ msg: error.message});
    }
    try {
        const administrador = new Administrador(req.body);
        // Generamos el username
        administrador.usernameAdmin = administrador.nameAdmin + " " + administrador.surnameAdmin;
        // Generamos el token
        administrador.tokenAdmin = generarId();
        await administrador.save();
        // Enviamos el email de confirmación
        emailRegistro({
            email: administrador.emailAdmin,
            nombre: administrador.usernameAdmin,
            token: administrador.tokenAdmin
        });
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
    if (await administrador.comprobarPassword(passwordAdmin)) {
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

const olvidePassword = async (req, res) => {
    const { emailAdmin } = req.body;
    // Verificamos que el administrador exista
    const administrador = await Administrador.findOne({ emailAdmin });
    if (!administrador) {
        const error = new Error("El administrador no existe.")
        return res.status(404).json({ msg: error.message});
    }
    try {
        administrador.tokenAdmin = generarId();
        await administrador.save();
        // Enviamos el email para restablecer la contraseña
        emailRestablecer({
            email: administrador.emailAdmin,
            nombre: administrador.usernameAdmin,
            token: administrador.tokenAdmin
        });
        res.json({ msg: "Se ha enviado un email con instrucciones." });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { tokenAdmin } = req.params;
    // Verificamos que el token exista dentro de la BD
    const tokenValido = await Administrador.findOne({ tokenAdmin });
    if (tokenValido) {
        res.json({ msg: "Token válido." });
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

const nuevoPassword = async (req, res) => {
    const { tokenAdmin } = req.params;
    const { passwordAdmin } = req.body;
    // Verificamos que el token exista dentro de la BD
    const administrador = await Administrador.findOne({ tokenAdmin });
    if (administrador) {
        administrador.passwordAdmin = passwordAdmin;
        administrador.tokenAdmin = undefined;
        await administrador.save();
        res.json({ msg: "Se ha completado la operación correctamente." });
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

// Dejar esta función siempre para el final del archivo
const perfil = async (req, res) => {
    
}

export { registrarAdministrador,
    loginAdministrador,
    confirmarAdministrador,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil };
