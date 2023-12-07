import mongoose from "mongoose";

// Creamos el esquema de la colección Producto:
const productoSchema = mongoose.Schema({
    nombreProducto: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    descrProducto: {
        type: String,
        trim: true,
        required: true
    },
    precioProducto: {
        type: Number,
        trim: true,
        required: true
    },
    cantidadInv: {
        type: Number,
        trim: true,
        required: true
    },
    statusProducto: {
        type: String,
        trim: true,
    },
    imagenProducto: {
        type: String,    // Provisional hasta hallar la manera de leer e interpretar binarios
        trim: true,
    },
    categoriaProducto: {
        type: String,
        trim: true
    }
});

// Creamos y exportamos el modelo
const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
