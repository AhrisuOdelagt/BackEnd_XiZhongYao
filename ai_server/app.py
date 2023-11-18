from flask import Flask, request, render_template, jsonify, redirect, url_for
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Conexión con la Base de datos en MongoDB
mongo_uri = os.getenv("MONGO_URI")
app.config['MONGO_URI'] = mongo_uri
# Inicialización de PyMongo
mongo = PyMongo(app)

# Revisamos la que la configuración sea correcta
try:
    # Intentar obtener la lista de colecciones
    collections = mongo.db.list_collection_names()
    if collections:
        print("Conexión a MongoDB establecida correctamente.")
except Exception as e:
    print(f"Error al conectar a MongoDB: {e}")

# Colocamos un endpoint de prueba
@app.route("/", methods=["GET"])
def hola_mundo():
    app.logger.info(f"Se acaba de entrar al {request.path}")
    return render_template("hola_mundo.html")

# Realizamos un Login para acceder a la plataforma
@app.route("/iniciarSesion", methods=["POST"])
def iniciar_sesion():
    if request.method == "POST":
        app.logger.info(f"Se acaba de entrar en {request.path} para iniciar sesión")
        # Verificamos que el paciente se encuentre registrado en la Base de Datos
        pacientes = mongo.db["pacientes"]
        emailPaciente = request.json.get("emailPaciente")
        paciente = pacientes.find_one({"emailPaciente": emailPaciente})
        print(paciente)
        if not paciente:
            error = "El paciente no existe."
            return jsonify({"msg": error}), 404
        # Comprobamos que el usuario encontrado esté confirmado
        if paciente and paciente.get("isConfirmed", False):
            # Obtenemos su Username
            usernamePaciente = paciente.get("usernamePaciente", "Nameless")
            return redirect(url_for("predicciones", username=usernamePaciente))
    else:
        error = "El método no es válido."
        return jsonify({"msg": error}), 403

@app.route("/predicciones", methods=["GET", "POST"])
def predicciones():
    username = request.args.get("username", "nameless")
    return render_template("predicciones.html", username=username)


if __name__ == '__main__':
    app.run(debug=True, port=55555)
