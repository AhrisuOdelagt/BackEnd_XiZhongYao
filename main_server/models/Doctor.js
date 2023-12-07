// Importamos Mongoose
import mongoose from "mongoose";
// Importamos bcrypt para aplicar Hash a las contraseñas
import bcrypt from "bcrypt";

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
        required: true,
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
                                //Modificar en cuanto se tenga modelo Pacientes
    },
    horariosAtencion: {
                                //Modificar en cuanto se tenga modelo Semana
    },
    citasPendientes:{
                                //Modificar en cuanto se tenga modelo Semana
    },
    citasDoctor: {
                                //Modificar en cuanto se tenga modelo Semana
    },
    documentos: {
                                //Modificar en cuanto se tenga modelo Documentos
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