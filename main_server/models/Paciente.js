// Importamos Mongoose
import mongoose from "mongoose";
// Importamos bcrypt para aplicar Hash a las contraseñas
import bcrypt from "bcrypt";

//Modelo de paciente
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
        required: true,
        trim: true
    },
    tarjetaPaciente: {
        type: String        //Modificar en cuanto se tenga el modelo Tarjeta
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    historialAnalisis: {
        type: String        //Modificar en cuanto se tenga el modelo Analisis
    },
    citasPaciente: {
                            //INVESTIGAR
    },
    pedidosPaciente: {  
        type: [String],     //Modificar en cuanto se tenga el modelo Pedidos
        trim: true
    },
    carritoCompras: {
                            //Modificar en cuanto se tenga el modelo Carrito  
    },
    tokenPaciente: {
        type: String,
        trim: true 
    } 
})

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