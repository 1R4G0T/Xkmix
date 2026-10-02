document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.destination-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Verifica se o card está bloqueado
            if (card.classList.contains('locked')) {
                triggerGlitchEffect(card);
                return;
            }

            const targetUrl = card.getAttribute('data-url');
            
            if (targetUrl && targetUrl !== '#') {
                // Adiciona um efeito de fade-out na tela antes de redirecionar
                document.body.style.transition = 'opacity 0.4s ease';
                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }
        });
    });

    // Função opcional para dar um feedback visual se clicar em local bloqueado
    function triggerGlitchEffect(element) {
        element.style.transform = 'scale(0.98)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
});
