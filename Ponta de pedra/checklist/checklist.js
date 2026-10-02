document.addEventListener('DOMContentLoaded', () => {
    const turnButtons = document.querySelectorAll('.turn-btn');
    const sections = document.querySelectorAll('.checklist-section');
    const activeListTitle = document.getElementById('activeListTitle');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressText');
    const responsavelInput = document.getElementById('responsavel');
    const sendWhatsappBtn = document.getElementById('sendWhatsapp');

    // Função para atualizar a barra de progresso da secção ativa
    function updateProgress() {
        const activeSection = document.querySelector('.checklist-section.active-section');
        if (!activeSection) return;

        const checkboxes = activeSection.querySelectorAll('.check-task');
        const checkedCount = activeSection.querySelectorAll('.check-task:checked').length;
        const totalCount = checkboxes.length;

        const percentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

        progressBarFill.style.width = percentage + '%';
        progressText.textContent = `${percentage}% (${checkedCount} / ${totalCount})`;
    }

    // Trocar de turno/setor ao clicar nos botões do topo
    turnButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todos os botões e secções
            turnButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));

            // Ativa o botão clicado
            btn.classList.add('active');

            // Mostra a secção correspondente
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
                activeListTitle.textContent = `PROGRESSO: ${btn.textContent.trim()}`;
            }

            updateProgress();
        });
    });

    // Atualizar o progresso sempre que clicar numa checkbox
    document.querySelectorAll('.check-task').forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });

    // Executar cálculo inicial
    updateProgress();

    // Enviar para o WhatsApp
    sendWhatsappBtn.addEventListener('click', () => {
        const responsavel = responsavelInput.value.trim();
        if (!responsavel) {
            alert('Por favor, digite o nome do responsável antes de enviar!');
            responsavelInput.focus();
            return;
        }

        const activeSection = document.querySelector('.checklist-section.active-section');
        const activeBtn = document.querySelector('.turn-btn.active');
        const turnoSetorName = activeBtn ? activeBtn.textContent.trim() : 'Check-list';

        let mensagem = `*XKMIX - CONTROLO OPERACIONAL*\n`;
        mensagem += `📋 *${turnoSetorName}*\n`;
        mensagem += `👤 *Responsável:* ${responsavel}\n`;
        mensagem += `📅 *Data/Hora:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}\n\n`;
        mensagem += `*ITENS VERIFICADOS:*\n`;

        let total = 0;
        let concluidos = 0;

        activeSection.querySelectorAll('.checklist-item').forEach(item => {
            const checkbox = item.querySelector('.check-task');
            const texto = item.textContent.trim();
            total++;
            if (checkbox.checked) {
                concluidos++;
                mensagem += `✅ ${texto}\n`;
            } else {
                mensagem += `❌ ${texto}\n`;
            }
        });

        mensagem += `\n📊 *Progresso:* ${Math.round((concluidos/total)*100)}% (${concluidos}/${total})`;

        const telefone = '5581999999999'; // Substitua pelo número real se necessário (ex: DDI + DDD + Número)
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
        
        window.open(urlWhatsApp, '_blank');
    });
});
