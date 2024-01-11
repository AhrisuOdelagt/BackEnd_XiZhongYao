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

// Email para la modificación de contraseña
const emailSolicitarCita = async (datos) => {
  const {email, nombreDoctor, nombrePaciente, fecha, dia, horaInicio, horaFin} = datos;

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
      subject: "XiZhongYao — Solicitud de Cita",
      text: `El paciente ${nombrePaciente} solicita una cita con usted.`,
      html: `
      <p>Buen día, doctor ${nombreDoctor}.</p>
      <p>Se le envía la notificación de que el paciente ${nombrePaciente} desea solicitar una cita con usted.</p>
      <p>Los detalles de la cita con fecha ${fecha} son los siguientes:</p>
      <p>Día: ${dia}</p>
      <p>Hora de inicio: ${horaInicio}</p>
      <p>Hora de término: ${horaFin}</p>
      <p>Recomendamos aceptar o rechazar la cita a la brevedad.</p>
      <p>Si usted no estaba a la espera de este servicio, ignore este correo electrónico.</p>
      `
  })
};

// Email para la modificación de contraseña
const emailEstadoCita = async (datos) => {
  const {email, nombreDoctor, nombrePaciente, fecha, dia, horaInicio, horaFin, estado} = datos;

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
      subject: "XiZhongYao — Resultado Solicitud",
      text: `El doctor ${nombreDoctor} ya ha procesado su solicitud de cita.`,
      html: `
      <p>Buen día, ${nombrePaciente}.</p>
      <p>Se le envía la notificación de que el doctor ${nombreDoctor} ya procesó su cita.</p>
      <p>Los detalles de la cita con fecha ${fecha} son los siguientes:</p>
      <p>Día: ${dia}</p>
      <p>Hora de inicio: ${horaInicio}</p>
      <p>Hora de término: ${horaFin}</p>
      <p>Se le informa que el estado de la cita es: ${estado}.</p>
      <p>Si usted no estaba a la espera de este servicio, ignore este correo electrónico.</p>
      `
  })
};

export {
    emailRegistro,
    emailRestablecer,
    emailSolicitarCita,
    emailEstadoCita
};
