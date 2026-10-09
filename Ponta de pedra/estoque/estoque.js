// Itens Padrão das Categorias Expansíveis
const itensPadrao = {
    hamburgueres: ["X-Picanha", "X-Burguer", "X-Maionese", "X-Barbecue", "X-Frango c/ Bacon"],
    bolo_pote: ["Bolo de Pote Brigadeiro", "Bolo de Pote Prestígio", "Bolo de Pote Red Velvet"],
    tortas: ["Torta Maracujá", "Torta Ninho c/ Nutella", "Torta Sensação"],
    bolos: ["Bolo Bem Casado"]
};

// Chaves de Armazenamento no LocalStorage
const STORAGE_KEY = "xkmix_estoque_anterior";
const STORAGE_CUSTOM_KEY = "xkmix_estoque_custom_v1";
const STORAGE_SORVETES_KEY = "xkmix_estoque_sorvetes_v1";

document.addEventListener("DOMContentLoaded", () => {
    const btnWhatsapp = document.getElementById("btnWhatsapp");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnLimpar = document.getElementById("btnLimpar");
    const previousHistoryContent = document.getElementById("previousHistoryContent");
    const lastUpdated = document.getElementById("lastUpdated");

    // Renderiza itens expansíveis e sorvetes ao carregar a página
    renderizarItensDinamicos();

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

        // Gera a mensagem formatada por categorias para WhatsApp
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

    // Função para capturar os dados preenchidos identificando a categoria principal
    function capturarDadosFormulario() {
        const inputs = document.querySelectorAll("#estoqueForm input[type='number']");
        const resultado = [];

        inputs.forEach(input => {
            const valor = parseInt(input.value) || 0;
            if (valor > 0) {
                let categoria = input.getAttribute("data-category");

                if (!categoria) {
                    const section = input.closest(".section-box");
                    if (section) {
                        const titleEl = section.querySelector(".category-title");
                        if (titleEl) {
                            categoria = titleEl.innerText.trim();
                        }
                    }
                }

                resultado.push({
                    categoria: categoria || "OUTROS",
                    nome: input.getAttribute("data-name") || "Item",
                    qtd: valor
                });
            }
        });

        return resultado;
    }

    // Função para salvar no LocalStorage
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

    // Função para exibir o Histórico Anterior agrupado por categoria na tela
    function carregarHistoricoAnterior() {
        const salvo = localStorage.getItem(STORAGE_KEY);

        if (!salvo) {
            previousHistoryContent.innerHTML = '<p class="empty-msg">Nenhum histórico anterior salvo.</p>';
            lastUpdated.innerText = "Nenhum registro anterior";
            return;
        }

        const historico = JSON.parse(salvo);
        lastUpdated.innerText = `Data: ${historico.data}`;

        const categorias = {};
        historico.itens.forEach(item => {
            const cat = item.categoria || "OUTROS";
            if (!categorias[cat]) categorias[cat] = [];
            categorias[cat].push(item);
        });

        let html = "";
        for (const [catNome, itens] of Object.entries(categorias)) {
            html += `<div style="color: #00ffcc; font-weight: bold; margin-top: 12px; margin-bottom: 4px; border-bottom: 1px dashed #00ffcc;">${catNome.toUpperCase()}</div>`;
            itens.forEach(item => {
                html += `
                    <div class="history-item">
                        <span>${item.nome}</span>
                        <span class="val">${item.qtd} un</span>
                    </div>
                `;
            });
        }

        previousHistoryContent.innerHTML = html;
    }

    // Função para limpar os inputs
    function limparFormulario() {
        const inputs = document.querySelectorAll("#estoqueForm input[type='number']");
        inputs.forEach(input => input.value = "");
    }
});

/* --- GERENCIAMENTO DE ITENS CUSTOMIZADOS PERMANENTES --- */
function obterCustomizados() {
    const salvo = localStorage.getItem(STORAGE_CUSTOM_KEY);
    return salvo ? JSON.parse(salvo) : { hamburgueres: [], bolo_pote: [], tortas: [], bolos: [] };
}

function adicionarItemCustomizado(categoria, inputId) {
    const input = document.getElementById(inputId);
    const valor = input.value.trim();

    if (!valor) {
        alert("Digite o nome do item a ser adicionado!");
        return;
    }

    const custom = obterCustomizados();
    if (!custom[categoria]) custom[categoria] = [];
    
    if (!custom[categoria].includes(valor)) {
        custom[categoria].push(valor);
        localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(custom));
    }

    input.value = "";
    renderizarItensDinamicos();
}

/* --- GERENCIAMENTO DE SORVETES (ADICIONAR E APAGAR) --- */
function obterSorvetes() {
    const salvo = localStorage.getItem(STORAGE_SORVETES_KEY);
    return salvo ? JSON.parse(salvo) : [];
}

function adicionarSorvete(inputId) {
    const input = document.getElementById(inputId);
    const valor = input.value.trim();

    if (!valor) {
        alert("Digite o sabor do sorvete!");
        return;
    }

    const sorvetes = obterSorvetes();
    if (!sorvetes.includes(valor)) {
        sorvetes.push(valor);
        localStorage.setItem(STORAGE_SORVETES_KEY, JSON.stringify(sorvetes));
    }

    input.value = "";
