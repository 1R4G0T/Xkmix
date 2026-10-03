document.addEventListener('DOMContentLoaded', () => {
    const defaultFlavors = [
        "Morango", "Chocolate", "Flocos", "Chocomenta", "Sensação", "Blue Ice", 
        "Baunilha", "Base ninho", "Pistache", "Graviola zero", "Morango zero", 
        "Açaí zero", "Delicia de abacaxi", "Abacaxi ao vinho", "Ameixa", 
        "Passas ao rum", "Banana caramelizada", "Maracujá", "Oreo", "Nutella", 
        "Ninho com Nutella", "Ovomaltine", "Ferreiro Rocher", "Prestígio", 
        "Floresta negra", "Coco", "Coco queimado", "Maçã verde", "Café", "Uva", 
        "Iogurte grego", "Caipirinha", "Cereja", "Gianduia", "Paçoca", 
        "Leite condensado", "Doce de leite", "Romeu e Julieta"
    ];

    const container = document.getElementById('flavors-container');
    const inputNewFlavor = document.getElementById('new-flavor');
    const btnAdd = document.getElementById('add-btn');
    const form = document.getElementById('ice-cream-form');

    let savedFlavors = JSON.parse(localStorage.getItem('iceCreamFlavors'));

    if (!savedFlavors || savedFlavors.length === 0) {
        savedFlavors = [...defaultFlavors];
        localStorage.setItem('iceCreamFlavors', JSON.stringify(savedFlavors));
    }

    function renderFlavors() {
        container.innerHTML = ''; 
        
        const sortedFlavors = savedFlavors.sort((a, b) => a.localeCompare(b));

        sortedFlavors.forEach(flavor => {
            const label = document.createElement('label');
            label.className = 'flavor-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'flavor';
            checkbox.value = flavor;

            const textNode = document.createTextNode(flavor);

            label.appendChild(checkbox);
            label.appendChild(textNode);
            container.appendChild(label);
        });
    }

    btnAdd.addEventListener('click', () => {
        const newFlavor = inputNewFlavor.value.trim();
        
        if (newFlavor === '') return;

        const flavorExists = savedFlavors.some(
            f => f.toLowerCase() === newFlavor.toLowerCase()
        );

        if (!flavorExists) {
            savedFlavors.push(newFlavor);
            localStorage.setItem('iceCreamFlavors', JSON.stringify(savedFlavors));
            renderFlavors(); 
            inputNewFlavor.value = ''; 
        } else {
            alert('[ERRO] Sabor já registado no sistema!');
        }
    });

    inputNewFlavor.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnAdd.click();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const checkedBoxes = document.querySelectorAll('input[name="flavor"]:checked');
        const selectedFlavors = Array.from(checkedBoxes).map(cb => cb.value);

        if (selectedFlavors.length === 0) {
            alert('[AVISO] Selecione pelo menos um sabor para o pedido.');
            return;
        }

        // Monta a mensagem com o nome PDP
        let mensagem = `*XKMIX - PEDIDO DE SORVETES (PDP)*\n`;
        mensagem += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`;
        mensagem += `*Sabores Solicitados:*\n`;
        
        selectedFlavors.forEach(sabor => {
            mensagem += `• ${sabor}\n`;
        });

        // Envia direto para o WhatsApp
        const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
        window.open(urlWhatsApp, '_blank');
        
        // Limpa a seleção após enviar
        form.reset(); 
    });

    renderFlavors();
});
