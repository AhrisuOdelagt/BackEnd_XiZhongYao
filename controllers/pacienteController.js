import Paciente from "../models/Paciente";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

//Autenticacion, registro y confirmacion de Pacientes

const registrarPaciente = async (req, res) => {
    //Evitamos correos duplicados
    const {emailPaciente} = req.body;
    const existePaciente = await Paciente.findOne({emailPaciente})
    if (existePaciente) {
        console.log(existePaciente)
        const error = new Error("Este correo ya ha sido usado")     //Confirmar mensaje
        return res.status(400).json({msg: error.message});
    }
    try {
        const paciente = new Paciente(req.body)
        //Generamos el username
        paciente.usernamePaciente = paciente.namePaciente + " " + paciente.surnamePaciente;
        //Generamos el token
        paciente.tokenPaciente = generarId();
        const pacienteAlmacenado = await paciente.save();
        console.log(pacienteAlmacenado);
        res.json({msg: "Paciente registrado correctamente"})
    } catch (error) {
        console.log(error);
    }
};

const loginPaciente = async (req, res) => {
    //Verificamos la existencia del paciente
    const {emailPaciente, passwordPaciente} = req.body;
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
    if (await paciente.comprobarPassword) {
        res.json({
            _id: paciente._id,
            namePaciente: paciente.namePaciente,
            surnamePaciente: paciente.surnamePaciente,
            usernamePaciente: paciente.usernamePaciente,
            emailPaciente: paciente.emailPaciente,
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

export {
    registrarPaciente,
    loginPaciente,
    confirmarPaciente
};