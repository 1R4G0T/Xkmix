document.addEventListener("DOMContentLoaded", () => {
    const btnWhatsapp = document.getElementById("btnWhatsapp");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnLimpar = document.getElementById("btnLimpar");
    const previousHistoryContent = document.getElementById("previousHistoryContent");
    const lastUpdated = document.getElementById("lastUpdated");

    // Chave para salvar no LocalStorage
    const STORAGE_KEY = "xkmix_estoque_anterior";

    // Carrega o histórico anterior ao abrir a página
    carregarHistoricoAnterior();

    // Evento de Enviar WhatsApp
    btnWhatsapp.addEventListener("click", () => {
        const dados = capturarDadosFormulario();
        
        if (dados.length === 0) {
            alert("Preencha ao menos um item do estoque antes de enviar!");
            return;
        }

        // Salva este lançamento como o histórico anterior
        salvarNoHistorico(dados);

        // Gera a mensagem formatada para WhatsApp
        const mensagem = gerarMensagemWhatsApp(dados);
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
        
        window.open(url, "_blank");
    });

    // Evento de Apenas Salvar
    btnSalvar.addEventListener("click", () => {
        const dados = capturarDadosFormulario();
        
        if (dados.length === 0) {
            alert("Preencha ao menos um item do estoque para salvar!");
            return;
        }

        salvarNoHistorico(dados);
        alert("Contagem salva com sucesso no histórico anterior!");
    });

    // Evento de Limpar Formulário
    btnLimpar.addEventListener("click", () => {
        if (confirm("Deseja realmente limpar todos os campos da contagem atual?")) {
            limparFormulario();
        }
    });

    // Função para pegar dados preenchidos
    function capturarDadosFormulario() {
        const inputs = document.querySelectorAll("#estoqueForm input[type='number']");
        const resultado = [];

        inputs.forEach(input => {
            const valor = parseInt(input.value) || 0;
            if (valor > 0) {
                resultado.push({
                    nome: input.getAttribute("data-name"),
                    qtd: valor
                });
            }
        });

        return resultado;
    }

    // Função para salvar no LocalStorage (substitui o histórico anterior)
    function salvarNoHistorico(dados) {
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const objetoHistorico = {
            data: dataFormatada,
            itens: dados
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(objetoHistorico));
        carregarHistoricoAnterior();
    }

    // Função para exibir o Histórico Anterior salvo
    function carregarHistoricoAnterior() {
        const salvo = localStorage.getItem(STORAGE_KEY);

        if (!salvo) {
            previousHistoryContent.innerHTML = '<p class="empty-msg">Nenhum histórico anterior salvo.</p>';
            lastUpdated.innerText = "Nenhum registro anterior";
            return;
        }

        const historico = JSON.parse(salvo);
        lastUpdated.innerText = `Data: ${historico.data}`;

        let html = "";
        historico.itens.forEach(item => {
            html += `
                <div class="history-item">
                    <span>${item.nome}</span>
                    <span class="val">${item.qtd} un</span>
                </div>
            `;
        });

        previousHistoryContent.innerHTML = html;
    }

    // Função para limpar os inputs
    function limparFormulario() {
        const inputs = document.querySelectorAll("#estoqueForm input[type='number']");
        inputs.forEach(input => input.value = "");
    }
});

// Gera o texto formatado da mensagem
function gerarMensagemWhatsApp(dados) {
    const agora = new Date();
    const dataHora = agora.toLocaleDateString('pt-BR') + ' - ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let texto = `📦 *CONTAGEM DE ESTOQUE - XKMIX (PDP)*\n`;
    texto += `📅 *Data:* ${dataHora}\n`;
    texto += `-----------------------------------\n\n`;

    dados.forEach(item => {
        texto += `• *${item.nome}:* ${item.qtd}\n`;
    });

    texto += `\n-----------------------------------`;
    return texto;
}
