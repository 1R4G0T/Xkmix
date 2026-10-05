// Lista de Itens Pré-Estabelecidos
const itensPadrao = {
    cremes: [
        "Cookies", "Avelã", "Avelã Essencial", "Paçoca", "Chocotrufa", 
        "Chocotine", "Oreo", "Coco", "Chiclete", "Leitinho", 
        "Leitinho Crocante", "Laka", "Pistache"
    ],
    fini: [
        "Minhoca", "Dentadura", "Amora", "Beijinho", "Banana"
    ],
    complementos: [
        "Granola", "Chocoball", "Powerball", "Paçoca", "Bis", "Canudo", 
        "Amendoim", "Leite em Pó", "Leite Condensado", "Jujuba", 
        "Barra de Chocolate Ovomaltine", "Barra de Chocolate Laka", 
        "Barra de Chocolate Oreo", "Biscoito Oreo", "Kitkat"
    ],
    descartaveis: [
        "Colheres de Self Service", "Colheres para Delivery", 
        "Bolsas/Sacolas (PPP)", "Bolsas/Sacolas (PP)", "Bolsas/Sacolas (P)", 
        "Bolsas/Sacolas (M)", "Bolsas/Sacolas (G)", "Bolsas/Sacolas (GG)", 
        "Kraft (PPP)", "Kraft (PP)", "Kraft (P)", "Kraft (M)", "Kraft (G)", "Kraft (GG)", 
        "Canudo para Milk Shake", "Canudo para Bebidas", 
        "Sachê Ketchup", "Sachê Maionese", "Sachê Mostarda", 
        "Guardanapos (Mesa)", "Guardanapos (Salgados)", "Papel Toalha", "Saco de Dudu"
    ],
    limpeza: [
        "Água Sanitária", "Detergente", "Desinfetante", "Papel Higiênico", 
        "Veja", "Multiuso", "Luva", "Touca"
    ],
    bebidas: [
        "Coca-Cola (Lata)", "Coca-Cola (250ml)", "Coca-Cola (500/600ml)", "Coca-Cola (1L)", 
        "Coca Zero (Lata)", "Coca Zero (250ml)", "Coca Zero (500/600ml)", "Coca Zero (1L)", 
        "Soda (Lata)", "Soda (250ml)", "Soda (1L)", 
        "Refri Laranja (Lata)", "Refri Laranja (250ml)", "Refri Laranja (1L)", 
        "Refri Guaraná (Lata)", "Refri Guaraná (250ml)", "Refri Guaraná (1L)", 
        "Monster", "H2OH!", "Água", "Água com Gás", 
        "Del Valle (Laranja)", "Del Valle (Uva)", "Pepsi (Lata)"
    ]
};

const STORAGE_KEY = "xkmix_pedidos_custom_v1";

document.addEventListener("DOMContentLoaded", () => {
    renderizarTodosOsItens();

    // Evento do Botão WhatsApp
    document.getElementById("btnWhatsapp").addEventListener("click", enviarPedidoWhatsApp);

    // Evento de Limpar/Desmarcar Todos
    document.getElementById("btnLimpar").addEventListener("click", () => {
        if (confirm("Deseja desmarcar todos os itens selecionados?")) {
            document.querySelectorAll("#pedidosForm input[type='checkbox']").forEach(cb => cb.checked = false);
            document.querySelectorAll("#pedidosForm input[type='text'].qtd-input").forEach(inp => inp.value = "");
        }
    });
});

// Carrega os itens salvos no LocalStorage
function obterItensCustomizados() {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : { cremes: [], fini: [], complementos: [], descartaveis: [], limpeza: [], bebidas: [] };
}

// Salva novos itens no LocalStorage para ficarem permanentes
function salvarItemCustomizado(categoria, novoNome) {
    const custom = obterItensCustomizados();
    if (!custom[categoria]) custom[categoria] = [];
    
    // Evita duplicados
    if (!custom[categoria].includes(novoNome)) {
        custom[categoria].push(novoNome);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    }
}

// Função executada ao clicar nos botões de adicionar item novo
function adicionarItemCustomizado(categoria, inputId) {
    const input = document.getElementById(inputId);
    const valor = input.value.trim();

    if (!valor) {
        alert("Digite o nome do item a ser adicionado!");
        return;
    }

    salvarItemCustomizado(categoria, valor);
    input.value = "";
    renderizarTodosOsItens();
}

// Renderiza a lista combinando os itens padrão + customizados permanentes
function renderizarTodosOsItens() {
    const custom = obterItensCustomizados();
    const categorias = ["cremes", "fini", "complementos", "descartaveis", "limpeza", "bebidas"];

    categorias.forEach(cat => {
        const container = document.getElementById(`container-${cat}`);
        if (!container) return;

        // Combina lista padrão com novos criados pelo usuário
        const listaCompleta = [...itensPadrao[cat], ...(custom[cat] || [])];
        
        // Preserva as seleções atuais antes de re-renderizar
        const selecionados = {};
        container.querySelectorAll(".item-card").forEach(card => {
            const cb = card.querySelector("input[type='checkbox']");
            const qtd = card.querySelector(".qtd-input");
            if (cb && cb.checked) {
                selecionados[cb.value] = qtd ? qtd.value : "";
            }
        });

        let html = "";
        listaCompleta.forEach((item, index) => {
            const idCheckbox = `item_${cat}_${index}`;
            const isChecked = selecionados[item] !== undefined ? "checked" : "";
            const valorQtd = selecionados[item] || "";

            html += `
                <div class="item-card">
                    <input type="checkbox" id="${idCheckbox}" value="${item}" ${isChecked}>
                    <label for="${idCheckbox}">${item}</label>
                    <input type="text" class="qtd-input" placeholder="Qtd" value="${valorQtd}">
                </div>
            `;
        });

        container.innerHTML = html;
    });
}

// Gera a mensagem formatada e abre o WhatsApp
function enviarPedidoWhatsApp() {
    const categorias = [
        { key: "cremes", titulo: "🍦 CREMES" },
        { key: "fini", titulo: "🍬 BALAS FINI" },
        { key: "complementos", titulo: "🍿 COMPLEMENTOS" },
        { key: "descartaveis", titulo: "🥤 DESCARTÁVEIS" },
        { key: "limpeza", titulo: "🧹 LIMPEZA" },
        { key: "bebidas", titulo: "🥤 BEBIDAS" }
    ];

    const agora = new Date();
    const dataHora = agora.toLocaleDateString('pt-BR') + ' - ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let texto = `📋 *PEDIDO DE INSUMOS - XKMIX*\n`;
    texto += `📅 *Data:* ${dataHora}\n`;
    texto += `-----------------------------------\n\n`;

    let algumItemSelecionado = false;

    categorias.forEach(cat => {
        const container = document.getElementById(`container-${cat.key}`);
        if (!container) return;

        const cards = container.querySelectorAll(".item-card");
        let itensCategoriaText = "";

        cards.forEach(card => {
            const cb = card.querySelector("input[type='checkbox']");
            const qtdInput = card.querySelector(".qtd-input");

            if (cb && cb.checked) {
                algumItemSelecionado = true;
                const qtdVal = qtdInput && qtdInput.value.trim() ? ` (${qtdInput.value.trim()})` : "";
                itensCategoriaText += `• ${cb.value}${qtdVal}\n`;
            }
        });

        if (itensCategoriaText) {
            texto += `*${cat.titulo}:*\n${itensCategoriaText}\n`;
        }
    });

    texto += `-----------------------------------`;

    if (!algumItemSelecionado) {
        alert("Selecione ao menos um item para enviar o pedido!");
        return;
    }

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
}
