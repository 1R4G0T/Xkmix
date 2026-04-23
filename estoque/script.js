function enviarArmazenamento() {
    const responsavel = document.getElementById('responsavel').value;
    const observacao = document.getElementById('obs').value;
    
    if (!responsavel) {
        alert("Por favor, preencha o nome do Responsável!");
        return;
    }

    // Coleta todos os itens e suas quantidades
    const itens = document.querySelectorAll('.item');
    let relatorio = `📦 *Relatório de Armazenamento*\n`;
    relatorio += `👤 Responsável: ${responsavel}\n\n`;

    itens.forEach(item => {
        const nome = item.querySelector('span').innerText;
        const qtd = item.querySelector('input').value || 0;
        relatorio += `🔹 ${nome}: ${qtd}\n`;
    });

    if (observacao) relatorio += `\n📝 Obs: ${observacao}`;

    // Exemplo: Enviar via WhatsApp (opcional)
    const encoded = encodeURIComponent(relatorio);
    // window.open(`https://wa.me/SEUNUMERO?text=${encoded}`);

    console.log("Dados salvos:", relatorio);
    alert("Estoque salvo com sucesso!");
}
