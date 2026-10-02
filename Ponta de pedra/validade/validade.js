document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemIndexInput = document.getElementById('itemIndex');
    const itemCategoryInput = document.getElementById('itemCategory');
    const itemNameInput = document.getElementById('itemName');
    const itemQtyInput = document.getElementById('itemQty');
    const itemDateInput = document.getElementById('itemDate');
    const tableBody = document.getElementById('tableBody');
    const sendWhatsappBtn = document.getElementById('sendWhatsapp');
    const filterCategorySelect = document.getElementById('filterCategory');

    const STORAGE_KEY = 'xkmix_validade_items_v2';

    // Itens padrão iniciais com categorias
    const defaultItems = [
        { category: 'Creme', name: 'Polpa de Morango', qty: '10 un', date: '2026-04-10' },
        { category: 'Cobertura', name: 'Leite Condensado', qty: '6 un', date: '2026-04-05' },
        { category: 'Bebida', name: 'Água Tônica', qty: '12 un', date: '2026-04-03' }
    ];

    function getItems() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
            return defaultItems;
        }
        return JSON.parse(data);
    }

    function saveItems(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function renderTable() {
        const items = getItems();
        const selectedFilter = filterCategorySelect.value;
        tableBody.innerHTML = '';

        // Filtrar por categoria selecionada
        const filteredItems = items.filter((item, index) => {
            // Guardamos o índice original para usar na edição/exclusão correta
            item.originalIndex = index;
            if (selectedFilter === 'ALL') return true;
            return item.category === selectedFilter;
        });

        if (filteredItems.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #8a99ad;">Nenhum item cadastrado nesta categoria.</td></tr>`;
            return;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        filteredItems.forEach((item) => {
            const dataValidade = new Date(item.date + 'T00:00:00');
            const diffTime = dataValidade - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let rowClass = 'row-safe';
            let statusText = 'No Prazo';

            if (diffDays < 0) {
                rowClass = 'row-expired';
                statusText = `Vencido (${Math.abs(diffDays)}d atrás)`;
            } else if (diffDays === 0) {
                rowClass = 'row-expired';
                statusText = 'Vence Hoje!';
            } else if (diffDays <= 5) {
                rowClass = 'row-warning';
                statusText = `Vence em ${diffDays} dia(s)`;
            } else {
                statusText = `Ok (${diffDays}d restantes)`;
            }

            const [ano, mes, dia] = item.date.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;

            const tr = document.createElement('tr');
            tr.className = rowClass;
            tr.innerHTML = `
                <td><span style="font-family: 'Orbitron', sans-serif; font-size: 0.75rem; background: rgba(0,255,204,0.1); padding: 3px 6px; border-radius: 4px; color: #00ffcc;">${item.category || 'Geral'}</span></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.qty}</td>
                <td>${dataFormatada}</td>
                <td>${statusText}</td>
                <td>
                    <div class="action-btn-group">
                        <button class="edit-btn" onclick="editItem(${item.originalIndex})" title="Editar / Atualizar">✏️</button>
                        <button class="delete-btn" onclick="deleteItem(${item.originalIndex})" title="Excluir">🗑️</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const items = getItems();
        const index = itemIndexInput.value;

        const newItem = {
            category: itemCategoryInput.value,
            name: itemNameInput.value.trim(),
            qty: itemQtyInput.value.trim(),
            date: itemDateInput.value
        };

        if (index === '') {
            items.push(newItem);
        } else {
            items[index] = newItem;
            itemIndexInput.value = '';
        }

        saveItems(items);
        itemForm.reset();
        renderTable();
    });

    window.editItem = function(index) {
        const items = getItems();
        const item = items[index];
        itemCategoryInput.value = item.category || 'Creme';
        itemNameInput.value = item.name;
        itemQtyInput.value = item.qty;
        itemDateInput.value = item.date;
        itemIndexInput.value = index;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteItem = function(index) {
        if (confirm('Tem certeza que deseja remover este item?')) {
            const items = getItems();
            items.splice(index, 1);
            saveItems(items);
            renderTable();
        }
    };

    filterCategorySelect.addEventListener('change', () => {
        renderTable();
    });

    sendWhatsappBtn.addEventListener('click', () => {
        const items = getItems();
        if (items.length === 0) {
            alert('Não há itens cadastrados para enviar.');
            return;
        }

        let mensagem = `*XKMIX - CONTROLE DE VALIDADE*\n`;
        mensagem += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`;

        // Agrupar itens por categoria no WhatsApp
        const categorias = ['Bebida', 'Creme', 'Cobertura', 'Bolo e Torta', 'Complemento', 'Hambúrgueres'];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        categorias.forEach(cat => {
            const itensCat = items.filter(i => i.category === cat);
            if (itensCat.length > 0) {
                mensagem += `📂 *[ ${cat.toUpperCase()} ]*\n`;
                itensCat.forEach(item => {
                    const dataValidade = new Date(item.date + 'T00:00:00');
                    const diffDays = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
                    
                    let icone = '🟢';
                    if (diffDays <= 0) icone = '🔴';
                    else if (diffDays <= 5) icone = '⚠️';

                    const [ano, mes, dia] = item.date.split('-');
                    mensagem += `${icone} ${item.name} (${item.qty}) - Val: ${dia}/${mes}/${ano}\n`;
                });
                mensagem += `\n`;
            }
        });

        const telefone = ''; 
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
        window.open(urlWhatsApp, '_blank');
    });

    renderTable();
});
