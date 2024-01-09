// Importamos Mongoose
import mongoose from "mongoose";

// Creación del esquema del documento embebido Detalles
const detallesSchema = mongoose.Schema({
    _id : false,
    nombreProducto: {
        type: String,               //Dudas
        trim: true,
    },
    cantidadProducto: {
        type: Number,
        trim: true,
    },
    totalParcialProducto: {
        type: Number,
        trim: true,
    },
    imgProducto: {
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
        ref: "Paciente",
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
        required: true
    },
    costoArticulos: {
        type: Number,
        required: true
    },
    costoTotal: {
        type: Number,
    },
    isStarted: {
        type: Boolean
    },
    isFinished: {
        type: Boolean
    },
    metodoPago: {
        type: String,
        required: true,
        trim: true
    },
    detallesPedidos: {
        type: [detallesSchema]
    }

});

//Creacion del modelo
const Pedido = mongoose.model("Pedido". pedidoSchema);
export default Producto;