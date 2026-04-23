function enviarArmazenamento() {
    const responsavel = document.getElementById('responsavel').value;
    const observacao = document.getElementById('obs').value;
    
    if (!responsavel) {
        alert("Por favor, preencha o nome do Responsável!");
        return;
    }

    // Mudamos de '.item' para '.item-estoque' para bater com seu novo CSS
    const itens = document.querySelectorAll('.item-estoque');
    
    let relatorio = `📦 *Relatório de Armazenamento*\n`;
    relatorio += `👤 Responsável: ${responsavel}\n\n`;

    itens.forEach(item => {
        const nome = item.querySelector('span').innerText;
        // Pega o valor do input de número
        const qtd = item.querySelector('input[type="number"]').value || 0;
        relatorio += `🔹 ${nome}: ${qtd}\n`;
    });

    if (observacao) relatorio += `\n📝 Obs: ${observacao}`;

    // Link para o WhatsApp (Substitua SEUNUMERO pelo seu número real com DDD)
    const numero = "5581999999999"; // Exemplo: 55 + DDD + Numero
    const encoded = encodeURIComponent(relatorio);
    const linkZap = `https://wa.me/${numero}?text=${encoded}`;

    // Abre o WhatsApp com o relatório pronto
    window.open(linkZap, '_blank');

    console.log("Relatório Gerado:", relatorio);
}
