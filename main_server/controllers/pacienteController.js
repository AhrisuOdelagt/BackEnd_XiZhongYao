import Paciente from "../models/Paciente.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRestablecer } from "../helpers/emails.js";
import { cifrar, descifrar } from "../helpers/cifrar_descifrar.js";

//Autenticacion, registro y confirmacion de Pacientes

const registrarPaciente = async (req, res) => {
    //Evitamos correos duplicados
    let {emailPaciente} = req.body;
    emailPaciente = cifrar(emailPaciente)
    const existePaciente = await Paciente.findOne({emailPaciente})
    if (existePaciente) {
        console.log(existePaciente)
        const error = new Error("Este correo ya ha sido usado")     //Confirmar mensaje
        return res.status(400).json({msg: error.message});
    }

    emailPaciente = descifrar(emailPaciente)
        
    try {
        const paciente = new Paciente(req.body)
        //Generamos el username
        paciente.usernamePaciente = paciente.namePaciente + " " + paciente.surnamePaciente;
        //Generamos el token
        paciente.tokenPaciente = generarId();
        const pacienteAlmacenado = await paciente.save();
        console.log(pacienteAlmacenado);

        //Enviamos el email de confirmación
        emailRegistro({
            email: paciente.emailPaciente,
            nombre: paciente.usernamePaciente,
            token: paciente.tokenPaciente
        });

        // Ciframos los datos generados para el paciente
        paciente.namePaciente = cifrar(paciente.namePaciente)
        paciente.surnamePaciente = cifrar(paciente.surnamePaciente)
        paciente.usernamePaciente = cifrar(paciente.usernamePaciente)
        paciente.emailPaciente = cifrar(paciente.emailPaciente)
        await paciente.save();

        res.json({msg: "Paciente registrado correctamente"})
    } catch (error) {
        console.log(error);
    }
};

const loginPaciente = async (req, res) => {
    //Verificamos la existencia del paciente
    let {emailPaciente, passwordPaciente} = req.body;
    emailPaciente = cifrar(emailPaciente)
    const paciente = await Paciente.findOne({emailPaciente})
    if (!paciente) {
        const error = new Error("El paciente no existe.")
        return res.status(404).json({msg: error.message})
    }

    //Comprobamos que el paciente este confirmado
    if (!paciente.isConfirmed) {
        const error = new Error("Esta cuenta no esta confirmada")   //Confirmar mensaje
        return res.status(403).json({msg:error.message})
    }

    //Comprobamos el password
    if (await paciente.comprobarPassword(passwordPaciente)) {
        res.json({
            _id: paciente._id,
            /*namePaciente: paciente.namePaciente,
            surnamePaciente: paciente.surnamePaciente,
            usernamePaciente: paciente.usernamePaciente,
            emailPaciente: paciente.emailPaciente,*/
            token: generarJWT(paciente._id)
        })
    }
    else {
        const error = new Error("La contraseña ingresada es incorrecta.")
        return res.status(403).json({ msg: error.message })
    }
};

const confirmarPaciente = async (req, res) => {
    const { tokenPaciente } = req.params;
    const pacienteConfirmar = await Paciente.findOne({ tokenPaciente });
    if (pacienteConfirmar) {
        try {
            pacienteConfirmar.isConfirmed = true;
            pacienteConfirmar.tokenPaciente = undefined;
            await pacienteConfirmar.save();
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
    let { emailPaciente } = req.body;
    emailPaciente = cifrar(emailPaciente)
    // Verificamos que el paciente exista
    const paciente = await Paciente.findOne({ emailPaciente });
    if (!paciente) {
        const error = new Error("El paciente no existe.")
        return res.status(404).json({ msg: error.message});
    }
    emailPaciente = descifrar(emailPaciente)
    try {
        paciente.tokenPaciente = generarId();
        await paciente.save();
        // Enviamos el email para restablecer la contraseña
        emailRestablecer({
            email: descifrar(paciente.emailPaciente),
            nombre: descifrar(paciente.usernamePaciente),
            token: paciente.tokenPaciente
        });
        res.json({ msg: "Se ha enviado un email con instrucciones." });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { tokenPaciente } = req.params;
    // Verificamos que el token exista dentro de la BD
    const tokenValido = await Paciente.findOne({ tokenPaciente });
    if (tokenValido) {
        res.json({ msg: "Token válido." });
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

const nuevoPassword = async (req, res) => {
    const { tokenPaciente } = req.params;
    const { passwordPaciente } = req.body;
    // Verificamos que el token exista dentro de la BD
    const paciente = await Paciente.findOne({ tokenPaciente });
    if (paciente) {
        paciente.passwordPaciente = passwordPaciente;
        paciente.tokenPaciente = undefined;
        await paciente.save();
        res.json({ msg: "Se ha completado la operación correctamente." });
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

//ModificarDatos

const perfil = async (req, res) => {

}

export {
    registrarPaciente,
    loginPaciente,
    confirmarPaciente, 
    olvidePassword,
    comprobarToken,
    nuevoPassword
};