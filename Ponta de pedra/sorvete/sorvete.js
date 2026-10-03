// Lista inicial fornecida
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

// Elementos do DOM
const container = document.getElementById('flavors-container');
const inputNewFlavor = document.getElementById('new-flavor');
const btnAdd = document.getElementById('add-btn');
const form = document.getElementById('ice-cream-form');

// Tenta buscar a lista salva no navegador. Se não existir, usa a lista padrão.
let savedFlavors = JSON.parse(localStorage.getItem('iceCreamFlavors'));

if (!savedFlavors || savedFlavors.length === 0) {
    savedFlavors = [...defaultFlavors];
    localStorage.setItem('iceCreamFlavors', JSON.stringify(savedFlavors));
}

// Função para renderizar os sabores na tela
function renderFlavors() {
    container.innerHTML = ''; // Limpa a lista atual
    
    // Opcional: Organiza em ordem alfabética para facilitar achar o sabor
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

// Evento para adicionar novo sabor
btnAdd.addEventListener('click', () => {
    const newFlavor = inputNewFlavor.value.trim();
    
    if (newFlavor === '') return;

    // Evita duplicatas ignorando letras maiúsculas e minúsculas
    const flavorExists = savedFlavors.some(
        f => f.toLowerCase() === newFlavor.toLowerCase()
    );

    if (!flavorExists) {
        savedFlavors.push(newFlavor);
        // Atualiza o localStorage com o novo sabor
        localStorage.setItem('iceCreamFlavors', JSON.stringify(savedFlavors));
        
        renderFlavors(); // Renderiza a lista novamente
        inputNewFlavor.value = ''; // Limpa o campo
    } else {
        alert('Este sabor já existe na lista!');
    }
});

// Permitir adicionar apertando o "Enter" no teclado
inputNewFlavor.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        btnAdd.click();
    }
});

// Evento de submissão do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede a página de recarregar
    
    // Seleciona apenas os checkboxes marcados
    const checkedBoxes = document.querySelectorAll('input[name="flavor"]:checked');
    const selectedFlavors = Array.from(checkedBoxes).map(cb => cb.value);

    if (selectedFlavors.length === 0) {
        alert('Por favor, selecione pelo menos um sabor!');
        return;
    }

    // Aqui os dados estão prontos para envio (via API, WhatsApp, etc). 
    // Para visualização, exibe os marcados em um alerta:
    alert('Pedido de sorvetes enviado:\n\n- ' + selectedFlavors.join('\n- '));
    
    // Opcional: Limpar a seleção depois de enviar
    form.reset(); 
});

// Inicializa a lista ao carregar a página
renderFlavors();
