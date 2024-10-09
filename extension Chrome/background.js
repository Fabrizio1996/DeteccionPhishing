// Función para redirigir a la página bloqueada
function redirigirPaginaBloqueada(tabId) {
    const blockedPageUrl = chrome.runtime.getURL("blocked.html");
    chrome.tabs.update(tabId, { url: blockedPageUrl });
}

// Función para verificar si una URL está en la lista de URLs bloqueadas
function verificarURLBloqueada(url, tabId) {
    fetch('http://localhost:5000/urls-bloqueadas')  // Endpoint para obtener las URLs bloqueadas
        .then(response => response.json())
        .then(data => {
            const urlsBloqueadas = data.urls_bloqueadas;
            // Si la URL está en la lista de URLs bloqueadas, redirige a la página bloqueada
            if (urlsBloqueadas.some(bloqueada => url.includes(bloqueada))) {
                redirigirPaginaBloqueada(tabId);
            }
        })
        .catch(error => {
            console.error('Error al obtener las URLs bloqueadas:', error);
        });
}

// Listener que se activa cuando una pestaña se actualiza
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Evitar el bucle verificando si la URL es ya la de 'blocked.html'
    const blockedUrl = chrome.runtime.getURL("blocked.html");

    // Filtrar URLs con esquemas 'chrome://' o 'chrome-extension://'
    const urlEsquema = new URL(tab.url).protocol;
    if (urlEsquema === 'chrome:' || urlEsquema === 'chrome-extension:') {
        // Ignorar URLs internas de Chrome
        return;
    }

    if (changeInfo.status === 'complete' && tab.url && tab.url !== blockedUrl) {
        console.log(`Analizando URL: ${tab.url}`);

        // Realiza la petición para analizar la URL
        fetch(`http://localhost:5000/analizar-url?url=${tab.url}`)
            .then(response => response.json())
            .then(data => {
                console.log(`Resultado del análisis: ${data.resultado}`);
                
                if (data.resultado === 'Alerta') {
                    // Mostrar una notificación si la página es peligrosa
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/icon48.png',
                        title: '⚠️ ¡Advertencia de Phishing!',
                        message: 'Este sitio puede ser de phishing y no es seguro. Te recomendamos que lo abandones.',
                        priority: 2
                    });

                    // Bloquear la página redirigiendo a blocked.html
                    redirigirPaginaBloqueada(tabId);
                } else {
                    // Verificar si la URL ya está bloqueada en la base de datos
                    verificarURLBloqueada(tab.url, tabId);
                }
            })
            .catch(error => {
                console.error('Error al analizar la URL:', error);
            });
    }
});

