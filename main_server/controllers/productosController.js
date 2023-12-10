import Producto from "../models/Producto.js";
import Administrador from "../models/Administrador.js";

// Registrar un producto en la base de Datos
const registrarProducto = async (req, res) => {
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

    // Leemos la información del JSON
    let {
        nombreProducto,
        descrProducto,
        precioProducto,
        cantidadInv,
        categoriaProducto
    } = req.body;
    const existeProducto = await Producto.findOne({ nombreProducto });
    // Verificamos que no exista un producto con el mismo nombre
    if (existeProducto) {
        const error = new Error("Este producto ya existe.");
        return res.status(401).json({ msg: error.message});
    }

    // Creamos el producto
    try {
        const producto = new Producto({
            nombreProducto,
            descrProducto,
            precioProducto,
            cantidadInv,
            categoriaProducto
        });
        // Determinamos el Status del producto
        if(producto.cantidadInv > 30){
            producto.statusProducto = "Disponible";
        }
        else if(producto.cantidadInv > 0){
            producto.statusProducto = "Pocos";
        }
        else{
            producto.statusProducto = "Agotado";
        }
        // Intercambiamos espacios por guiones bajos en el nombre
        producto.nombreProducto = producto.nombreProducto.replace(/ /g, "_");
        // Guardamos el producto en la base
        await producto.save();
        res.json({
            msg: "Producto registrado exitosamente"
        })
    } catch (error) {
        console.log(error);
    }
};

// Ver productos
const verProductos = async (req, res) => {
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

    try {
        const documentos = await Producto.find();
        res.json({ productos: documentos });
    } catch (error) {
        console.log(error);
    }
};

// Ver producto
const verProducto = async (req, res) => {
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

    try {
        // Recuperamos el nombre del archivo de los parámetros
        let { nombreProducto } = req.params;
        const producto = await Producto.findOne({ nombreProducto });
        if (!producto) {
            const error = new Error("El producto no está registrado.");
            return res.status(404).json({msg: error.message});
        }
        res.json(producto);
    } catch (error) {
        console.log(error);
    }
};

// Modificar producto
const modificarProducto = async (req, res) => {
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

    try {
        // Recuperamos el nombre del archivo de los parámetros
        let { nombreProducto } = req.params;
        const productoModificado = await Producto.findOne({ nombreProducto });
        if (!productoModificado) {
            const error = new Error("El producto no está registrado.");
            return res.status(404).json({msg: error.message});
        }

        // Capturamos la información del cuerpo de la petición
        let {
            nombreProducto_modificar,
            descrProducto_modificar,
            precioProducto_modificar,
            cantidadInv_modificar,
            categoriaProducto_modificar
        } = req.body;

        // Verificamos que no existan conflictos de nombre
        nombreProducto = nombreProducto_modificar;
        const coincidencia = await Producto.findOne({ nombreProducto });
        nombreProducto = req.params;
        if (coincidencia) {
            const error = new Error("Este producto ya existe.");
            return res.status(403).json({msg: error.message});
        }
        productoModificado.nombreProducto = nombreProducto_modificar;
        productoModificado.descrProducto = descrProducto_modificar;
        productoModificado.precioProducto = precioProducto_modificar;
        productoModificado.cantidadInv = cantidadInv_modificar;
        productoModificado.categoriaProducto = categoriaProducto_modificar;
        // Volvemos a determinar el status del producto
        if(productoModificado.cantidadInv > 30){
            productoModificado.statusProducto = "Disponible";
        }
        else if(productoModificado.cantidadInv > 0){
            productoModificado.statusProducto = "Pocos";
        }
        else{
            productoModificado.statusProducto = "Agotado";
        }
        // Intercambiamos espacios por guiones bajos en el nombre
        productoModificado.nombreProducto = productoModificado.nombreProducto.replace(/ /g, "_");
        await productoModificado.save();
        res.json({
            msg: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.log(error);
    }
};

// Eliminar Producto
const eliminarProducto = async (req, res) => {
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

    try {
        // Recuperamos el nombre del archivo de los parámetros
        let { nombreProducto } = req.params;
        const productoModificado = await Producto.findOne({ nombreProducto });
        if (!productoModificado) {
            const error = new Error("El producto no está registrado.");
            return res.status(404).json({msg: error.message});
        }

        await productoModificado.deleteOne();
        res.json({msg: "Producto eliminado"});

    } catch (error) {
        console.log(error);
    }
};

export {
    registrarProducto,
    verProductos,
    verProducto,
    modificarProducto,
    eliminarProducto
};
