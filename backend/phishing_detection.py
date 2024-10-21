import pandas as pd
from urllib.parse import urlparse

# Cargar el dataset
dataset = pd.read_csv('URL dataset.csv')

def analizar_url(url):
    domain = urlparse(url).netloc

    # Verificar si el dominio está etiquetado como peligroso en el dataset
    if any(dataset['url'].str.contains(domain, case=False, na=False)):
        etiqueta = dataset.loc[dataset['url'].str.contains(domain), 'type'].values[0]
        return etiqueta
    return "Seguro"


