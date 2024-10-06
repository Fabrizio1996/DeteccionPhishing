import mysql.connector
from mysql.connector import Error

def registrar_evento(url, resultado, fecha_evento):
    conexion = None  # Inicializa la variable en None
    try:
        conexion = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='phishing_db'  # Mi base de datos donde se guarda
        )

        if conexion.is_connected():
            cursor = conexion.cursor()
            # Aquí va el código para registrar el evento, por ejemplo:
            cursor.execute("INSERT INTO eventos_phishing (url, resultado, fecha_evento) VALUES (%s, %s, %s)", (url, resultado, fecha_evento))
            conexion.commit()
            print("Evento registrado exitosamente.")

    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
    finally:
        if conexion is not None and conexion.is_connected():
            conexion.close()

