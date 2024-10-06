chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log(`Analizando URL: ${tab.url}`);

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
                }
            })
            .catch(error => {
                console.error('Error al analizar la URL:', error);
            });
    }
});







