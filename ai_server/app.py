from flask import Flask, request, render_template
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
    print("Conexión a MongoDB establecida correctamente.")
except Exception as e:
    print(f"Error al conectar a MongoDB: {e}")

# Colocamos un endpoint de prueba
@app.route("/", methods=["GET"])
def hola_mundo():
    app.logger.info(f"Se acaba de entrar al {request.path}")
    return render_template("hola_mundo.html")

if __name__ == '__main__':
    app.run(debug=True, port=55555)
