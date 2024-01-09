import Paciente from "../models/Paciente.js";
import Producto from "../models/Producto.js";
import Pedido from "../models/Pedido.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRestablecer } from "../helpers/emails.js";
import { cifrar, descifrar } from "../helpers/cifrar_descifrar.js";

//Autenticacion, registro y confirmacion de Pacientes

const registrarPaciente = async (req, res) => {
    //Evitamos correos duplicados
    let {emailPaciente} = req.body;
    emailPaciente = cifrar(emailPaciente)
    const existePaciente = await Paciente.findOne({emailPaciente})
    if (existePaciente) {
        console.log(existePaciente)
        const error = new Error("Este correo ya ha sido usado")     //Confirmar mensaje
        return res.status(400).json({msg: error.message});
    }

    emailPaciente = descifrar(emailPaciente)
        
    try {
        const paciente = new Paciente(req.body)
        //Generamos el username
        paciente.usernamePaciente = paciente.namePaciente + " " + paciente.surnamePaciente;
        //Generamos el token
        paciente.tokenPaciente = generarId();
        const pacienteAlmacenado = await paciente.save();
        console.log(pacienteAlmacenado);

        //Enviamos el email de confirmación
        emailRegistro({
            email: paciente.emailPaciente,
            nombre: paciente.usernamePaciente,
            token: paciente.tokenPaciente
        });

        // Ciframos los datos generados para el paciente
        paciente.namePaciente = cifrar(paciente.namePaciente)
        paciente.surnamePaciente = cifrar(paciente.surnamePaciente)
        paciente.usernamePaciente = cifrar(paciente.usernamePaciente)
        paciente.emailPaciente = cifrar(paciente.emailPaciente)
        await paciente.save();

        res.json({msg: "Paciente registrado correctamente"})
    } catch (error) {
        console.log(error);
    }
};

const loginPaciente = async (req, res) => {
    //Verificamos la existencia del paciente
    let {emailPaciente, passwordPaciente} = req.body;
    emailPaciente = cifrar(emailPaciente)
    const paciente = await Paciente.findOne({emailPaciente})
    if (!paciente) {
        const error = new Error("El paciente no existe.")
        return res.status(404).json({msg: error.message})
    }

    //Comprobamos que el paciente este confirmado
    if (!paciente.isConfirmed) {
        const error = new Error("Esta cuenta no esta confirmada")   //Confirmar mensaje
        return res.status(403).json({msg:error.message})
    }

    //Comprobamos el password
    if (await paciente.comprobarPassword(passwordPaciente)) {
        res.json({
            _id: paciente._id,
            /*namePaciente: paciente.namePaciente,
            surnamePaciente: paciente.surnamePaciente,
            usernamePaciente: paciente.usernamePaciente,
            emailPaciente: paciente.emailPaciente,*/
            token: generarJWT(paciente._id)
        })
    }
    else {
        const error = new Error("La contraseña ingresada es incorrecta.")
        return res.status(403).json({ msg: error.message })
    }
};

const confirmarPaciente = async (req, res) => {
    const { tokenPaciente } = req.params;
    const pacienteConfirmar = await Paciente.findOne({ tokenPaciente });
    if (pacienteConfirmar) {
        try {
            pacienteConfirmar.isConfirmed = true;
            pacienteConfirmar.tokenPaciente = undefined;
            await pacienteConfirmar.save();
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

const olvidePassword = async (req, res) => {
    let { emailPaciente } = req.body;
    emailPaciente = cifrar(emailPaciente)
    // Verificamos que el paciente exista
    const paciente = await Paciente.findOne({ emailPaciente });
    if (!paciente) {
        const error = new Error("El paciente no existe.")
        return res.status(404).json({ msg: error.message});
    }
    emailPaciente = descifrar(emailPaciente)
    try {
        paciente.tokenPaciente = generarId();
        await paciente.save();
        // Enviamos el email para restablecer la contraseña
        emailRestablecer({
            email: descifrar(paciente.emailPaciente),
            nombre: descifrar(paciente.usernamePaciente),
            token: paciente.tokenPaciente
        });
        res.json({ msg: "Se ha enviado un email con instrucciones." });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { tokenPaciente } = req.params;
    // Verificamos que el token exista dentro de la BD
    const tokenValido = await Paciente.findOne({ tokenPaciente });
    if (tokenValido) {
        res.json({ msg: "Token válido." });
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

const nuevoPassword = async (req, res) => {
    const { tokenPaciente } = req.params;
    const { passwordPaciente } = req.body;
    // Verificamos que el token exista dentro de la BD
    const paciente = await Paciente.findOne({ tokenPaciente });
    if (paciente) {
        paciente.passwordPaciente = passwordPaciente;
        paciente.tokenPaciente = undefined;
        await paciente.save();
        res.json({ msg: "Se ha completado la operación correctamente." });
    }
    else {
        const error = new Error("Este token es inválido.");
        return res.status(403).json({ msg: error.message});
    }
};

//ModificarDatos

const perfil = async (req, res) => {

}

//Carrito de compras
const agregarProductoCarrito = async (req, res) => {
    
    //Valicacion paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({emailPaciente});
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión");
        return res.status(403).json({msg: error.message})
    }

    const{nombreProducto} = req.body;

    //Vericamos que el producto exista
    const productoPedido = await Producto.findOne({nombreProducto});
    if(!productoPedido){
        const error = new Error("Producto no registrado");
        return res.status(403).json({msg: error.message});
    }

    //Verificamos que el producto no se haya añadido previamente
    let productosCarrito = cliente.carritoCompras;
    for(let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto){
            const error = new Error("El producto ya se encuentra en el carrito");
            return res.status(400).json({ msg: error.message });
        }
    }

    // Verificamos que el producto no este agotado
    if(productoPedido.cantidadInv <- 0){
        const error = new Error("Producto agotado")
        return res.status(400).json({msg: error.message})
    }

    try {
        const carrito = {
            producto_C: productoPedido.nombreProducto,
            cantidad_C: 1,
            totalParcial_C: productoPedido.precioProducto,
            copiaInv_C: productoPedido.cantidadInv,
            img_C: productoPedido.imagenProducto
        }
        paciente.carritoCompras.push(carrito);
        await paciente.save();
        res.json({
            msg: "Se inicio el carrito"
        });
    } catch(error){
        console.log(error);
    }

}

//Incrementar un producto en el carrito
const incrementarProductoCarrito = async (req, res) => {

    //Realizamos validación del paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({emailPaciente});
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión");
        return res.status(403).json({msg: error.message});
    }

    const{nombreProducto} = req.body;

    //Vericamos que el producto exista
    const productoPedido = await Producto.findOne({nombreProducto});
    if(!productoPedido){
        const error = new Error("Producto no registrado");
        return res.status(403).json({msg: error.message});
    }

    //Verificamos que el producto se encuentre en el carrito
    let productosCarrito = paciente.carritoCompras;
    let isPresent = false;
    for(let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto) {
            isPresent = true;
        }
    }
    if(isPresent == false){
        const error = new Error("El producto no esta en el carrito");
        return res.status(403).json({msg: error.message})
    }

    //Verificamos que el producto pueda incrementarse
    for(let index = 0; index < productosCarrito.length; index++) {
        let test = productosCarrito[index].cantidad_C + 1;
        if(test > productosCarrito[index].copiaInv_C || test > 49){
            const error = new Error("Has alcanzado el límite de artículos permitidos");
            return res.status(403).json({msg: error.message})
        }
        break;
    }

    // Añadimos el mismo producto otra vez
    try {
        for (let index = 0; index < productosCarrito.length; index++) {
            console.log(index);
            console.log(productosCarrito[index].producto_C);
            console.log(nombreProducto);
            if(productosCarrito[index].producto_C == nombreProducto){
                productosCarrito[index].cantidad_C += 1;
                productosCarrito[index].totalParcial_C = productoPedido.precioProducto * productosCarrito[index].cantidad_C;
                await paciente.save();
                break;
            }
        }
        res.json({ msg: "El producto se añadió al carrito" });
    } catch (error) {
        console.log(error);
    }

}

//Decrementar un producto en el carrito
const decrementarProductoCarrito = async(req, res) => {
    
    //Realizamos validación del paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({emailPaciente});
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión");
        return res.status(403).json({msg: error.message});
    }

    const{nombreProducto} = req.body;

    //Vericamos que el producto exista
    const productoPedido = await Producto.findOne({nombreProducto});
    if(!productoPedido){
        const error = new Error("Producto no registrado");
        return res.status(403).json({msg: error.message});
    }

    //Verificamos que el producto se encuentre en el carrito
    let productosCarrito = paciente.carritoCompras;
    let isPresent = false;
    for(let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto) {
            isPresent = true;
        }
    }
    if(isPresent == false){
        const error = new Error("El producto no esta en el carrito");
        return res.status(403).json({msg: error.message})
    }

    //Verificamos que el producto pueda decrementarse
    for(let index = 0; index < productosCarrito.length; index ++) {
        if(productosCarrito[index].producto_C == nombreProducto){
            let test = productosCarrito[index].cantidad_C - 1;
            if(test < 0){
                const error = new Error("El producto no puede decrementarse");
                return res.status(403).json({msg: error.message})
            }
        }
        break;
    }

    //Decrementamos el producto una vez
    try {
        for(let index = 0; index < productosCarrito.length; index++) {
            console.log(index)
            console.log(productosCarrito[index].producto_C);
            console.log(nombreProducto);
            if(productosCarrito[index].producto_C == nombreProducto){
                if(productosCarrito[index].cantidad_C > 1){
                    productosCarrito[index].cantidad_C -= 1;
                    productosCarrito[index].totalParcial_C = productoPedido.precioProducto * productosCarrito[index].cantidad_C;
                    await cliente.save();
                    res.json({ msg: "El producto se removió del carrito" });
                    break;
                }
                else if(productosCarrito[index].cantidad_C <= 1){
                    productosCarrito[index].cantidad_C -= 1;
                    productosCarrito[index].totalParcial_C = productoPedido.precioProducto * productosCarrito[index].cantidad_C;
                    let newCarrito = [];
                    let productosCarrito2 = [...productosCarrito]; 
                    for (let j = 0; j < productosCarrito2.length; j++) {
                        console.log(j);
                        console.log(productosCarrito2[j].producto_C);
                        console.log(nombreProducto);
                        if(productosCarrito2[j].cantidad_C !== 0){
                            newCarrito.push(productosCarrito2[j]);
                            console.log("Agregado");
                        }
                    }
                    console.log(newCarrito);
                    paciente.carritoCompras = newCarrito;
                    await paciente.save();
                    res.json({ msg: "El producto ha sido eliminado con éxito" });
                    break;
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

//Eliminamos un producto
const eliminarProductoCarrito = async (req, res) => {
    
    //Realizamos validación del paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({emailPaciente});
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión");
        return res.status(403).json({msg: error.message});
    }

    const{nombreProducto} = req.body;

    //Vericamos que el producto exista
    const productoPedido = await Producto.findOne({nombreProducto});
    if(!productoPedido){
        const error = new Error("Producto no registrado");
        return res.status(403).json({msg: error.message});
    }

    //Verificamos que el producto se encuentre en el carrito
    let productosCarrito = paciente.carritoCompras;
    let isPresent = false;
    for(let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto) {
            isPresent = true;
        }
    }
    if(isPresent == false){
        const error = new Error("El producto no esta en el carrito");
        return res.status(403).json({msg: error.message})
    }

    // Eliminamos el producto del carrito
    try {
        let newCarrito = [];
        for (let j = 0; j < productosCarrito.length; j++) {
            if(productosCarrito[j].producto_C !== nombreProducto){
                newCarrito.push(productosCarrito[j]);
                console.log("Agregado");
            }
        }
        paciente.carritoCompras = newCarrito;
        await paciente.save();
        res.json({ msg: "El producto ha sido eliminado con éxito" });
    } catch (error) {
        console.log(error);
    }
}

//Vaciar carrito de compras
const vaciarCarrito = async (req, res) => {

    //Realizamos validación del paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({emailPaciente});
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión");
        return res.status(403).json({msg: error.message});
    }

    //Vaciamos el carrito
    try{
        paciente.carritoCompras = [];
        paciente.save();
        res.json({msg: "El carrito se ha vaciado"});
    } catch(error) {
        console.log(error)
    }

}

//Visualizar carito
const visualizarCarrito = async (req, res) => {

    //Realizamos validación del paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({emailPaciente});
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión");
        return res.status(403).json({msg: error.message});
    }

    //Revisamos si esta vacio
    if(paciente.carritoCompras.length < 1) {
        const error = new Error("Su carrito de compras está vacío");
        return res.status(404).json({msg: error.message});
    }

    //Mostramos el carrito
    try {
        res.json({carrito: cliente.carritoCompras})
    } catch(error){
        console.log(error)
    }
}

// Ver historial de pedidos
const verHistorialPedidos = async (req, res) => {
    // Realizamos validación del paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({ emailPaciente });
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Revisamos la longitud del arreglo de Pedidos
    if(paciente.pedidosPaciente < 1){
        const error = new Error("Sin pedidos");
        return res.status(404).json({msg: error.message});
    }

    // Revisamos el historial de pedidos
    try {
        // Revisamos y buscamos la información de todos los pedidos del cliente
        const pedidos = paciente.pedidosPaciente;
        let documentos = [];
        for (let index = 0; index < pedidos.length; index++) {
            let nombrePedido = pedidos[index];
            let pedido = await Pedido.findOne({ nombrePedido });
            documentos.push(pedido);
        }
        res.json({ pedidosPaciente: documentos });
    } catch (error) {
        console.log(error);
    }
}

export {
    registrarPaciente,
    loginPaciente,
    confirmarPaciente, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    agregarProductoCarrito,
    incrementarProductoCarrito,
    decrementarProductoCarrito,
    eliminarProductoCarrito, 
    vaciarCarrito, 
    visualizarCarrito,
    verHistorialPedidos
};