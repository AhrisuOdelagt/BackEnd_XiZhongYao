import Paciente from "../models/Paciente.js";
import Doctor from "../models/Doctor.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRestablecer, emailSolicitarCita } from "../helpers/emails.js";
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

// Generar cita
const generarCita = async (req, res) => {
    // Autenticamos al usuario
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({ emailPaciente });
    // Verificamos una sesión de doctor activa
    if (!paciente) {
        const error = new Error("Este usuario no ha iniciado sesión.");
        return res.status(403).json({msg: error.message});
    }
    // Verificamos que su cuenta esté confirmada
    if(paciente.isConfirmed == false){
        const error = new Error("Esta cuenta no está confirmada.");
        return res.status(403).json({msg: error.message});
    }

    // Obtenemos los parámetros JSON
    let {
        emailDoctor,
        fecha,
        dia,
        horaInicio,
        horaFin
    } = req.body;

    try {
        // Revisamos que el doctor exista
        emailDoctor = cifrar(emailDoctor);
        const doctor = await Doctor.findOne({ emailDoctor });
        emailDoctor = descifrar(emailDoctor);

        // Retornamos mensaje si el doctor no existe
        if (!doctor) {
            return res.json({ msg: "Este doctor no existe o no está registrado." });
        }

        // Revisamos que el horario esté disponible para ese doctor
        const horarios = doctor.horariosAtencion;
        if (horarios.length != 0) {
            for (let index = 0; index < horarios.length; index++) {
                const element = horarios[index];
                if (element.dia === dia
                    && element.horaInicio === horaInicio
                    && element.horaFin === horaFin) {
                    break;
                }
                if (index == horarios.length - 1) {
                    return res.json({ msg: "Este horario no existe." });
                }
            }
        }

        // Revisamos que no haya ya una cita con la hora seleccionada
        const citasDoctor = doctor.citasDoctor;
        if (citasDoctor.length != 0) {
            for (let index = 0; index < citasDoctor.length; index++) {
                const element = citasDoctor[index];
                if (element.horario.dia === dia
                    && element.horario.horaInicio === horaInicio
                    && element.horario.horaFin === horaFin
                    && element.fecha === fecha) {
                        return res.json({ msg: "Este horario ya está ocupado." });
                }
            }
        }

        // Generamos preliminarmente la cita y enviamos correo al doctor
        const cita = {
            horario: {
                dia: dia,
                horaInicio: horaInicio,
                horaFin: horaFin
            },
            fecha: fecha,
            pacienteEmail: paciente.emailPaciente
        }
        doctor.citasDoctor.push(cita);
        // Guardamos los datos
        await doctor.save();

        // Enviamos un correo al doctor para avisar que se intenta agendar una cita
        emailSolicitarCita({
            email: descifrar(doctor.emailDoctor),
            nombreDoctor: descifrar(doctor.usernameDoctor),
            nombrePaciente: descifrar(paciente.usernamePaciente),
            fecha: fecha,
            dia: dia,
            horaInicio: horaInicio,
            horaFin: horaFin
        });

        // Enviamos un mensaje de confirmación
        res.json({ msg: "Se ha enviado la solicitud para su cita." });

    } catch (error) {
        console.log(error);
    }
};

// Ver doctores
const verDoctores = async (req, res) => {
    // Autenticamos al usuario
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({ emailPaciente });
    // Verificamos una sesión de doctor activa
    if (!paciente) {
        const error = new Error("Este usuario no ha iniciado sesión.");
        return res.status(403).json({msg: error.message});
    }
    // Verificamos que su cuenta esté confirmada
    if(paciente.isConfirmed == false){
        const error = new Error("Esta cuenta no está confirmada.");
        return res.status(403).json({msg: error.message});
    }

    // Mostramos en un JSON todos los doctores
    try {
        // Conseguimos la información de los doctores
        const doctores = await Doctor.find({}, { emailDoctor: 1, usernameDoctor: 1, _id: 0 });

        // Ajustamos la información para sólo mostrar emails y usernames
        const infoDoctores = doctores.map(doctor => ({
            emailDoctor: descifrar(doctor.emailDoctor),
            usernameDoctor: descifrar(doctor.usernameDoctor)
        }));

        // Devolvemos la información en un JSON
        res.json(infoDoctores);

    } catch (error) {
        console.log(error);
    }
};

export {
    registrarPaciente,
    loginPaciente,
    confirmarPaciente, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    generarCita,
    verDoctores
};