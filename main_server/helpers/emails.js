import nodemailer from "nodemailer";

// Email para el registro de usuario (confirmación por Token)
const emailRegistro = async (datos) => {
    const {email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.MASTER_H,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MASTER_EM,
          pass: process.env.MASTER_P
        }
      });
    // Información del email
    const info = await transport.sendMail({
        from: '"XiZhongYao — Administrador de la Base de Datos" «xizhongyaoisw@gmail.com»',
        to: email,
        subject: "XiZhongYao — Confirme su cuenta",
        text: "Compruebe su cuenta en XiZhongYao",
        html: `
        <p>Hola, ${nombre}, compruebe su cuenta en XiZhongYao.</p>
        <p>Su cuenta está casi lista y su token de acceso es: ${token}</p>
        <p>Para finalizar este proceso, sólo debe colocar el token en la ventana emergente.</p>
        <p>Si usted no creó esta cuenta, ignore este correo electrónico.</p>
        `
    })
};

// Email para la modificación de contraseña
const emailRestablecer = async (datos) => {
    const {email, nombre, token} = datos;
  
    const transport = nodemailer.createTransport({
        host: process.env.MASTER_H,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MASTER_EM,
          pass: process.env.MASTER_P
        }
      });
    // Información del email
    const info = await transport.sendMail({
        from: '"XiZhongYao — Administrador de la Base de Datos" «xizhongyaoisw@gmail.com»',
        to: email,
        subject: "XiZhongYao — Restablecer contraseña",
        text: "Restablezca su contraseña en XiZhongYao",
        html: `
        <p>Hola, ${nombre}, restablezca su constraseña en XiZhongYao.</p>
        <p>Para restablecer su contraseña necesitará el siguiente token: ${token}</p>
        <p>Para continuar con este proceso, sólo debe colocar el token en la ventana emergente.</p>
        <p>Si usted no estaba a la espera de este servicio, ignore este correo electrónico.</p>
        `
    })
};

export {
    emailRegistro,
    emailRestablecer
};
