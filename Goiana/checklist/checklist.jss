document.addEventListener("DOMContentLoaded", () => {
    const turnButtons = document.querySelectorAll(".turn-btn");
    const sections = document.querySelectorAll(".checklist-section");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressText = document.getElementById("progressText");
    const activeListTitle = document.getElementById("activeListTitle");
    const sendWhatsappBtn = document.getElementById("sendWhatsapp");
    const responsavelInput = document.getElementById("responsavel");

    // Carrega tarefas customizadas e estados salvos anteriormente
    carregarTarefasCustomizadas();

    // Alternar entre abas de turnos e setores
    turnButtons.forEach(button => {
        button.addEventListener("click", () => {
            turnButtons.forEach(btn => btn.classList.remove("active"));
            sections.forEach(sec => sec.classList.remove("active-section"));

            button.classList.add("active");
            const targetId = button.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add("active-section");
                activeListTitle.innerText = `PROGRESSO: ${button.innerText.replace(/^[☀️🌙]\s*/, '')}`;
                atualizarProgresso();
            }
        });
    });

    // Atualizar progresso e salvar sempre que um checkbox for alterado
    document.addEventListener("change", (e) => {
        if (e.target.classList.contains("check-task")) {
            atualizarProgresso();
            salvarTarefasCustomizadas();
        }
    });

    // Atualiza o progresso inicial ao carregar a página
    atualizarProgresso();

    // Evento para Enviar para o WhatsApp
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener("click", () => {
            const responsavel = responsavelInput.value.trim();
            if (!responsavel) {
                alert("Por favor, digite o nome do responsável antes de enviar!");
                responsavelInput.focus();
                return;
            }

            const mensagem = gerarMensagemWhatsApp(responsavel);
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
            window.open(url, "_blank");
        });
    }
});

/* --- ATUALIZAR BARRA DE PROGRESSO --- */
function atualizarProgresso() {
    const activeSection = document.querySelector(".checklist-section.active-section");
    if (!activeSection) return;

    const checkboxes = activeSection.querySelectorAll(".check-task");
    const total = checkboxes.length;
    let concluidas = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) concluidas++;
    });

    const porcentagem = total === 0 ? 0 : Math.round((concluidas / total) * 100);
    
    const progressBarFill = document.getElementById("progressBarFill");
    const progressText = document.getElementById("progressText");

    if (progressBarFill) progressBarFill.style.width = `${porcentagem}%`;
    if (progressText) progressText.innerText = `${porcentagem}% (${concluidas} / ${total})`;
}

/* --- ADICIONAR NOVA TAREFA --- */
function adicionarTarefa(sectionId, inputId) {
    const input = document.getElementById(inputId);
    const texto = input.value.trim();

    if (!texto) {
        alert("Digite o nome da nova tarefa!");
        return;
    }

    const section = document.getElementById(sectionId);
    const container = section.querySelector(".checklist-container");

    const label = document.createElement("label");
    label.classList.add("checklist-item");
    label.innerHTML = `
        <input type="checkbox" class="check-task"> ${texto} 
        <button type="button" class="btn-delete-task" onclick="removerTarefa(this)">X</button>
    `;

    container.appendChild(label);
    input.value = "";

    salvarTarefasCustomizadas();
    atualizarProgresso();
}

/* --- REMOVER TAREFA --- */
function removerTarefa(botao) {
    if (confirm("Deseja realmente remover esta tarefa?")) {
        const item = botao.closest(".checklist-item");
        item.remove();
        salvarTarefasCustomizadas();
        atualizarProgresso();
    }
}

/* --- PERSISTÊNCIA NO LOCALSTORAGE --- */
function salvarTarefasCustomizadas() {
    const dadosSections = {};
    document.querySelectorAll(".checklist-section").forEach(sec => {
        const id = sec.id;
        const itens = [];
        sec.querySelectorAll(".checklist-container .checklist-item").forEach(item => {
            // Pega o texto da tarefa ignorando o botão 'X'
            const texto = item.childNodes[2] ? item.childNodes[2].textContent.trim() : item.innerText.replace("X", "").trim();
            const checked = item.querySelector("input[type='checkbox']").checked;
            itens.push({ texto, checked });
        });
        dadosSections[id] = itens;
    });

    localStorage.setItem("xkmix_checklist_structure_v3", JSON.stringify(dadosSections));
}

function carregarTarefasCustomizadas() {
    const salvo = localStorage.getItem("xkmix_checklist_structure_v3");
    if (!salvo) return;

    try {
        const dadosSections = JSON.parse(salvo);
        for (const [sectionId, itens] of Object.entries(dadosSections)) {
            const section = document.getElementById(sectionId);
            if (!section) continue;
            const container = section.querySelector(".checklist-container");
            if (!container) continue;
            
            container.innerHTML = "";
            itens.forEach(itemData => {
                const label = document.createElement("label");
                label.classList.add("checklist-item");
                label.innerHTML = `
                    <input type="checkbox" class="check-task" ${itemData.checked ? "checked" : ""}> ${itemData.texto} 
                    <button type="button" class="btn-delete-task" onclick="removerTarefa(this)">X</button>
                `;
                container.appendChild(label);
            });
        }
    } catch (e) {
        console.error("Erro ao carregar dados salvos do checklist", e);
    }
}

/* --- GERAR MENSAGEM PARA O WHATSAPP --- */
function gerarMensagemWhatsApp(responsavel) {
    const agora = new Date();
    const dataHora = agora.toLocaleDateString('pt-BR') + ' - ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let texto = `📋 *CHECK-LIST OPERACIONAL - XKMIX (GN)*\n`;
    texto += `👤 *Responsável:* ${responsavel}\n`;
    texto += `📅 *Data/Hora:* ${dataHora}\n`;
    texto += `-----------------------------------\n\n`;

    const titulosSecoes = {
        "abertura-salao": "☀️ ABERTURA - SALÃO",
        "abertura-recepcao": "☀️ ABERTURA - RECEPÇÃO / CAIXA",
        "abertura-cozinha": "☀️ ABERTURA - COZINHA",
        "fechamento-salao": "🌙 FECHAMENTO - SALÃO",
        "fechamento-recepcao": "🌙 FECHAMENTO - RECEPÇÃO / CAIXA",
        "fechamento-cozinha": "🌙 FECHAMENTO - COZINHA"
    };

    document.querySelectorAll(".checklist-section").forEach(sec => {
        const id = sec.id;
        const titulo = titulosSecoes[id] || "SETOR";
        const itens = sec.querySelectorAll(".checklist-item");

        if (itens.length > 0) {
            texto += `*${titulo}*\n`;
            let concluidasSetor = 0;

            itens.forEach(item => {
                const checkbox = item.querySelector("input[type='checkbox']");
                const textoTarefa = item.childNodes[2] ? item.childNodes[2].textContent.trim() : item.innerText.replace("X", "").trim();
                const status = checkbox.checked ? "✅" : "❌";
                
                if (checkbox.checked) concluidasSetor++;
                texto += `${status} ${textoTarefa}\n`;
            });

            texto += `_Progresso: ${concluidasSetor}/${itens.length}_\n\n`;
        }
    });

    texto += `-----------------------------------`;
    return texto;
}
