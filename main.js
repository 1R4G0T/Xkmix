function verificarAcesso() {
    const loja = document.getElementById('selectLoja').value;
    const senha = document.getElementById('senhaAcesso').value;
    
    if (loja === "") {
        alert("Por favor, selecione uma unidade!");
        return;
    }

    // Lógica de Senhas
    if (loja === "adm" && senha === "admin99") { // Senha diferente para o ADM
        liberarMenu(true);
    } else if (loja !== "adm" && senha === "1234") { // Senha padrão das unidades
        liberarMenu(false);
    } else {
        alert("Senha incorreta para esta unidade!");
    }
}

function liberarMenu(isAdm) {
    // Salva a unidade logada para as outras páginas usarem
    const loja = document.getElementById('selectLoja').value;
    localStorage.setItem('unidadeLogada', loja);

    // Esconde o login e mostra o menu
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('menuPrincipal').style.display = 'block';

    // Se for ADM, mostra o botão extra
    if (isAdm) {
        document.getElementById('btnAdm').style.display = 'block';
    }
}
