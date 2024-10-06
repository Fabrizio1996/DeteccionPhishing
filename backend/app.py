from flask import Flask, request
from datetime import datetime
import mysql.connector
from phishing_detection import analizar_url
from flask_cors import CORS

app = Flask(__name__)

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

@app.route('/analizar-url', methods=['GET'])
def analizar_url_endpoint():
    url = request.args.get('url')
    resultado = analizar_url(url)  # Llama a la función de análisis
    fecha_evento = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    registrar_evento(url, resultado, fecha_evento)
    
    return {"resultado": resultado}  # Asegúrate de que esto sea un JSON
if __name__ == '__main__':
    app.run(debug=True)
    
    app = Flask(__name__)
CORS(app)

