function enviarAbastecimento() {
    const responsavel = document.getElementById('responsavel').value;
    if (!responsavel) { alert("Nome do responsavel?"); return; }

    let texto = `ABASTRCIMENTO XKMIX\nResponsavel: ${responsavel}\n\n`;

    const sabores = document.querySelectorAll('.item-abastecimento');

    sabores.forEach(sabor => {
        const nome = sabor.querySelector('summary').innerText;
        const inputs = sabor.querySelectorAll('.linha-unidade');
        let temDados = false;
        let resumoSabor = `${nome}:\n`;

        inputs.forEach(unid => {
            const label = unid.querySelector('span').innerText;
            const valor = unid.querySelector('input').value;
            if (valor > 0) {
                resumoSabor += ` - ${label}: ${valor}\n`;
                temDados = true;
            }
        });

        if (temDados) texto += resumoSabor + `\n`;
    });

    window.open(`https://wa.me/SEUNUMERO?text=${encodeURIComponent(texto)}`);
}
