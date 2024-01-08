# Importaciones Flask
from flask import Flask, request, render_template
import os
import tensorflow as tf
from PIL import Image
from io import BytesIO
import numpy as np
import cv2
import requests

app = Flask(__name__, static_folder='static')

# Diccionario con Información
info_plantas = {
    "Lavanda": """
            LAVANDA (nombre científico Lavandula officinalis)
            \nPropiedades medicinales:
            \n- Es antiséptico natural, utilizar un par de gotas de lavanda ayudará a la disminución del sangrado en una herida, la limpia y evitará alguna infección.
            \n- Tiene propiedades antiinflamatorias que te ayudarán a recuperarte de cualquier lesión, esguince, entre otros.
            \n- Actúa como relajante en el sistema nervioso central, disminuyendo el estrés, la ansiedad y el insomnio.
            \n- Es antioxidante, por lo que te ayudará a tener una mejor digestión y es bueno para combatir la degeneración celular.
            \n- Es antivírica y antibacteriana, por lo que será de gran ayuda en casos de faringitis, laringitis o cualquier inflamación. Además, trata enfermedades como la gripe, bronquitis y cualquier resfriado común.

            \n\nCUIDADOS DE LA LAVANDA:
            \n- Necesita una buena ventilación. Si decides plantarla en el suelo, evita hacerlo cerca de otras plantas, y si lo haces en maceteros grandes y bonitos, procura que tenga un diámetro de entre 30 y 40 cm.
            \n- Ten en cuenta que debe recibir al menos 6 horas diarias de sol.
            \n- Para que crezca bien, utiliza un sustrato alcalino y si el suelo es ácido, compensa con la acidez con un sustrato específico.
            \n- Necesita tener un buen drenaje para que el jardín luzca perfecto antes de que llegue el frío.
            \n- En los meses de calor, riega 1 ó 2 veces por semana, sin mojar las ramas y las flores.
            \n- Puedes cultivarla en tiestos y se riega una vez por semana en las zonas de clima cálido.
            \n- La mejor época para plantar la lavanda es a principios de otoño.

            \n\nPrecauciones:
            \nNo usar en:
            \n- Personas con alergia a alguno de sus principios activos.
            \n- Personas que tengan la tensión baja porque la lavanda es hipotensora y al usarla bajaría más la tensión causando mareos, náuseas y otros problemas.
            \n- Personas con estreñimiento.
            \n- Durante el embarazo ni durante la lactancia.
            \n- Niños menores de 6 años y para los mayores de esta edad debe hacerse bajo la observación de un profesional que indique el tratamiento a llevar.

            \n\nEfectos secundarios de la lavanda:
            \n- Consumida por vía oral puede causar estreñimiento y aumento de apetito, así que hay que monitorear si se consume por primera vez para asegurarse de que no tenga estos efectos en el individuo particular.
            \n- Si se usa el aceite esencial sin diluir directamente tomado o en la piel puede causar dermatitis e irritación.

            \n\nIMPORTANTE: Esta información tiene por objeto complementar, no reemplazar el consejo de su médico o profesional de la salud y no pretende cubrir todos los posibles usos, precauciones, interacciones o efectos adversos. Es posible que esta información no se ajuste a sus circunstancias específicas de salud.
            """,
    "Manzanilla": """
            MANZANILLA (Camomila común, de nombre científico Chamaemelum nobile)
            \nPropiedades medicinales:
            \n- La manzanilla contiene ácidos grasos, betacarotenos, taninos, mucílagos, camazuelo, cumarina, terpenoides, flavonoides, vitamina C, colina.
            \n- Estos componentes son los responsables de que la manzanilla posea propiedades:
            \n- Digestiva, ansiolítica, colagoga, hepatoprotectora, antiséptica, carminativa, antiulcerosa, sedante suave, antifúngica, antiespasmódica, antiulcerosa, antiinflamatoria, emenagoga, antioxidante, sedante, antimicrobiana, antidiabética, diurética, astringente.
            
            \n\nCuidados para la manzanilla:
            \n- La camomila necesita de suelos o sustratos con un muy buen drenaje, de forma que al regar no llegue nunca a encharcarse. No precisa, en cambio, de tierra excesivamente rica en materia orgánica, pero sí necesita un aporte anual de compost o humus de lombriz; con uno al año tu planta de manzanilla tendrá más que suficiente. Si decides plantar y cultivar manzanilla en una maceta, usa recipientes de al menos 20 o 25 cm de profundidad.
            \n- La manzanilla soporta mejor la sequía que el exceso de humedad. Por ello, se aconseja usar el riego por goteo o, incluso, por bandeja en la base de la maceta, renovando el agua cuando el sustrato parezca demasiado seco.
            
            \n\nPrecauciones
            \nNo usar en:
            \n- Embarazadas: el aceite esencial de manzanilla ejerce un efecto uterotónico, pudiendo causar aborto.
            \n- Niños menores de 5 años: debido al poder alérgeno de los distintos componentes que encontramos en el aceite esencial de manzanilla, no se recomienda el consumo de este aceite en niños menores de 5 años.
            \n- Personas alérgicas a la manzanilla: no se recomienda el consumo ni de la infusión de manzanilla ni de sus aceites esenciales a personas alérgicas a la manzanilla.
            \n- Personas alérgicas al polen: no se aconseja el consumo de manzanilla en personas con alergia al polen, rinitis alérgica o alergia a la ambrosía y al crisantemo.
            
            \n\nIMPORTANTE: Esta información tiene por objeto complementar, no reemplazar el consejo de su médico o profesional de la salud y no pretende cubrir todos los posibles usos, precauciones, interacciones o efectos adversos. Es posible que esta información no se ajuste a sus circunstancias específicas de salud.
            """,
    "Menta": """
            MENTA (Nombre científico Mentha)
            \nPropiedades medicinales:
            \n- Digestiones lentas y pesadas: la infusión o tintura de menta se utiliza con éxito para mejorar las digestiones lentas y pesadas debido a su efecto digestivo (promueve la buena digestión de los alimentos).
            \n- Dolor de cabeza: el dolor de cabeza ya sea migraña o jaqueca, puede estar ocasionado por cientos de causas diferentes. Las malas digestiones y el mal funcionamiento de nuestro sistema digestivo es una causa del dolor de cabeza o cefalea. Es una planta medicinal que puede prevenir y aliviar los dolores de cabeza cuyo origen está en una mala digestión.
            \n- Fatiga: esta hierba medicinal se utiliza para combatir la fatiga mental y física e incluso para los periodos de convalecencia. Al tener acción estimulante resulta ser un remedio natural muy útil para mejorar estos casos.
            \n- Tos, bronquitis, gripe y resfriado: la menta tiene efecto descongestionante, expectorante y antiséptico, una combinación de propiedades medicinales excelentes para mejorar los síntomas de bronquitis, gripe y resfriado de forma natural. Otra gran cualidad de la menta es la de aliviar la tos incluso si hay espasmos.

            \n\nCuidados de la menta:
            \n- Necesita un suelo rico en nutrientes y bien drenado, que se mantenga húmedo, pero no empapado.
            \n- Necesita un buen drenaje porque la humedad constante la mata.
            \n- La frecuencia de riego debe ser abundante, manteniendo la tierra húmeda.
            \n- La frecuencia de fertilizante debe ser cada 2 años.
            \n- Mantener la tierra constantemente húmeda y regar cuando se seque el primer centímetro.
            \n- Proporcionar suficiente luz solar, aunque también puede crecer a la sombra.
            \n- Mantener la menta en maceta preferentemente.
            \n- Poda constante de las hojas laterales.
            \n- Quitar algunas hojas de vez en cuando para estimular el crecimiento de nuevos brotes.
            
            \n\nPrecauciones: 
            \n- No use menta en un intento de aliviar problemas digestivos si sus síntomas están relacionados con la enfermedad de reflujo gastroesofágico (ERGE), ya que los síntomas pueden empeorar.
            \n- El aceite de menta, si se toma en grandes dosis, puede ser tóxico. El mentol puro es venenoso y nunca debe tomarse internamente.
            \n- No aplique aceite de menta en la cara de un bebé o niño pequeño, ya que puede causar espasmos que inhiben la respiración.
            
            \n\nIMPORTANTE: Esta información tiene por objeto complementar, no reemplazar el consejo de su médico o profesional de la salud y no pretende cubrir todos los posibles usos, precauciones, interacciones o efectos adversos. Es posible que esta información no se ajuste a sus circunstancias específicas de salud.
            """,
    "Romero": """
            ROMERO 
            \nPropiedades medicinales:
            \n- Para la circulación: es un excelente estimulante circulatorio que favorece la irrigación sanguínea en el cerebro, lo cual facilita una mayor concentración y retención de conocimientos. 
            \n- Para la memoria: por sus propiedades circulatorias el romero se muestra como una ayuda válida en el tratamiento de síntomas seniles y para apoyar el esfuerzo intelectual de estudiantes, creativos o investigadores, obligados a hacer arduos ejercicios de memorización de datos y conocimientos.
            \n- Para el sistema nervioso: contribuye a eliminar la jaqueca, si es de origen nervioso o digestivo, y tiene un claro efecto reparador, que reequilibra las funciones de los órganos que han quedado afectados después de una larga enfermedad o en situaciones de debilidad crónica o astenia.
            \n- Para el colesterol: ayuda a reducir el colesterol LDL combinado con otras plantas con efectos hipocolesterolemiantes más evidentes, como la alcachofa, el jengibre o la judía.
            \n- Para el dolor: en uso externo, el alcohol de romero se revela como un poderoso y efectivo remedio tradicional contra los dolores reumáticos, neuralgias y dolor en hombros y espalda.
            
            \n\nCuidados:
            \n- Luz adecuada para el romero: es necesario que reciba luz natural directa, pues es una planta que necesita bastante sol y luz. No obstante, hay que procurar que en épocas de sol fuerte no se quede la planta todas las horas de calor en pleno sol directo, porque será fácil que sus hojas se quemen. Por ello, en épocas de mucho calor y sol fuerte lo mejor es buscarle un sitio con sol y sombra y en épocas templadas o frías buscarle el lugar con más luz natural posible.
            \n- Temperatura óptima para la planta de romero: esta planta puede adaptarse a temperaturas frías y a las calurosas, pero realmente, la temperatura adecuada para el romero es la que hay en climas templados y cálidos. Así, no aguantará bien granizadas, heladas y bajadas de temperatura bruscas, pero tampoco zonas donde el sol calienta en exceso.
            \n- Humedad adecuada para un romero en maceta: esta planta es natural de toda la zona del mar Mediterráneo y, por ello, está habituada a tener épocas de sequía y épocas con más cantidad de agua, aunque nunca en exceso. Por tanto, no necesita una humedad elevada y con los riegos será suficiente.
            
            \n\nPrecauciones:
            \n- Las personas sensibles pueden experimentar reacciones alérgicas, especialmente dermatitis por contacto.
            \n- No es recomendable su consumo en personas con cálculos biliares.
            \n- En uso externo, el romero irrita la piel y aumenta el riego sanguíneo en la zona de aplicación. Por vía tópica, la esencia de romero puede causar dermatitis y eritema.
            \n- La intoxicación por infusiones de romero es poco frecuente.
            \n- Una sobredosis podría causar espasmos abdominales, vómitos, gastroenteritis, hemorragias uterinas e irritación renal.
            \n- El aceite esencial en concentraciones elevadas puede ser tóxico para el sistema nervioso central y provocar convulsiones. No se recomienda su uso durante períodos de tiempo prolongados o en dosis mayores a las recomendadas y se debe tener mucha precaución con los niños.
            \n- No debe usarse durante embarazo y lactancia.
            
            \n\nIMPORTANTE: Esta información tiene por objeto complementar, no reemplazar el consejo de su médico o profesional de la salud y no pretende cubrir todos los posibles usos, precauciones, interacciones o efectos adversos. Es posible que esta información no se ajuste a sus circunstancias específicas de salud.
            """,
    "Tomillo": """
            TOMILLO (Nombre científico Thymus vulgaris)
            \nPropiedades medicinales:
            \n- Reduce afecciones respiratorias: el consumo de tomillo ayuda bastante para limpiar las vías respiratorias y desinflamarlas en pacientes con asma o con enfermedades respiratorias. Ayuda tanto a las vías altas como bajas, reduciendo la tos espasmódica. Tiene un efecto expectorante, ayudando a abrir las vías y facilitando a que los bronquios eliminen las secreciones. Por otro lado, es un gran antiséptico que combate las bacterias que puedan estar causando la enfermedad respiratoria.
            \n- Ayuda a la digestión: la planta del tomillo ayuda a reducir los efectos de una mala digestión, como lo es la fermentación. Disminuye la formación de gases y alivia los cólicos causados por ellos. Agregarlo como condimento puede ser una gran adición a cualquier platillo. Por otro lado, el tomillo estimula la secreción de jugos gástricos, necesarios para la correcta digestión estomacal.
            \n- Acelera la cicatrización: la aplicación tópica de tomillo acelera el proceso de cicatrización. Puede ser útil en situaciones como quemaduras, heridas superficiales, heridas infectadas, acné, llagas o ampollas. Estas cicatrices se tratan con miel de tomillo, que en combinación con el preciado líquido resulta en un gran desinfectante usado incluso en hospitales
            
            \n\nCuidados:
            \n- El clima adecuado: el tomillo es una planta muy adaptada al clima templado mediterráneo seco, por lo que soporta muy bien la sequía y necesita de pocos riegos. Cuando riegues tu tomillo, procura siempre no encharcar el suelo ni humedecerlo demasiado porque, como con la mayoría de las plantas de este tipo, se pudriría ante el exceso de humedad.
            \n- Enfermedades: estamos hablando, también, de una planta muy resistente frente a plagas y enfermedades, de modo que lo único que puede afectarle más son los hongos en caso de que sufra exceso de humedad. No te pierdas este artículo de Fungicidas caseros para mantener a tu planta siempre protegida.
            \n- Sustratos y abonos: por todo lo ya expuesto, cuando plantes tu tomillo en una maceta, prepárale un sustrato con buen drenaje y con una base de arenilla o grava en el fondo. Puedes aportarle algo de abono o fertilizante común o casero cada dos o tres semanas en verano si quieres darle una ayuda en los meses más duros, pero si vives en un clima frío, no uses uno rico en nitrógeno o minerales, pues harían a la planta más débil frente a las heladas.
            \n- Exposición solar: tu tomillo agradecerá además una exposición directa al sol, que lejos de dañarla la fortalecerá.
            
            \n\nPrecauciones:
            \n- La ingesta del tomillo debe evitarse en personas que tengan una alergia o sensibilidad conocida a la planta o a cualquier planta labiada. Tampoco debe consumirse por:
            \n- Mujeres embarazadas, lactantes o niños menores a 6 años de edad.
            \n- Pacientes con insuficiencia renal o cardíaca, gastritis, úlceras estomacales, colitis, epilepsia, Parkinson o cualquier tipo de enfermedad neurológica, no deben consumir tomillo.
            
            \n\nIMPORTANTE: Esta información tiene por objeto complementar, no reemplazar el consejo de su médico o profesional de la salud y no pretende cubrir todos los posibles usos, precauciones, interacciones o efectos adversos. Es posible que esta información no se ajuste a sus circunstancias específicas de salud.
            """,
    "¡Oops! Tenemos errores al procesar esto...": """
            \nHay un error al intentar procesar tu imagen. Puede que...
            \n- No cumpla con alguna de las especificaciones.
            \n- Lo que está en la imagen no sea una planta.
            \n- La planta que intentas procesar no está implementada aún.

            \n\nPrueba de nuevo o intenta con otra planta diferente.
            """
}

# Cargando Modelo al inicio
model_path = "content/carpeta_salida/modelo_plantas/1"
print("Cargando Modelo...")
model = tf.keras.models.load_model(model_path)
print("¡Se ha cargado el modelo!")

# Función para realizar la predicción desde una URL
def categorizar_url(url):
    respuesta = requests.get(url)
    img = Image.open(BytesIO(respuesta.content))
    return categorizar(img)

# Función para realizar la predicción desde una imagen
def categorizar(imagen):
    img_array = np.array(Image.open(imagen).convert('RGB')).astype(float) / 255
    img_array = cv2.resize(img_array, (224, 224))
    img_array = img_array.reshape(1, 224, 224, 3)
    prediccion = model.predict(img_array)
    resultado = np.argmax(prediccion[0], axis=-1)
    if resultado == 0:
        predict = "Lavanda"
    elif resultado == 1:
        predict = "Manzanilla"
    elif resultado == 2:
        predict = "Menta"
    elif resultado == 3:
        predict = "¡Oops! Tenemos errores al procesar esto..."
    elif resultado == 4:
        predict = "Romero"
    elif resultado == 5:
        predict = "Tomillo"
    return predict

# Colocamos un endpoint de prueba
@app.route("/", methods=["GET"])
def hola_mundo():
    app.logger.info(f"Se acaba de entrar al {request.path}")
    return render_template("hola_mundo.html")

@app.route("/predicciones", methods=["GET", "POST"])
def predicciones():
    if request.method == "GET":
        return render_template("subir_imagen.html")
    elif request.method == "POST":
        # Obtén el archivo de imagen desde la solicitud
        imagen = request.files['imagen']
        ruta_temporal = "static/temp/imagen.jpg"
        imagen.save(ruta_temporal)
        
        # Realiza la predicción usando la función categorizar
        prediccion = categorizar(imagen)

        # Obtén la información específica para Lavanda
        if prediccion == "Lavanda":
            info_planta = info_plantas["Lavanda"]
            return render_template("resultados_prediccion.html", prediccion=prediccion, info_planta=info_planta)
        elif prediccion == "Manzanilla":
            info_planta = info_plantas["Manzanilla"]
            return render_template("resultados_prediccion.html", prediccion=prediccion, info_planta=info_planta)
        elif prediccion == "Menta":
            info_planta = info_plantas["Menta"]
            return render_template("resultados_prediccion.html", prediccion=prediccion, info_planta=info_planta)
        elif prediccion == "Romero":
            info_planta = info_plantas["Romero"]
            return render_template("resultados_prediccion.html", prediccion=prediccion, info_planta=info_planta)
        elif prediccion == "Tomillo":
            info_planta = info_plantas["Tomillo"]
            return render_template("resultados_prediccion.html", prediccion=prediccion, info_planta=info_planta)
        elif prediccion == "¡Oops! Tenemos errores al procesar esto...":
            info_planta = info_plantas["¡Oops! Tenemos errores al procesar esto..."]
            return render_template("resultados_prediccion.html", prediccion=prediccion, info_planta=info_planta)
        
        else:
            # Renderiza la plantilla de resultados con la predicción
            return render_template("resultados_prediccion.html", prediccion=prediccion)
    else:
        return "Método no soportado"

if __name__ == '__main__':
    app.run(debug=True, port=55555)
