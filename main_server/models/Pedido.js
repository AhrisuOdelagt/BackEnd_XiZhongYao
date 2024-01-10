// Importamos Mongoose
import mongoose from "mongoose";

// Importamos el modelo de pacientes
import Pacientes from "../models/Paciente.js"

// Creación del esquema del documento embebido Detalles
const detallesSchema = mongoose.Schema({
    _id : false,
    producto_P: {
        type: String,               //Dudas
        trim: true,
    },
    cantidad_P: {
        type: Number,
        trim: true,
    },
    totalParcial_P: {
        type: Number,
        trim: true,
    },
    img_P: {
        type: String,
        trim: true,
    }
});

//Modelo pedidos
const pedidoSchema = new mongoose.Schema({
    nombrePedido: {
        type: String,
        required:true,
        trim: true
    },
    pacientePedido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pacientes",
        trim: true
    },
    fechaPedido: {
        type: Date,
        default: () => new Date(),
    },
    fechaEntrega: {
        type: Date,
        trim: true,
        default: () => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 7);
            return currentDate;
          },
    },
    totalArticulos: {
        type: Number,
        trim: true,
        default: 0
    },
    costoArticulos: {
        type: Number,
        trim: true,
        default: 0
    },
    costoTotal: {
        type: Number,
        trim: true,
        default: 0
    },
    isStarted: {
        type: Boolean
    },
    isFinished: {
        type: Boolean
    },
    metodoPago: {
        type: String,
        trim: true
    },
    detallesPedidos: {
        type: [detallesSchema]
    }

});

//Creacion del modelo
const Pedido = mongoose.model("Pedido", pedidoSchema);
export default Pedido;
