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
