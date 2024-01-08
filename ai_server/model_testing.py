import tensorflow as tf

model_path = "ai_server/content/carpeta_salida/modelo_plantas/1"

# Cargando Modelo
print("Cargando Modelo...")
model = tf.keras.models.load_model(model_path)
print("¡Se ha cargado el modelo!")

# Categorizar una imagen de internet (corregido)
from PIL import Image
from io import BytesIO
import requests
import numpy as np
import cv2

def categorizar(url):
    respuesta = requests.get(url)
    img = Image.open(BytesIO(respuesta.content))

    img_array = np.array(img.convert('RGB')).astype(float) / 255  # Convert to RGB and normalize
    img_array = cv2.resize(img_array, (224, 224))  # Resize image array to match model input shape

    img_array = img_array.reshape(1, 224, 224, 3)  # Reshape to match model input shape

    prediccion = model.predict(img_array)
    return np.argmax(prediccion[0], axis=-1)

url = str(input("Escriba una URL:    "))
prediccion = categorizar(url)
if prediccion == 0:
    print("Lavanda")
elif prediccion == 1:
    print("Manzanilla")
elif prediccion == 2:
    print("Menta")
elif prediccion == 3:
    print("No es una planta o esta planta no es manejada en el sistema")
elif prediccion == 4:
    print("Romero")
elif prediccion == 5:
    print("Tomillo")
