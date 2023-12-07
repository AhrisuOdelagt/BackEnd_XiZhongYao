import Doctor from "../models/Doctor.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

//Autenticacion, registro y confirmacion de Doctor
const registrarDoctor = async (req, res) => {
    //Evitamos correos duplicados
    const {emailDoctor} = req.body;
    const existeDoctor = await Doctor.findOne({emailDoctor})
    if (existeDoctor) {
        console.log(existeDoctor)
        const error = new Error("Este correo ya ha sido usado")     //Confirmar mensaje
        return res.status(400).json({msg: error.message});
    }
    try {
        const doctor = new Doctor(req.body)
        //Generamos el username
        doctor.usernameDoctor = paciente.nameDoctor + " " + paciente.Doctor;
        //Generamos el token
        doctor.tokenDoctor = generarId();
        const doctorAlmacenado = await doctor.save();
        console.log(doctorAlmacenado);
        res.json({msg: "Doctor registrado correctamente"})
    } catch (error) {
        console.log(error);
    }
};

const loginDoctor = async (req, res) => {
    //Verificamos la existencia del doctor
    const {emailDoctor, passwordDoctor} = req.body;
    const doctor = await Doctor.findOne({emailDoctor})
    if (!doctor) {
        const error = new Error("El paciente no existe.")
        return res.status(404).json({msg: error.message})
    }

    //Comprobamos que el paciente este confirmado
    if (!paciente.isConfirmed) {
        const error = new Error("Esta cuenta no esta confirmada.")   //Confirmar mensaje
        return res.status(403).json({msg:error.message})
    }

    //Comprobamos que este aceptado
    if (!paciente.isAccepted) {
        const error = new Error("Esta cuenta aun no ha sido aceptada.")   //Confirmar mensaje
        return res.status(403).json({msg:error.message})
    }

    //Comprobamos el password
    if (await doctor.comprobarPassword) {
        res.json({
            _id: doctor._id,
            nameDoctor: doctor.nameDoctor,
            surnameDoctor: doctor.surnameDoctor,
            usernameDoctor: doctor.usernameDoctor,
            emailDoctor: doctor.emailDoctor,
            token: generarJWT(doctor._id)
        })
    }
    else {
        const error = new Error("La contraseña ingresada es incorrecta.")
        return res.status(403).json({ msg: error.message })
    }
};

const confirmarDoctor = async (req, res) => {
    const { tokenDoctor } = req.params;
    const doctorConfirmar = await Doctor.findOne({ tokenDoctor });
    if (doctorConfirmar) {
        try {
            doctorConfirmar.isConfirmed = true;
            doctorConfirmar.tokenDoctor = undefined;
            await doctorConfirmar.save();
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

//Checar funcionamiento, dudas si esto va en Admin
const aceptarDoctor = async (req, res) => {
    try {
        doctorConfirmar.isAccepted = true;
        doctorConfirmar.tokenDoctor = undefined;
        await doctorConfirmar.save();
        res.json({ msg: "Cuenta confirmada con éxito." });
    } catch (error) {
        console.log(error);
    }
};

export {
    registrarDoctor,
    loginDoctor,
    confirmarDoctor
};