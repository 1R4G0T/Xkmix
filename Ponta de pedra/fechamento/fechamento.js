document.addEventListener('DOMContentLoaded', () => {
    const sysDinheiro = document.getElementById('sysDinheiro');
    const sysPix = document.getElementById('sysPix');
    const sysCartao = document.getElementById('sysCartao');

    const caixaDinheiroDia = document.getElementById('caixaDinheiroDia');
    const caixaEnvelope = document.getElementById('caixaEnvelope');
    const caixaProximoDia = document.getElementById('caixaProximoDia');
    const sangriasList = document.getElementById('sangriasList');
    const addSangriaBtn = document.getElementById('addSangriaBtn');

    const maqCredito = document.getElementById('maqCredito');
    const maqDebito = document.getElementById('maqDebito');
    const maqPix = document.getElementById('maqPix');

    const manDinheiro = document.getElementById('manDinheiro');
    const manPix = document.getElementById('manPix');
    const manCartao = document.getElementById('manCartao');

    const obsText = document.getElementById('obsText');
    const psText = document.getElementById('psText');
    const sendWhatsappBtn = document.getElementById('sendWhatsapp');

    let userEditedProximoDia = false;

    // Ajudinha automática para preencher o troco do dia seguinte, editável se quiser
    function autoPreencherProximoDia() {
        if (userEditedProximoDia) return;
        const totalDia = parseFloat(caixaDinheiroDia.value) || 0;
        const envelope = parseFloat(caixaEnvelope.value) || 0;
        
        let totalSangrias = 0;
        document.querySelectorAll('.sangria-val').forEach(input => {
            totalSangrias += parseFloat(input.value) || 0;
        });

        const restante = totalDia - envelope - totalSangrias;
        if (restante >= 0) {
            caixaProximoDia.value = restante.toFixed(2);
        }
    }

    if (caixaDinheiroDia) caixaDinheiroDia.addEventListener('input', autoPreencherProximoDia);
    if (caixaEnvelope) caixaEnvelope.addEventListener('input', autoPreencherProximoDia);
    if (caixaProximoDia) {
        caixaProximoDia.addEventListener('input', () => {
            userEditedProximoDia = true;
        });
    }

    if (addSangriaBtn) {
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
                autoPreencherProximoDia();
            });

            div.querySelector('.sangria-val').addEventListener('input', autoPreencherProximoDia);
        });
    }

    if (sendWhatsappBtn) {
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

            // Valores informados manualmente para sobra/falta
            const diffDinheiro = parseFloat(manDinheiro.value) || 0;
            const diffPix = parseFloat(manPix.value) || 0;
            const diffCartao = parseFloat(manCartao.value) || 0;

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
            mensagem += `• Crédito: R$ ${mCredito.toFixed(2)}\n`;
            mensagem += `• Débito: R$ ${mDebito.toFixed(2)}\n`;
            mensagem += `• PIX Maquinetas: R$ ${mPix.toFixed(2)}\n\n`;

            mensagem += `⚠ *CONFERÊNCIA (Diferenças):*\n`;
            mensagem += `• Dinheiro: ${diffDinheiro === 0 ? 'Exato' : (diffDinheiro > 0 ? `Sobrou R$ ${diffDinheiro.toFixed(2)}` : `Faltou R$ ${Math.abs(diffDinheiro).toFixed(2)}`)}\n`;
            mensagem += `• PIX: ${diffPix === 0 ? 'Exato' : (diffPix > 0 ? `Sobrou R$ ${diffPix.toFixed(2)}` : `Faltou R$ ${Math.abs(diffPix).toFixed(2)}`)}\n`;
            mensagem += `• Cartão: ${diffCartao === 0 ? 'Exato' : (diffCartao > 0 ? `Sobrou R$ ${diffCartao.toFixed(2)}` : `Faltou R$ ${Math.abs(diffCartao).toFixed(2)}`)}\n`;

            if (obsText.value.trim()) {
                mensagem += `• Obs: ${obsText.value.trim()}\n`;
            }

            if (psText.value.trim()) {
                mensagem += `\n📝 *PS / ANOTAÇÃO:* ${psText.value.trim()}\n`;
            }

            const telefone = ''; 
            const urlWhatsApp = https://chat.whatsapp.com/JE2y0sjvGqKCO6kYpsASVF;
            window.open(urlWhatsApp, '_blank');
        });
    }
});
