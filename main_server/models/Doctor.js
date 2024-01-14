// Importamos Mongoose
import mongoose from "mongoose";
// Importamos bcrypt para aplicar Hash a las contraseñas
import bcrypt from "bcrypt";

// Creamos el esquema embebido de archivos y documentos
const archivosSchema = mongoose.Schema({
    _id : false,
    nombre: String,
    datos: Buffer,
});
  
const documentosSchema = mongoose.Schema({
    _id : false,
    tituloDoctor: archivosSchema,
    cedulaDoctor: archivosSchema,
});

const horariosSchema = mongoose.Schema({
    _id : false,
    dia: String,
    horaInicio: String,
    horaFin: String
});

const citasSchema = mongoose.Schema({
    _id : false,
    horario: horariosSchema,
    fecha: String,
    pacienteEmail: String,
    estado: Boolean
});

//Modelo de Doctor
const doctorSchema = mongoose.Schema({
    nameDoctor: {
        type: String,
        required: true,
        trim: true
    },
    surnameDoctor: {
        type: String,
        required: true,
        trim: true
    },
    usernameDoctor: {
        type: String,
        trim: true
    },
    passwordDoctor: {
        type: String,
        required: true,
        trim: true
    },
    emailDoctor: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    telefonoDoctor: {
        type: String,
        trim: true
    },
    descripcionDoctor: {
        type: String,
        trim: true
    },
    imagenDoctor: {
        type: String,
        trim: true
    },
    direccion: {
        type: String,
        trim: true
    },
    direccion_maps: {
        type: String,
        trim: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    especialidad: {
        type: String,
        trim: true,
        required: true
    },
    listaSeguimiento: {
        type: [String]
    },
    horariosAtencion: {
        type: [horariosSchema]
    },
    citasDoctor: {
        type: [citasSchema]
    },
    documentos: {
        type: documentosSchema
    },
    tokenDoctor: {
        type: String,
        trim: true
    } 
})

// Aplicamos un Hash a la contraseña antes de guardarla en la base de datos
doctorSchema.pre("save", async function(next){
    if (!this.isModified("passwordDoctor")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordDoctor = await bcrypt.hash(this.passwordDoctor, salt);
});

// Comprobamos el Password
doctorSchema.methods.comprobarPassword = async function (passwordForm){
    return await bcrypt.compare(passwordForm, this.passwordDoctor);
}

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;