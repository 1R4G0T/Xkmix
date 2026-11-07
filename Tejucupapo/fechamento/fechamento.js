document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. LÓGICA DO MODO COMPLETO
    // ----------------------------------------------------
    const sysDinheiro = document.getElementById('sysDinheiro');
    const sysPix = document.getElementById('sysPix');
    const sysCartao = document.getElementById('sysCartao');

    const caixaDinheiroDia = document.getElementById('caixaDinheiroDia');
    const caixaPix = document.getElementById('caixaPix');
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

    function autoPreencherProximoDia() {
        if (userEditedProximoDia) return;
        const totalDia = parseFloat(caixaDinheiroDia?.value) || 0;
        const envelope = parseFloat(caixaEnvelope?.value) || 0;
        const restante = totalDia - envelope;
        if (caixaProximoDia) {
            caixaProximoDia.value = restante >= 0 ? restante.toFixed(2) : '0.00';
        }
    }

    function atualizarConferencia() {
        autoPreencherProximoDia();
        if (!diffAlertBox) return;

        const sDinheiro = parseFloat(sysDinheiro?.value) || 0;
        const sPix = parseFloat(sysPix?.value) || 0;
        const sCartao = parseFloat(sysCartao?.value) || 0;

        const cDinheiroDia = parseFloat(caixaDinheiroDia?.value) || 0;
        const cPix = parseFloat(caixaPix?.value) || 0;

        const mCredito = parseFloat(maqCredito?.value) || 0;
        const mDebito = parseFloat(maqDebito?.value) || 0;
        const mPix = parseFloat(maqPix?.value) || 0;

        const totalPixInformado = cPix + mPix;

        let diffDinheiro = manDinheiro && manDinheiro.value !== '' ? parseFloat(manDinheiro.value) : (cDinheiroDia - sDinheiro);
        let diffPix = manPix && manPix.value !== '' ? parseFloat(manPix.value) : (totalPixInformado - sPix);
        let diffCartao = manCartao && manCartao.value !== '' ? parseFloat(manCartao.value) : ((mCredito + mDebito) - sCartao);

        const temDados = sDinheiro > 0 || sPix > 0 || sCartao > 0 || cDinheiroDia > 0 || cPix > 0 || (mCredito + mDebito + mPix) > 0;

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

    const inputs = [sysDinheiro, sysPix, sysCartao, caixaDinheiroDia, caixaPix, caixaEnvelope, maqCredito, maqDebito, maqPix, manDinheiro, manPix, manCartao];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', atualizarConferencia);
    });

    if (caixaProximoDia) {
        caixaProximoDia.addEventListener('input', () => { userEditedProximoDia = true; });
    }

    if (addSangriaBtn && sangriasList) {
        addSangriaBtn.addEventListener('click', () => {
            const div = document.createElement('div');
            div.className = 'sangria-item';
            div.innerHTML = `
                <input type="text" placeholder="Descrição / Motivo" class="sangria-desc">
                <input type="number" step="0.01" placeholder="Valor (R$)" class="sangria-val">
                <button type="button" class="remove-sangria">X</button>
            `;
            sangriasList.appendChild(div);
            div.querySelector('.remove-sangria').addEventListener('click', () => { div.remove(); atualizarConferencia(); });
            div.querySelector('.sangria-val').addEventListener('input', atualizarConferencia);
        });
    }

    if (addSuprimentoBtn && suprimentosList) {
        addSuprimentoBtn.addEventListener('click', () => {
            const div = document.createElement('div');
            div.className = 'suprimento-item';
            div.innerHTML = `
                <input type="text" placeholder="Descrição / Motivo" class="suprimento-desc">
                <input type="number" step="0.01" placeholder="Valor (R$)" class="suprimento-val">
                <button type="button" class="remove-suprimento">X</button>
            `;
            suprimentosList.appendChild(div);
            div.querySelector('.remove-suprimento').addEventListener('click', () => { div.remove(); atualizarConferencia(); });
            div.querySelector('.suprimento-val').addEventListener('input', atualizarConferencia);
        });
    }

    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            const sDinheiro = parseFloat(sysDinheiro?.value) || 0;
            const sPix = parseFloat(sysPix?.value) || 0;
            const sCartao = parseFloat(sysCartao?.value) || 0;

            const cDinheiroDia = parseFloat(caixaDinheiroDia?.value) || 0;
            const cPix = parseFloat(caixaPix?.value) || 0;
            const cEnvelope = parseFloat(caixaEnvelope?.value) || 0;
            const cProximoDia = parseFloat(caixaProximoDia?.value) || 0;

            let totalSangrias = 0;
            let sangriasDesc = [];
            document.querySelectorAll('.sangria-item').forEach((item, index) => {
                const desc = item.querySelector('.sangria-desc')?.value.trim() || `Sangria ${index + 1}`;
                const val = parseFloat(item.querySelector('.sangria-val')?.value) || 0;
                if (val > 0 || desc) {
                    totalSangrias += val;
                    sangriasDesc.push(`   - ${desc}: R$ ${val.toFixed(2)}`);
                }
            });

            let totalSuprimentos = 0;
            let suprimentosDesc = [];
            document.querySelectorAll('.suprimento-item').forEach((item, index) => {
                const desc = item.querySelector('.suprimento-desc')?.value.trim() || `Suprimento ${index + 1}`;
                const val = parseFloat(item.querySelector('.suprimento-val')?.value) || 0;
                if (val > 0 || desc) {
                    totalSuprimentos += val;
                    suprimentosDesc.push(`   - ${desc}: R$ ${val.toFixed(2)}`);
                }
            });

            const mCredito = parseFloat(maqCredito?.value) || 0;
            const mDebito = parseFloat(maqDebito?.value) || 0;
            const mPix = parseFloat(maqPix?.value) || 0;
            const totalPixInf = cPix + mPix;

            const diffDinheiro = manDinheiro && manDinheiro.value !== '' ? parseFloat(manDinheiro.value) : (cDinheiroDia - sDinheiro);
            const diffPix = manPix && manPix.value !== '' ? parseFloat(manPix.value) : (totalPixInf - sPix);
            const diffCartao = manCartao && manCartao.value !== '' ? parseFloat(manCartao.value) : ((mCredito + mDebito) - sCartao);

            let mensagem = `*XKMIX - FECHAMENTO DE CAIXA (Tejucupapo)*\n`;
            mensagem += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`;
            mensagem += `📊 *DADOS DO SISTEMA:*\n`;
            mensagem += `• Dinheiro: R$ ${sDinheiro.toFixed(2)}\n`;
            mensagem += `• PIX: R$ ${sPix.toFixed(2)}\n`;
            mensagem += `• Cartão: R$ ${sCartao.toFixed(2)}\n\n`;
            mensagem += `💵 *DADOS DO CAIXA:*\n`;
            mensagem += `• Total Dinheiro do Dia: R$ ${cDinheiroDia.toFixed(2)}\n`;
            mensagem += `• Total PIX no Caixa: R$ ${cPix.toFixed(2)}\n`;
            mensagem += `• Dinheiro no Envelope: R$ ${cEnvelope.toFixed(2)}\n`;
            mensagem += `• Caixa Dia Seguinte: R$ ${cProximoDia.toFixed(2)}\n`;
            
            if (sangriasDesc.length > 0) {
                mensagem += `• Sangrias (Registro - Total: R$ ${totalSangrias.toFixed(2)}):\n` + sangriasDesc.join('\n') + `\n`;
            } else {
                mensagem += `• Sangrias: R$ 0.00\n`;
            }

            if (suprimentosDesc.length > 0) {
                mensagem += `• Suprimentos (Registro - Total: R$ ${totalSuprimentos.toFixed(2)}):\n` + suprimentosDesc.join('\n') + `\n`;
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

            if (obsText && obsText.value.trim()) mensagem += `• Obs: ${obsText.value.trim()}\n`;
            if (psText && psText.value.trim()) mensagem += `\n📝 *PS / ANOTAÇÃO:* ${psText.value.trim()}\n`;

            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`, '_blank');
        });
    }

    // ----------------------------------------------------
    // 2. LÓGICA DO MODO SIMPLES
    // ----------------------------------------------------
    const simpSysTotal = document.getElementById('simpSysTotal');
    const simpInicio = document.getElementById('simpInicio');
    const simpTotalCaixa = document.getElementById('simpTotalCaixa');
    const simpEnvelope = document.getElementById('simpEnvelope');
    const simpProximoVal = document.getElementById('simpProximoVal');
    const simpProximoData = document.getElementById('simpProximoData');
    const simpObs = document.getElementById('simpObs');
    const diffAlertBoxSimp = document.getElementById('diffAlertBoxSimp');
    const sendWhatsappSimp = document.getElementById('sendWhatsappSimp');
    
    const sangriasListSimp = document.getElementById('sangriasListSimp');
    const addSangriaSimpBtn = document.getElementById('addSangriaSimpBtn');

    if (addSangriaSimpBtn && sangriasListSimp) {
        addSangriaSimpBtn.addEventListener('click', () => {
            const div = document.createElement('div');
            div.className = 'dynamic-row';
            div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center;';
            div.innerHTML = `
                <input type="text" class="sangria-desc" placeholder="Descrição..." style="flex: 2; background: #000; border: 1px solid #ff0055; color: #fff; font-family: 'VT323', monospace; padding: 6px; border-radius: 4px;">
                <input type="number" class="sangria-val" step="0.01" placeholder="R$" style="flex: 1; background: #000; border: 1px solid #ff0055; color: #00ffcc; font-family: 'Orbitron', sans-serif; padding: 6px; text-align: center; border-radius: 4px;">
                <button type="button" class="btn-remove-row" style="background: #ff0055; color: #fff; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; font-weight: bold;">X</button>
            `;
            div.querySelector('.btn-remove-row').addEventListener('click', () => { div.remove(); calcularSimples(); });
            div.querySelectorAll('input').forEach(inp => inp.addEventListener('input', calcularSimples));
            sangriasListSimp.appendChild(div);
        });
    }

    [simpSysTotal, simpInicio, simpTotalCaixa, simpEnvelope].forEach(inp => {
        if (inp) inp.addEventListener('input', calcularSimples);
    });

    function calcularSimples() {
        if (!diffAlertBoxSimp) return 0;
        const sys = parseFloat(simpSysTotal?.value) || 0;
        const inicio = parseFloat(simpInicio?.value) || 0;
        const caixa = parseFloat(simpTotalCaixa?.value) || 0;

        let totalSangrias = 0;
        sangriasListSimp?.querySelectorAll('.sangria-val').forEach(v => {
            totalSangrias += parseFloat(v.value) || 0;
        });

        const esperado = inicio + sys - totalSangrias;
        const diferenca = caixa - esperado;

        if (sys === 0 && caixa === 0) {
            diffAlertBoxSimp.className = 'diff-box neutral';
            diffAlertBoxSimp.innerText = 'Preencha os valores para calcular a sobra ou falta.';
            return diferenca;
        }

        if (Math.abs(diferenca) < 0.01) {
            diffAlertBoxSimp.className = 'diff-box ok';
            diffAlertBoxSimp.style.color = '#00ffcc';
            diffAlertBoxSimp.innerText = '✅ Caixa fechado exato! Sem sobras nem faltas.';
        } else if (diferenca > 0) {
            diffAlertBoxSimp.className = 'diff-box over';
            diffAlertBoxSimp.style.color = '#25d366';
            diffAlertBoxSimp.innerText = `📈 Sobrou: R$ ${diferenca.toFixed(2)}`;
        } else {
            diffAlertBoxSimp.className = 'diff-box under';
            diffAlertBoxSimp.style.color = '#ff0055';
            diffAlertBoxSimp.innerText = `📉 Faltou: R$ ${Math.abs(diferenca).toFixed(2)}`;
        }
        return diferenca;
    }

    if (sendWhatsappSimp) {
        sendWhatsappSimp.addEventListener('click', () => {
            const sys = parseFloat(simpSysTotal?.value) || 0;
            const inicio = parseFloat(simpInicio?.value) || 0;
            const caixa = parseFloat(simpTotalCaixa?.value) || 0;
            const envelope = parseFloat(simpEnvelope?.value) || 0;
            const proximoVal = parseFloat(simpProximoVal?.value) || 0;
            const proximoData = simpProximoData?.value.trim() || 'Não informada';
            const obs = simpObs?.value.trim();

            let sangriasTexto = '';
            let totalSangrias = 0;
            const rows = sangriasListSimp?.querySelectorAll('.dynamic-row') || [];
            if (rows.length > 0) {
                sangriasTexto = '\n*Sangrias:*\n';
                rows.forEach(r => {
                    const desc = r.querySelector('.sangria-desc')?.value.trim() || 'Retirada';
                    const val = parseFloat(r.querySelector('.sangria-val')?.value) || 0;
                    totalSangrias += val;
                    sangriasTexto += `• ${desc}: R$ ${val.toFixed(2)}\n`;
                });
            }

            const diferenca = calcularSimples();
            let statusDif = Math.abs(diferenca) < 0.01 ? 'Exato (R$ 0,00)' : (diferenca > 0 ? `Sobrou R$ ${diferenca.toFixed(2)}` : `Faltou R$ ${Math.abs(diferenca).toFixed(2)}`);

            let msg = `💵 *FECHAMENTO DE CAIXA (DINHEIRO)*\n`;
            msg += `-----------------------------------\n`;
            msg += `• *Total no sistema:* R$ ${sys.toFixed(2)}\n`;
            msg += `• *Inicio:* R$ ${inicio.toFixed(2)}\n`;
            msg += `• *Total no caixa:* R$ ${caixa.toFixed(2)}\n`;
            msg += `• *Envelope:* R$ ${envelope.toFixed(2)}\n`;
            msg += `• *Caixa do dia seguinte:* R$ ${proximoVal.toFixed(2)} (${proximoData})\n`;
            
            if (sangriasTexto) {
                msg += sangriasTexto;
                msg += `_Total Sangrias:_ R$ ${totalSangrias.toFixed(2)}\n`;
            } else {
                msg += `• *Sangrias:* Nenhuma\n`;
            }
            
            msg += `• *Quanto passou ou quanto sobrou:* ${statusDif}\n`;
            if (obs) msg += `• *Obs:* ${obs}\n`;
            msg += `-----------------------------------`;

            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }
});
