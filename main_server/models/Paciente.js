// Importamos Mongoose
import mongoose from "mongoose";
// Importamos bcrypt para aplicar Hash a las contraseñas
import bcrypt from "bcrypt";
// Importamos el modelo de los pedidos
import Pedido from "./Pedido.js";

// Creación del esquema del documento embebido CarritoCompras
const carritoComprasSchema = mongoose.Schema({
    _id : false,
    producto_C: {
        type: String,
        trim: true,
    },
    cantidad_C: {
        type: Number,
        trim: true,
    },
    totalParcial_C: {
        type: Number,
        trim: true,
    },
    copiaInv_C: {
        type: Number,
        trim: true
    },
    img_C: {
        type: String,
        trim: true
    }
});

// Modelos para las citas
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

// Creación del esquema del documento embebido Tarjeta
const tarjetaSchema = mongoose.Schema({
    _id : false,
    numTarjeta: {
        type: String,
        trim: true,
    },
    fechaVencimiento: {
        type: String,
        trim: true,
    },
    titularTarjeta: {
        type: String,
        trim: true,
    },
});

// Modelo de paciente
const pacienteSchema = mongoose.Schema({
    namePaciente: {
        type: String,
        required: true,
        trim: true
    },
    surnamePaciente: {
        type: String,
        required: true,
        trim: true
    },
    usernamePaciente: {
        type: String,
        trim: true
    },
    passwordPaciente: {
        type: String,
        required: true,
        trim: true
    },
    emailPaciente: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    telefonoPaciente: {
        type: String,
        trim: true
    },
    tarjetaPaciente: {
        type: String        //Modificar en cuanto se tenga el modelo Tarjeta
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    historialAnalisis: {       //Modificar en cuanto se tenga el modelo Analisis
        type: [String]
    },
    citasPaciente: {
        type: [citasSchema]
    },
    pedidosPaciente: {  
        type: [String],
        trim: true
    },
    carritoCompras: {
        type: [carritoComprasSchema],
    },
    tarjetaPaciente: {
        type: [tarjetaSchema],
    },
    tokenPaciente: {
        type: String,
        trim: true 
    } 
});

// Aplicamos un Hash a la contraseña antes de guardarla en la base de datos
pacienteSchema.pre("save", async function(next){
    if (!this.isModified("passwordPaciente")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordPaciente = await bcrypt.hash(this.passwordPaciente, salt);
});

// Comprobamos el Password
pacienteSchema.methods.comprobarPassword = async function (passwordForm){
    return await bcrypt.compare(passwordForm, this.passwordPaciente);
}

const Paciente = mongoose.model("Paciente", pacienteSchema);
export default Paciente;
