chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(
    function(details) {
      const url = details.url;
      if (isPhishingURL(url)) {
        // Bloquea la solicitud si se detecta una URL de phishing
        notifyUser(url); // Notifica al usuario sobre el bloqueo
        return { cancel: true };
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

// Función para determinar si una URL es de phishing (simple ejemplo)
function isPhishingURL(url) {
    const phishingIndicators = [
        "phishing.com", 
        "fakebank.com", 
        ".xyz", 
        ".top", 
        ".club", 
        ".online", 
        "login",         // Palabras clave comunes en phishing URLs
        "secure",        // Intento de parecer seguro
        "confirm",       // Acción de confirmación solicitada
        "account",       // Relacionado a cuentas bancarias o plataformas
        "paypal",        // Imitaciones de marcas conocidas
        "facebook",
        "googIe"         // Caracteres visualmente similares (nota la "i" mayúscula)
    ];

    return phishingIndicators.some(indicator => url.includes(indicator));
}

// Función para enviar una notificación al usuario
function notifyUser(url) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png", // Usa el ícono de tu extensión
        title: "Página Bloqueada",
        message: `Se ha bloqueado una página sospechosa: ${info.url}. Se ha redirigido a una página de advertencia.`
    });
}

  