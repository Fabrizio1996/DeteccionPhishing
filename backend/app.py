from flask import Flask, request, jsonify
from datetime import datetime
import mysql.connector
from phishing_detection import analizar_url
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Función para registrar eventos en la base de datos
def registrar_evento(url, resultado, fecha_evento):
    try:
        conexion = mysql.connector.connect(
            host='localhost',
            user='root', 
            password='',
            database='phishing_db'
        )
        cursor = conexion.cursor()
        cursor.execute("INSERT INTO eventos_phishing (url, resultado, fecha_evento) VALUES (%s, %s, %s)", (url, resultado, fecha_evento))
        conexion.commit()
        cursor.close()
        conexion.close()
    except mysql.connector.Error as e:
        print(f"Error al conectar a la base de datos: {e}")

# Función para obtener las URLs bloqueadas desde la base de datos
def obtener_urls_bloqueadas():
    try:
        conexion = mysql.connector.connect(
            host='localhost',
            user='root', 
            password='',
            database='phishing_db'
        )
        cursor = conexion.cursor()
        cursor.execute("SELECT url FROM eventos_phishing WHERE resultado = 'Alerta'")
        urls = cursor.fetchall()
        cursor.close()
        conexion.close()
        return [url[0] for url in urls]  # Convertir a una lista de strings
    except mysql.connector.Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return []

# Endpoint para analizar la URL
@app.route('/analizar-url', methods=['GET'])
def analizar_url_endpoint():
    url = request.args.get('url')
    resultado = analizar_url(url)  # Llama a la función de análisis
    fecha_evento = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    registrar_evento(url, resultado, fecha_evento)  # Registrar el evento en la base de datos
    
    return jsonify({"resultado": resultado})  # Asegúrate de devolver el resultado en formato JSON

# Endpoint para obtener las URLs bloqueadas
@app.route('/urls-bloqueadas', methods=['GET'])
def obtener_urls_bloqueadas_endpoint():
    urls = obtener_urls_bloqueadas()
    return jsonify({"urls_bloqueadas": urls})

if __name__ == '__main__':
    app.run(debug=True)


