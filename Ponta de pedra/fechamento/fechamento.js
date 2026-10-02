document.addEventListener('DOMContentLoaded', () => {
    // Campos do Sistema
    const sysDinheiro = document.getElementById('sysDinheiro');
    const sysPix = document.getElementById('sysPix');
    const sysCartao = document.getElementById('sysCartao');

    // Campos do Caixa
    const caixaDinheiroDia = document.getElementById('caixaDinheiroDia');
    const caixaEnvelope = document.getElementById('caixaEnvelope');
    const caixaProximoDia = document.getElementById('caixaProximoDia');
    const sangriasList = document.getElementById('sangriasList');
    const addSangriaBtn = document.getElementById('addSangriaBtn');

    // Campos das Maquinetas
    const maqCredito = document.getElementById('maqCredito');
    const maqDebito = document.getElementById('maqDebito');
    const maqPix = document.getElementById('maqPix');

    // Observações e PS
    const diffAlertBox = document.getElementById('diffAlertBox');
    const obsText = document.getElementById('obsText');
    const psText = document.getElementById('psText');
    const sendWhatsappBtn = document.getElementById('sendWhatsapp');

    // Gerenciamento de Sangrias Dinâmicas
    addSangriaBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'sangria-item';
        div.innerHTML = `
            <input type="number" step="0.01" placeholder="Valor da sangria (R$)" class="sangria-val">
            <button type="button" class="remove-sangria">X</button>
        `;
        sangriasList.appendChild(div);

        div.querySelector('.remove-sangria').addEventListener('click', () => {
            div.remove();
            calcularDiferenca();
        });

        div.querySelector('.sangria-val').addEventListener('input', calcularDiferenca);
    });

    // Função de Cálculo Automático de Sobra/Falta
    function calcularDiferenca() {
        const sysVal = parseFloat(sysDinheiro.value) || 0;
        const caixaVal = parseFloat(caixaDinheiroDia.value) || 0;
        const envelopeVal = parseFloat(caixaEnvelope.value) || 0;
        const proximoDiaVal = parseFloat(caixaProximoDia.value) || 0;

        // Somar todas as sangrias ativas
        let totalSangrias = 0;
        document.querySelectorAll('.sangria-val').forEach(input => {
            totalSangrias += parseFloat(input.value) || 0;
        });

        // O total apurado em caixa físico é: Envelope + Próximo Dia + Sangrias
        const totalFisicoApurado = envelopeVal + proximoDiaVal + totalSangrias;

        // A diferença entre o que o sistema diz que entrou em dinheiro e o que foi encontrado fisicamente
        const diferenca = totalFisicoApurado - caixaVal; // Ou comparando com sysVal dependendo da regra da loja

        // Vamos calcular com base no Total do Dinheiro do Dia informado vs Sistema ou Destinos
        // Regra padrão de caixa: Dinheiro do Dia deve bater com (Envelope + Próximo Dia + Sangrias)
        const diferencaCaixa = caixaVal - totalFisicoApurado; 

        if (!caixaDinheiroDia.value && !sysDinheiro.value) {
            diffAlertBox.className = 'diff-box neutral';
            diffAlertBox.innerHTML = 'Aguardando valores para cálculo...';
            return;
        }

        if (Math.abs(diferencaCaixa) < 0.01) {
            diffAlertBox.className = 'diff-box success';
            diffAlertBox.innerHTML = '✅ CAIXA EXATO! Sem sobra nem falta.';
        } else if (diferencaCaixa > 0) {
            diffAlertBox.className = 'diff-box danger';
            diffAlertBox.innerHTML = `⚠️ SOBROU DINHEIRO: R$ ${diferencaCaixa.toFixed(2)}`;
        } else {
            diffAlertBox.className = 'diff-box danger';
            diffAlertBox.innerHTML = `⚠️ FALTOU DINHEIRO: R$ ${Math.abs(diferencaCaixa).toFixed(2)}`;
        }
    }

    // Ouvir alterações em todos os campos numéricos para recalcular em tempo real
    const inputsToWatch = [sysDinheiro, sysPix, sysCartao, caixaDinheiroDia, caixaEnvelope, caixaProximoDia, maqCredito, maqDebito, maqPix];
    inputsToWatch.forEach(input => {
        if (input) input.addEventListener('input', calcularDiferenca);
    });

    // Enviar WhatsApp Formatado
    sendWhatsappBtn.addEventListener('click', () => {
        const sDinheiro = parseFloat(sysDinheiro.value) || 0;
        const sPix = parseFloat(sysPix.value) || 0;
        const sCartao = parseFloat(sysCartao.value) || 0;

        const cDinheiroDia = parseFloat(caixaDinheiroDia.value) || 0;
        const cEnvelope = parseFloat(caixaEnvelope.value) || 0;
        const cProximoDia = parseFloat(caixaProximoDia.value) || 0;

        let totalSangrias = 0;
        let sangriasDesc = [];
        document.querySelectorAll('.sangria-val').forEach((input, index) => {
            const val = parseFloat(input.value) || 0;
            if (val > 0) {
                totalSangrias += val;
                sangriasDesc.push(`  - Sangria ${index + 1}: R$ ${val.toFixed(2)}`);
            }
        });

        const mCredito = parseFloat(maqCredito.value) || 0;
        const mDebito = parseFloat(maqDebito.value) || 0;
        const mPix = parseFloat(maqPix.value) || 0;

        const totalFisicoApurado = cEnvelope + cProximoDia + totalSangrias;
        const diff = cDinheiroDia - totalFisicoApurado;
        let statusSobraFalta = "Exato (Sem diferenças)";
        if (diff > 0) statusSobraFalta = `Sobrou R$ ${diff.toFixed(2)}`;
        else if (diff < 0) statusSobraFalta = `Faltou R$ ${Math.abs(diff).toFixed(2)}`;

        // Montagem da Mensagem do WhatsApp
        let mensagem = `*XKMIX - FECHAMENTO DE CAIXA*\n`;
        mensagem += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`;

        mensagem += `📊 *DADOS DO SISTEMA:*\n`;
        mensagem += `• Dinheiro: R$ ${sDinheiro.toFixed(2)}\n`;
        mensagem += `• PIX: R$ ${sPix.toFixed(2)}\n`;
        mensagem += `• Cartão: R$ ${sCartao.toFixed(2)}\n\n`;

        mensagem += `💵 *DADOS DO CAIXA:*\n`;
        mensagem += `• Total Dinheiro do Dia: R$ ${cDinheiroDia.toFixed(2)}\n`;
        mensagem += `• Dinheiro no Envelope: R$ ${cEnvelope.toFixed(2)}\n`;
        mensagem += `• Caixa Dia Seguinte: R$ ${cProximoDia.toFixed(2)}\n`;
        if (sangriasDesc.length > 0) {
            mensagem += `• Sangrias (Total: R$ ${totalSangrias.toFixed(2)}):\n` + sangriasDesc.join('\n') + `\n`;
        } else {
            mensagem += `• Sangrias: R$ 0.00\n`;
        }

        mensagem += `\n💳 *DADOS DAS MAQUINETAS:*\n`;
        mensagem += `• Total Crédito: R$ ${mCredito.toFixed(2)}\n`;
        mensagem += `• Total Débito: R$ ${mDebito.toFixed(2)}\n`;
        mensagem += `• Total PIX: R$ ${mPix.toFixed(2)}\n\n`;

        mensagem += `⚠️ *OBS (Sobra/Falta):* ${statusSobraFalta}\n`;
        if (obsText.value.trim()) {
            mensagem += `• Detalhes: ${obsText.value.trim()}\n`;
        }

        if (psText.value.trim()) {
            mensagem += `\n📝 *PS / ANOTAÇÃO:* ${psText.value.trim()}\n`;
        }

        const telefone = ''; // Insira o número se desejar fixar
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
        window.open(urlWhatsApp, '_blank');
    });
});
