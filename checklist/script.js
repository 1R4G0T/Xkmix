function gerarRelatorio() {
    const area = document.getElementById('captureArea');
    
    // Puxa a unidade que o funcionário escolheu lá na tela inicial (raiz)
    const unidade = localStorage.getItem('unidadeLogada') || "Geral";

    // CONFIGURAÇÃO DOS GRUPOS
    // Substitua os links abaixo pelos links reais dos grupos de cada unidade
    const linksGrupos = {
        "unidade1": "https://chat.whatsapp.com/LINK_DA_UNIDADE_1",
        "unidade2": "https://chat.whatsapp.com/LINK_DA_UNIDADE_2",
        "gerencia": "https://chat.whatsapp.com/Gbcor4OIveN5zH9rLNGxyE"
    };

    console.log("Gerando imagem para a unidade: " + unidade);

    // Usa a biblioteca html2canvas que chamamos no HTML
    html2canvas(area, {
        backgroundColor: "#1a0a2e", // Mantém o roxo no fundo da foto
        scale: 2, // Melhora a qualidade da imagem
        useCORS: true
    }).then(canvas => {
        // 1. Cria a imagem e faz o download automático
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `Checklist_${unidade}_XKMIX.png`;
        link.href = imgData;
        link.click();

        // 2. Aguarda 1.5 segundos para o download iniciar e abre o WhatsApp
        setTimeout(() => {
            // Se a unidade não tiver link específico, envia para a gerência
            const urlDestino = linksGrupos[unidade] || linksGrupos["gerencia"];
            window.open(urlDestino, '_blank');
        }, 1500);
    });
}
