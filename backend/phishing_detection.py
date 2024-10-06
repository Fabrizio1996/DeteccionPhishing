import re
from urllib.parse import urlparse

def analizar_url(url):
    # Verificar longitud de la URL
    if len(url) > 75:
        return "Alerta"
    
    # Verificar si la URL contiene palabras sospechosas
    if re.search(r'login|secure|account|update|verify|confirm|check|validate|authenticate|reset|bank|payment|invoice|billing|credit|debit|transfer|email|notification|alert|enter|submit|sign|profile|settings|free|winner|prize|special offer|act now|limited time', url.lower()):
        return "Alerta"
    
    # Verificar dominio
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    if not domain.endswith('.com') and not domain.endswith('.org'):
        return "Alerta"
    
    return "Seguro"
