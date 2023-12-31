import Doctor from "../models/Doctor.js";
import Administrador from "../models/Administrador.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import fs from "fs/promises";
import path from "path";
import { emailRegistro, emailRestablecer } from "../helpers/emails.js";
import { cifrar, descifrar } from "../helpers/cifrar_descifrar.js";

//Autenticacion, registro y confirmacion de Doctor
const registrarDoctor = async (req, res) => {
    //Evitamos correos duplicados
    let { res_emailDoctor } = req.body;
    let emailDoctor = cifrar(res_emailDoctor)
    const existeDoctor = await Doctor.findOne({emailDoctor})
    if (existeDoctor) {
        console.log(existeDoctor)
        const error = new Error("Este correo ya ha sido usado")     //Confirmar mensaje
        return res.status(400).json({msg: error.message});
    }
    emailDoctor = descifrar(emailDoctor)

    try {
        // Manipulamos los campos recibidos
        let {
            res_nameDoctor,
            res_surnameDoctor,
            res_passwordDoctor,
            res_emailDoctor,
            res_especialidad,
            pathCedula,
            pathTitulo
        } = req.body;

        // Leemos el nombre de los archivos y su contenido
        const cedula = await fs.readFile(pathCedula);
        const titulo = await fs.readFile(pathTitulo);
        const infoDoctor = {
            nameDoctor: res_nameDoctor,
            surnameDoctor: res_surnameDoctor,
            passwordDoctor: res_passwordDoctor,
            emailDoctor: res_emailDoctor,
            especialidad: res_especialidad,
            documentos: {
                tituloDoctor: {
                    nombre: path.basename(pathTitulo),
                    datos: titulo,
                },
                cedulaDoctor: {
                    nombre: path.basename(pathCedula),
                    datos: cedula,
                }
            }
        }

        // Generamos el esquema completo del doctor
        const doctor = new Doctor(infoDoctor)
        //Generamos el username
        doctor.usernameDoctor = doctor.nameDoctor + " " + doctor.surnameDoctor;
        //Generamos el token
        doctor.tokenDoctor = generarId();
        const doctorAlmacenado = await doctor.save();

        //Email de confirmación
        emailRegistro({
            email: doctor.emailDoctor,
            nombre: doctor.usernameDoctor,
            token: doctor.tokenDoctor
        })

        //Ciframos los datos generados
        doctor.nameDoctor = cifrar(doctor.nameDoctor)
        doctor.surnameDoctor = cifrar(doctor.surnameDoctor)
        doctor.usernameDoctor = cifrar(doctor.usernameDoctor)
        doctor.emailDoctor = cifrar(doctor.emailDoctor)        
        await doctor.save()

        // Adjuntamos a este doctor en las listas de administradores para su revisión
        const newDocEmail = doctor.emailDoctor;
        await Administrador.updateMany({}, { $push: { listaDoctoresPendientes: newDocEmail } });
        
        res.json({msg: "Doctor registrado correctamente"})
    } catch (error) {
        console.log(error);
    }
};

const loginDoctor = async (req, res) => {
    //Verificamos la existencia del doctor
    let {emailDoctor, passwordDoctor} = req.body;
    emailDoctor = cifrar(emailDoctor);
    const doctor = await Doctor.findOne({emailDoctor})
    if (!doctor) {
        const error = new Error("El doctor no existe.")
        return res.status(404).json({msg: error.message})
    }

    emailDoctor = descifrar(emailDoctor)

    //Comprobamos que el doctor este confirmado
    if (!doctor.isConfirmed) {
        const error = new Error("Esta cuenta no esta confirmada.")   //Confirmar mensaje
        return res.status(403).json({msg:error.message})
    }

    //Comprobamos que este aceptado
    if (!doctor.isAccepted) {
        const error = new Error("Esta cuenta aun no ha sido aceptada.")   //Confirmar mensaje
        return res.status(403).json({msg:error.message})
    }

    //Comprobamos el password
    if (await doctor.comprobarPassword(passwordDoctor)) {
        res.json({
            _id: doctor._id,
            /*nameDoctor: doctor.nameDoctor,
            surnameDoctor: doctor.surnameDoctor,
            usernameDoctor: doctor.usernameDoctor,
            emailDoctor: doctor.emailDoctor,*/
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
    // Autenticamos sesión del administrador
    let emailAdmin;
    emailAdmin = req.administrador.emailAdmin;
    const admin = await Administrador.findOne({ emailAdmin });
    // Verificamos una sesión de administrador activa
    if (!admin) {
        const error = new Error("Este usuario no ha iniciado sesión.");
        return res.status(403).json({msg: error.message});
    }
    // Verificamos que el administador esté autorizado
    if(admin.isAdmin == false){
        const error = new Error("Este usuario no es administrador o no está autorizado.");
        return res.status(403).json({msg: error.message});
    }

    let {emailDoctor} = req.body;
    emailDoctor = cifrar(emailDoctor)
    const doctorAceptar = await Doctor.findOne({emailDoctor}) 

    if(doctorAceptar){
        try {
            doctorAceptar.isAccepted = true;
            await doctorAceptar.save();

            // Pasamos al doctor a la lista de los doctores aceptados
            await Administrador.updateMany({}, { $pull: { listaDoctoresPendientes: emailDoctor } });
            await Administrador.updateMany({}, { $push: { listaDoctoresAceptados: emailDoctor } });

            res.json({ msg: "Doctor aceptado con exito." });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        const error = new Error("Este correo es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

const olvidePassword = async (req, res) => {
    let { emailDoctor } = req.body;
    emailDoctor = cifrar(emailDoctor)
    // Verificamos que el doctor exista
    const doctor = await Doctor.findOne({ emailDoctor });
    if (!doctor) {
        const error = new Error("El doctor no existe.")
        return res.status(404).json({ msg: error.message});
    }
    emailDoctor = descifrar(emailDoctor)
    try {
        doctor.tokenDoctor = generarId();
        await doctor.save();
        // Enviamos el email para restablecer la contraseña
        emailRestablecer({
            email: descifrar(doctor.emailDoctor),
            nombre: descifrar(doctor.usernameDoctor),
            token: doctor.tokenDoctor
        });
        res.json({ msg: "Se ha enviado un email con instrucciones." });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { tokenDoctor } = req.params;
    // Verificamos que el token exista dentro de la BD
    const tokenValido = await Doctor.findOne({ tokenDoctor });
    if (tokenValido) {
        res.json({ msg: "Token válido." });
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

const nuevoPassword = async (req, res) => {
    const { tokenDoctor } = req.params;
    const { passwordDoctor } = req.body;
    // Verificamos que el token exista dentro de la BD
    const doctor = await Doctor.findOne({ tokenDoctor });
    if (doctor) {
        doctor.passwordDoctor = passwordDoctor;
        doctor.tokenDoctor = undefined;
        await doctor.save();
        res.json({ msg: "Se ha completado la operación correctamente." });
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

const modificarInformacion = async (req, res) => {
    // Autenticamos al usuario
    let emailDoctor;
    emailDoctor = req.doctor.emailDoctor;
    const doctor = await Doctor.findOne({ emailDoctor });
    // Verificamos una sesión de doctor activa
    if (!doctor) {
        const error = new Error("Este usuario no ha iniciado sesión.");
        return res.status(403).json({msg: error.message});
    }
    // Verificamos que su cuenta esté confirmada
    if(doctor.isConfirmed == false){
        const error = new Error("Esta cuenta no está confirmada.");
        return res.status(403).json({msg: error.message});
    }
    // Verificamos que su cuenta esté aceptada
    if(doctor.isAccepted == false){
        const error = new Error("Este doctor no está autorizado todavía.");
        return res.status(403).json({msg: error.message});
    }

    // Leemos el JSON de entrada
    const {
        in_nameDoctor,
        in_surnameDoctor,
        in_telefonoDoctor,
        in_especialidad,
        pathCedula,
        in_direccion,
        in_direccion_maps
    } = req.body

    try {
        // Actualizamos la información
        if (in_nameDoctor !== "") {
            doctor.nameDoctor = cifrar(in_nameDoctor);
        }
        if (in_surnameDoctor !== "") {
            doctor.surnameDoctor = cifrar(in_surnameDoctor);
        }
        // Reajustamos el usename
        doctor.usernameDoctor = cifrar(`${descifrar(doctor.nameDoctor)} ${descifrar(doctor.usernameDoctor)}`);
        if (in_telefonoDoctor !== "") {
            doctor.telefonoDoctor = cifrar(in_telefonoDoctor);
        }
        if (in_especialidad !== "") {
            doctor.especialidad = in_especialidad;
        }
        if (in_direccion !== "") {
            doctor.direccion = cifrar(in_direccion);
        }
        if (in_direccion_maps !== "") {
            doctor.direccion_maps = in_direccion_maps;
        }
        // Modificamos la cédula de presentar una nueva
        if (pathCedula !== "") {
            const cedula = await fs.readFile(pathCedula);
            doctor.documentos.cedulaDoctor.nombre = path.basename(pathCedula)
            doctor.documentos.cedulaDoctor.datos = cedula
        }
        // Guardamos los datos
        await doctor.save();
        res.json({ msg: "Cambios registrados exitosamente." });

    } catch (error) {
        console.log(error);
    }
};

export {
    registrarDoctor,
    loginDoctor,
    confirmarDoctor,
    aceptarDoctor,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    modificarInformacion
};