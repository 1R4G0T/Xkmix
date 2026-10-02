document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.check-task');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressText');
    const responsavelInput = document.getElementById('responsavel');
    const sendWhatsappBtn = document.getElementById('sendWhatsapp');

    function updateProgress() {
        const total = checkboxes.length;
        let checkedCount = 0;

        checkboxes.forEach(chk => {
            if (chk.checked) checkedCount++;
        });

        const percentage = Math.round((checkedCount / total) * 100);
        progressBarFill.style.width = percentage + '%';
        progressText.textContent = `${percentage}% (${checkedCount} / ${total})`;
    }

    checkboxes.forEach(chk => {
        chk.addEventListener('change', updateProgress);
    });

    sendWhatsappBtn.addEventListener('click', () => {
        const nome = responsavelInput.value.trim();
        if (!nome) {
            alert('Por favor, preencha o nome do responsável antes de enviar!');
            responsavelInput.focus();
            return;
        }

        let mensagem = `📋 *CHECK-LIST DIÁRIO - XKMIX*\n`;
        mensagem += `📍 *Local:* Ponta de Pedra\n`;
        mensagem += `👤 *Responsável:* ${nome}\n`;
        
        const total = checkboxes.length;
        let checkedCount = 0;
        checkboxes.forEach(chk => { if (chk.checked) checkedCount++; });
        const percentage = Math.round((checkedCount / total) * 100);

        mensagem += `📊 *Progresso Concluído:* ${percentage}% (${checkedCount}/${total} itens)\n\n`;
        mensagem += `_Relatório gerado via sistema web._`;

        const numeroWhatsApp = ""; 
        const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
        
        window.open(url, '_blank');
    });

    updateProgress();
});
