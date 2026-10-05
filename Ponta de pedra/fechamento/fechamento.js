document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos do DOM
    const sysDinheiro = document.getElementById('sysDinheiro');
    const sysPix = document.getElementById('sysPix');
    const sysCartao = document.getElementById('sysCartao');

    const caixaDinheiroDia = document.getElementById('caixaDinheiroDia');
    const caixaEnvelope = document.getElementById('caixaEnvelope');
    const caixaProximoDia = document.getElementById('caixaProximoDia');
    
    const sangriasList = document.getElementById('sangriasList');
    const addSangriaBtn = document.getElementById('addSangriaBtn');

    const suprimentosList = document.getElementById('suprimentosList');
    const addSuprimentoBtn = document.getElementById('addSuprimentoBtn');

    const maqCredito = document.getElementById('maqCredito');
    const maqDebito = document.getElementById('maqDebito');
    const maqPix = document.getElementById('maqPix');

    const manDinheiro = document.getElementById('manDinheiro');
    const manPix = document.getElementById('manPix');
    const manCartao = document.getElementById('manCartao');

    const diffAlertBox = document.getElementById('diffAlertBox');
    const obsText = document.getElementById('obsText');
    const psText = document.getElementById('psText');
    const sendWhatsappBtn = document.getElementById('sendWhatsapp');

    let userEditedProximoDia = false;

    // 2. Cálculo do Caixa do Dia Seguinte (Dinheiro do Dia + Suprimentos - Envelope - Sangrias)
    function autoPreencherProximoDia() {
        if (userEditedProximoDia) return;

        const totalDia = parseFloat(caixaDinheiroDia?.value) || 0;
        const envelope = parseFloat(caixaEnvelope?.value) || 0;

        let totalSangrias = 0;
        document.querySelectorAll('.sangria-val').forEach(input => {
            totalSangrias += parseFloat(input.value) || 0;
        });

        let totalSuprimentos = 0;
        document.querySelectorAll('.suprimento-val').forEach(input => {
            totalSuprimentos += parseFloat(input.value) || 0;
        });

        const restante = totalDia + totalSuprimentos - envelope - totalSangrias;
        if (caixaProximoDia) {
            caixaProximoDia.value = restante >= 0 ? restante.toFixed(2) : '0.00';
        }
    }

    // 3. Atualizar Alerta de Conferência
    function atualizarConferencia() {
        autoPreencherProximoDia();

        if (!diffAlertBox) return;

        const sDinheiro = parseFloat(sysDinheiro?.value) || 0;
        const sPix = parseFloat(sysPix?.value) || 0;
        const sCartao = parseFloat(sysCartao?.value) || 0;

        const cDinheiroDia = parseFloat(caixaDinheiroDia?.value) || 0;
        const mCredito = parseFloat(maqCredito?.value) || 0;
        const mDebito = parseFloat(maqDebito?.value) || 0;
        const mPix = parseFloat(maqPix?.value) || 0;

        // Aceita a diferença inserida manualmente ou calcula automaticamente
        let diffDinheiro = manDinheiro && manDinheiro.value !== '' ? parseFloat(manDinheiro.value) : (cDinheiroDia - sDinheiro);
        let diffPix = manPix && manPix.value !== '' ? parseFloat(manPix.value) : (mPix - sPix);
        let diffCartao = manCartao && manCartao.value !== '' ? parseFloat(manCartao.value) : ((mCredito + mDebito) - sCartao);

        const temDados = sDinheiro > 0 || sPix > 0 || sCartao > 0 || cDinheiroDia > 0 || (mCredito + mDebito) > 0;

        if (!temDados) {
            diffAlertBox.className = 'diff-box neutral';
            diffAlertBox.innerHTML = 'Preencha os valores acima para calcular as diferenças de caixa.';
            return;
        }

        let statusHTML = '';
        let temDivergencia = false;

        function formatarLinha(rotulo, valor) {
            if (Math.abs(valor) < 0.01) {
                return `• ${rotulo}: Exato (R$ 0.00)<br>`;
            } else if (valor > 0) {
                temDivergencia = true;
                return `• ${rotulo}: <strong>Sobrou R$ ${valor.toFixed(2)}</strong><br>`;
            } else {
                temDivergencia = true;
                return `• ${rotulo}: <strong>Faltou R$ ${Math.abs(valor).toFixed(2)}</strong><br>`;
            }
        }

        statusHTML += formatarLinha('Dinheiro', diffDinheiro);
        statusHTML += formatarLinha('PIX', diffPix);
        statusHTML += formatarLinha('Cartão', diffCartao);

        if (!temDivergencia) {
            diffAlertBox.className = 'diff-box success';
            diffAlertBox.innerHTML = '✅ <strong>CAIXA OK:</strong> Nenhuma divergência detetada!<br>' + statusHTML;
        } else {
            diffAlertBox.className = 'diff-box danger';
            diffAlertBox.innerHTML = '⚠️ <strong>DIVERGÊNCIA DETETADA:</strong><br>' + statusHTML;
        }
    }

    // 4. Event Listeners para Entradas
    const inputs = [sysDinheiro, sysPix, sysCartao, caixaDinheiroDia, caixaEnvelope, maqCredito, maqDebito, maqPix, manDinheiro, manPix, manCartao];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', atualizarConferencia);
    });

    if (caixaProximoDia) {
        caixaProximoDia.addEventListener('input', () => {
            userEditedProximoDia = true;
        });
    }

    // 5. Adicionar e Remover Sangrias
    if (addSangriaBtn && sangriasList) {
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
                atualizarConferencia();
            });

            div.querySelector('.sangria-val').addEventListener('input', atualizarConferencia);
        });
    }

    // 6. Adicionar e Remover Suprimentos
    if (addSuprimentoBtn && suprimentosList) {
        addSuprimentoBtn.addEventListener('click', () => {
            const div = document.createElement('div');
            div.className = 'suprimento-item';
            div.innerHTML = `
                <input type="number" step="0.01" placeholder="Valor do suprimento (R$)" class="suprimento-val">
                <button type="button" class="remove-suprimento">X</button>
            `;
            suprimentosList.appendChild(div);

            div.querySelector('.remove-suprimento').addEventListener('click', () => {
                div.remove();
                atualizarConferencia();
            });

            div.querySelector('.suprimento-val').addEventListener('input', atualizarConferencia);
        });
    }

    // 7. Envio do Relatório para o WhatsApp
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            const sDinheiro = parseFloat(sysDinheiro?.value) || 0;
            const sPix = parseFloat(sysPix?.value) || 0;
            const sCartao = parseFloat(sysCartao?.value) || 0;

            const cDinheiroDia = parseFloat(caixaDinheiroDia?.value) || 0;
            const cEnvelope = parseFloat(caixaEnvelope?.value) || 0;
            const cProximoDia = parseFloat(caixaProximoDia?.value) || 0;

            let totalSangrias = 0;
            let sangriasDesc = [];
            document.querySelectorAll('.sangria-val').forEach((input, index) => {
                const val = parseFloat(input.value) || 0;
                if (val > 0) {
                    totalSangrias += val;
                    sangriasDesc.push(`   - Sangria ${index + 1}: R$ ${val.toFixed(2)}`);
                }
            });

            let totalSuprimentos = 0;
            let suprimentosDesc = [];
            document.querySelectorAll('.suprimento-val').forEach((input, index) => {
                const val = parseFloat(input.value) || 0;
                if (val > 0) {
                    totalSuprimentos += val;
                    suprimentosDesc.push(`   - Suprimento ${index + 1}: R$ ${val.toFixed(2)}`);
                }
            });

            const mCredito = parseFloat(maqCredito?.value) || 0;
            const mDebito = parseFloat(maqDebito?.value) || 0;
            const mPix = parseFloat(maqPix?.value) || 0;

            const diffDinheiro = manDinheiro && manDinheiro.value !== '' ? parseFloat(manDinheiro.value) : (cDinheiroDia - sDinheiro);
            const diffPix = manPix && manPix.value !== '' ? parseFloat(manPix.value) : (mPix - sPix);
            const diffCartao = manCartao && manCartao.value !== '' ? parseFloat(manCartao.value) : ((mCredito + mDebito) - sCartao);

            let mensagem = `*XKMIX - FECHAMENTO DE CAIXA (PDP)*\n`;
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

            if (suprimentosDesc.length > 0) {
                mensagem += `• Suprimentos (Total: R$ ${totalSuprimentos.toFixed(2)}):\n` + suprimentosDesc.join('\n') + `\n`;
            } else {
                mensagem += `• Suprimentos: R$ 0.00\n`;
            }

            mensagem += `\n💳 *DADOS DAS MAQUINETAS:*\n`;
            mensagem += `• Crédito: R$ ${mCredito.toFixed(2)}\n`;
            mensagem += `• Débito: R$ ${mDebito.toFixed(2)}\n`;
            mensagem += `• PIX Maquinetas: R$ ${mPix.toFixed(2)}\n\n`;

            mensagem += `⚠ *CONFERÊNCIA (Diferenças):*\n`;
            mensagem += `• Dinheiro: ${Math.abs(diffDinheiro) < 0.01 ? 'Exato' : (diffDinheiro > 0 ? `Sobrou R$ ${diffDinheiro.toFixed(2)}` : `Faltou R$ ${Math.abs(diffDinheiro).toFixed(2)}`)}\n`;
            mensagem += `• PIX: ${Math.abs(diffPix) < 0.01 ? 'Exato' : (diffPix > 0 ? `Sobrou R$ ${diffPix.toFixed(2)}` : `Faltou R$ ${Math.abs(diffPix).toFixed(2)}`)}\n`;
            mensagem += `• Cartão: ${Math.abs(diffCartao) < 0.01 ? 'Exato' : (diffCartao > 0 ? `Sobrou R$ ${diffCartao.toFixed(2)}` : `Faltou R$ ${Math.abs(diffCartao).toFixed(2)}`)}\n`;

            if (obsText && obsText.value.trim()) {
                mensagem += `• Obs: ${obsText.value.trim()}\n`;
            }

            if (psText && psText.value.trim()) {
                mensagem += `\n📝 *PS / ANOTAÇÃO:* ${psText.value.trim()}\n`;
            }

            const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
            window.open(urlWhatsApp, '_blank');
        });
    }
});
