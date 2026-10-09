// Chaves de Armazenamento no LocalStorage
const STORAGE_KEY = "xkmix_estoque_anterior";
const STORAGE_CUSTOM_KEY = "xkmix_estoque_custom_v4";
const STORAGE_SORVETES_KEY = "xkmix_estoque_sorvetes_v1";

document.addEventListener("DOMContentLoaded", () => {
    const btnWhatsapp = document.getElementById("btnWhatsapp");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnLimpar = document.getElementById("btnLimpar");
    const btnCarregarHistorico = document.getElementById("btnCarregarHistorico");

    // Renderiza apenas os itens extras adicionados pelo usuário e os sorvetes
    renderizarItensCustomizados();

    // Carrega o histórico anterior registrado na tela
    carregarHistoricoAnterior();

    // Evento para preencher o formulário com a contagem anterior
    if (btnCarregarHistorico) {
        btnCarregarHistorico.addEventListener("click", recarregarHistoricoParaFormulario);
    }

    // Evento de Enviar WhatsApp
    btnWhatsapp.addEventListener("click", () => {
        const dados = capturarDadosFormulario();
        
        if (dados.length === 0) {
            alert("Preencha ao menos um item do estoque antes de enviar!");
            return;
        }

        salvarNoHistorico(dados);
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
});

/* --- PREENCHE O FORMULÁRIO COM O HISTÓRICO SALVO --- */
function recarregarHistoricoParaFormulario() {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) {
        alert("Nenhum histórico anterior salvo para carregar!");
        return;
    }

    const historico = JSON.parse(salvo);
    if (!historico.itens || historico.itens.length === 0) {
        alert("O histórico registrado está vazio!");
        return;
    }

    // Garante que os containers dinâmicos já estão montados
    renderizarItensCustomizados();

    // Limpa o formulário antes de aplicar a contagem antiga
    limparFormulario();

    const mapaHistorico = {};
    historico.itens.forEach(item => {
        mapaHistorico[item.nome] = item.qtd;
    });

    let carregados = 0;
    const inputs = document.querySelectorAll("#estoqueForm input[type='number']");

    inputs.forEach(input => {
        const nomeItem = input.getAttribute("data-name");
        if (nomeItem && mapaHistorico[nomeItem] !== undefined) {
            input.value = mapaHistorico[nomeItem];
            carregados++;
        }
    });

    alert(`✅ Importado! ${carregados} itens da última contagem foram preenchidos no formulário.\nAltere apenas o que for necessário e salve novamente.`);
}

/* --- GERENCIAMENTO DE ITENS CUSTOMIZADOS PERMANENTES --- */
function obterCustomizados() {
    const salvo = localStorage.getItem(STORAGE_CUSTOM_KEY);
    return salvo ? JSON.parse(salvo) : { hamburgueres: [], gelados: [], bolo_pote: [], tortas: [], bolos: [] };
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
    
    // Formatação de acordo com o que é
    let label = valor;
    let name = valor;

    if (categoria === "bolo_pote") {
        label = valor.replace(/^bolo de pote\s*/i, ''); // Tira o prefixo se a pessoa digitar pra não ficar feio
        name = valor.toLowerCase().startsWith("bolo de pote") ? valor : `Bolo de Pote ${valor}`;
    } else if (categoria === "tortas") {
        label = valor.replace(/^torta\s*/i, '');
        name = valor.toLowerCase().startsWith("torta") ? valor : `Torta ${valor}`;
    } else if (categoria === "bolos") {
        label = valor.replace(/^bolo\s*/i, '');
        name = valor.toLowerCase().startsWith("bolo") ? valor : `Bolo ${valor}`;
    } else if (categoria === "hamburgueres" && !valor.toUpperCase().startsWith("X-")) {
        // Se a pessoa adicionar um hambúrguer, garantir que não vai ficar só "Bacon"
        name = valor; 
    }

    const itemObj = { label, name };

    // Evita duplicados na lista personalizada
    const existe = custom[categoria].some(i => i.name.toLowerCase() === itemObj.name.toLowerCase());
    if (!existe) {
        custom[categoria].push(itemObj);
        localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(custom));
    }

    input.value = "";
    renderizarItensCustomizados();
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
    const saborFormatado = valor.replace(/^sorvete (de )?/i, ''); // Limpa se o cara digitar "Sorvete de Morango"

    if (!sorvetes.includes(saborFormatado)) {
        sorvetes.push(saborFormatado);
        localStorage.setItem(STORAGE_SORVETES_KEY, JSON.stringify(sorvetes));
    }

    input.value = "";
    renderizarItensCustomizados();
}

function removerSorvete(nome) {
    if (confirm(`Deseja remover o sorvete "${nome}" da lista?`)) {
        let sorvetes = obterSorvetes();
        sorvetes = sorvetes.filter(s => s !== nome);
        localStorage.setItem(STORAGE_SORVETES_KEY, JSON.stringify(sorvetes));
        renderizarItensCustomizados();
    }
}


/* --- RENDERIZA APENAS OS ITENS NOVOS --- */
function renderizarItensCustomizados() {
    const custom = obterCustomizados();

    const configs = [
        { key: "hamburgueres", containerId: "custom-hamburgueres", prefix: "burguer_cust" },
        { key: "gelados", containerId: "custom-gelados", prefix: "gelado_cust" },
        { key: "bolo_pote", containerId: "custom-bolo-pote", prefix: "pote_cust" },
        { key: "tortas", containerId: "custom-tortas", prefix: "torta_cust" },
        { key: "bolos", containerId: "custom-bolos", prefix: "bolo_cust" }
    ];

    configs.forEach(cfg => {
        const container = document.getElementById(cfg.containerId);
        if (!container) return;

        const listaNovos = custom[cfg.key] || [];
        
        // Preserva valores digitados nas divs customizadas
        const valoresAtuais = {};
        container.querySelectorAll("input[type='number']").forEach(inp => {
            if (inp.value) valoresAtuais[inp.getAttribute("data-name")] = inp.value;
        });

        let html = "";
        listaNovos.forEach((itemObj, idx) => {
            const inputId = `${cfg.prefix}_${idx}`;
            const val = valoresAtuais[itemObj.name] || "";

            html += `
                <div class="item-card">
                    <label for="${inputId}">${itemObj.label}</label>
                    <input type="number" id="${inputId}" data-name="${itemObj.name}" min="0" placeholder="0" value="${val}">
                </div>
            `;
        });

        container.innerHTML = html;
    });

    // Renderiza Sorvetes
    const containerSorvetes = document.getElementById("container-sorvetes");
    if (containerSorvetes) {
        const sorvetes = obterSorvetes();
        const valoresSorvete = {};
        containerSorvetes.querySelectorAll("input[type='number']").forEach(inp => {
            if (inp.value) valoresSorvete[inp.getAttribute("data-name")] = inp.value;
        });

        let htmlSorvetes = "";
        sorvetes.forEach((sabor, idx) => {
            const inputId = `sorvete_${idx}`;
            const fullName = `Sorvete de ${sabor}`;
            const val = valoresSorvete[fullName] || "";

            htmlSorvetes += `
                <div class="item-card">
                    <button type="button" class="btn-delete-item" onclick="removerSorvete('${sabor}')" title="Excluir Sorvete">X</button>
                    <label for="${inputId}">Sorvete ${sabor}</label>
                    <input type="number" id="${inputId}" data-name="${fullName}" min="0" placeholder="0" value="${val}">
                </div>
            `;
        });

        if (sorvetes.length === 0) {
            htmlSorvetes = '<p style="color: #666; font-style: italic; grid-column: 1 / -1;">Nenhum sorvete cadastrado.</p>';
        }

        containerSorvetes.innerHTML = htmlSorvetes;
    }
}


/* --- CAPTURA DE DADOS E HISTÓRICO --- */
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

function carregarHistoricoAnterior() {
    const previousHistoryContent = document.getElementById("previousHistoryContent");
    const lastUpdated = document.getElementById("lastUpdated");
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
        html += `
            <div class="history-category-group">
                <div class="history-cat-title">${catNome.toUpperCase()}</div>
                <div class="history-grid">
        `;
        
        itens.forEach(item => {
            html += `
                <div class="history-item">
                    <span>${item.nome}</span>
                    <span class="val">${item.qtd} un</span>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    previousHistoryContent.innerHTML = html;
}

function limparFormulario() {
    const inputs = document.querySelectorAll("#estoqueForm input[type='number']");
    inputs.forEach(input => input.value = "");
}

function gerarMensagemWhatsApp(dados) {
    const agora = new Date();
    const dataHora = agora.toLocaleDateString('pt-BR') + ' - ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let texto = `📦 *CONTAGEM DE ESTOQUE - XKMIX (PDP)*\n`;
    texto += `📅 *Data:* ${dataHora}\n`;
    texto += `-----------------------------------\n\n`;

    const categorias = {};
    dados.forEach(item => {
        const cat = item.categoria || "OUTROS";
        if (!categorias[cat]) {
            categorias[cat] = [];
        }
        categorias[cat].push(item);
    });

    for (const [catNome, itens] of Object.entries(categorias)) {
        texto += `*${catNome.toUpperCase()}:*\n`;
        itens.forEach(item => {
            texto += `• *${item.nome}:* ${item.qtd}\n`;
        });
        texto += `\n`;
    }

    texto += `-----------------------------------`;
    return texto;
}
