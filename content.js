(function() {
    const suspiciousWords = ["login", "password", "bank", "credit card", "urgent", "verify", "security", "transfer", "account locked"];

    function scanPageForPhishing() {
        const bodyText = document.body.innerText.toLowerCase();
        const foundSuspiciousWords = suspiciousWords.some(word => bodyText.includes(word));
        
        if (foundSuspiciousWords) {
            alert("Advertencia: esta página contiene contenido sospechoso. Ten cuidado!");
        }
    }
    
    window.onload = scanPageForPhishing;
})();
