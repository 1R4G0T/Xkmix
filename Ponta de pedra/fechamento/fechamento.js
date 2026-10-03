document.addEventListener('DOMContentLoaded', function () {
    const btnEnviar = document.getElementById('sendWhatsapp');

    if (btnEnviar) {
        btnEnviar.addEventListener('click', function () {
            // Captura os valores dos campos do formulário
            // Ajuste os IDs abaixo caso os nomes dos inputs no seu HTML sejam diferentes
            const data = document.getElementById('dataFechamento')?.value || '';
            const operador = document.getElementById('operador')?.value || '';
            const dinheiro = document.getElementById('dinheiro')?.value || '0,00';
            const cartao = document.getElementById('cartao')?.value || '0,00';
            const pix = document.getElementById('pix')?.value || '0,00';
            const total = document.getElementById('total')?.value || '0,00';
            const observacoes = document.getElementById('observacoes')?.value || 'Nenhuma';
            const telefone = document.getElementById('telefoneDestino')?.value || '';

            // Monta a mensagem formatada para o WhatsApp
            const mensagem = 
`📊 *FECHAMENTO DE CAIXA* 📊
📅 *Data:* ${data}
👤 *Operador:* ${operador}

💵 *Dinheiro:* R$ ${dinheiro}
💳 *Cartão:* R$ ${cartao}
📱 *PIX:* R$ ${pix}
💰 *TOTAL GERAL:* R$ ${total}

📝 *Observações:* ${observacoes}`;

            // Define o link do WhatsApp (com ou sem número específico)
            let urlWhatsApp;
            if (telefone.trim() !== '') {
                // Remove caracteres não numéricos do telefone caso o usuário digite com traços/parênteses
                const telLimpo = telefone.replace(/\D/g, '');
                urlWhatsApp = `https://api.whatsapp.com/send?phone=${telLimpo}&text=${encodeURIComponent(mensagem)}`;
            } else {
                urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
            }

            // Cria um link temporário invisível para simular clique legítimo 
            // e evitar que o bloqueador de pop-ups do navegador impeça a abertura
            const link = document.createElement('a');
            link.href = urlWhatsApp;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});
