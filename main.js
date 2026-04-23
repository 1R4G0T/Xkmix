// Salva a unidade no navegador
document.getElementById('selectLoja').addEventListener('change', function() {
    localStorage.setItem('unidadeLogada', this.value);
    console.log("Unidade salva: " + this.value);
});

// Impede de entrar nos sistemas sem selecionar a loja
document.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', function(e) {
        if (!localStorage.getItem('unidadeLogada')) {
            e.preventDefault();
            alert("Por favor, selecione uma Unidade antes de prosseguir!");
        }
    });
});
function verificarSenha() {
    const senha = document.getElementById('senhaAcesso').value;
    if (senha === "1234") { // Troque "1234" pela senha que você quiser
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('menuPrincipal').style.display = 'block';
    } else {
        alert("Senha incorreta!");
    }
}
