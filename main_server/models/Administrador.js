// Importamos Mongoose
import mongoose from "mongoose";
// Importamos bcrypt para aplicar Hash a las contraseñas
import bcrypt from "bcrypt";

const administradorSchema = mongoose.Schema({
    nameAdmin: {
        type: String,
        required: true,
        trim: true
    },
    surnameAdmin: {
        type: String,
        required: true,
        trim: true
    },
    usernameAdmin: {
        type: String,
        trim: true
    },
    passwordAdmin: {
        type: String,
        required: true,
        trim: true
    },
    emailAdmin: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    listaPaciente: {
        type: [String], // Modificar en cuanto exista el modelo Paciente
        trim: true
    },
    listaDoctoresPendientes: {
        type: [String], // Modificar en cuanto exista el modelo Doctores
        trim: true
    },
    listaDoctoresAceptados: {
        type: [String], // Modificar en cuanto exista el modelo Doctores
        trim: true
    },
    listaProductos: {
        type: [String], // Modificar en cuanto exista el modelo Productos
        trim: true
    },
    listaPedidos: {
        type: [String], // Modificar en cuanto exista el modelo Pedidos
        trim: true
    },
    tokenAdmin: {
        type: String,
        trim: true
    }
},
    // Colocamos timestamps (no es importante para la aplicación en general
    {
        timestamps: true
    }
);

// Aplicamos un Hash a la contraseña antes de guardarla en la base de datos
administradorSchema.pre("save", async function(next){
    if (!this.isModified("passwordAdmin")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordAdmin = await bcrypt.hash(this.passwordAdmin, salt);
});

// Comprobamos el Password
administradorSchema.methods.comprobarPassword = async function (passwordForm){
    return await bcrypt.compare(passwordForm, this.passwordAdmin);
}

const Administrador = mongoose.model("Administrador", administradorSchema);
export default Administrador;
