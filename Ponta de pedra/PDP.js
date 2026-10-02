document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('dropdownWrapper');
    const selectBar = document.getElementById('selectBar');
    const options = document.querySelectorAll('.option-item');
    const selectedText = document.getElementById('selectedText');

    // Abre e fecha o menu ao clicar na barra central
    selectBar.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.classList.toggle('active');
    });

    // Fecha o menu se clicar em qualquer outro lugar da tela
    document.addEventListener('click', () => {
        wrapper.classList.remove('active');
    });

    // Ação ao selecionar uma aba/setor
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const targetUrl = option.getAttribute('data-url');
            selectedText.textContent = option.textContent;
            wrapper.classList.remove('active');

            if (targetUrl) {
                document.body.style.transition = 'opacity 0.4s ease';
                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }
        });
    });
});
