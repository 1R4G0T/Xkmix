document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemIndexInput = document.getElementById('itemIndex');
    const itemNameInput = document.getElementById('itemName');
    const itemQtyInput = document.getElementById('itemQty');
    const itemDateInput = document.getElementById('itemDate');
    const tableBody = document.getElementById('tableBody');
    const sendWhatsappBtn = document.getElementById('sendWhatsapp');

    // Chave para guardar no localStorage do navegador
    const STORAGE_KEY = 'xkmix_validade_items';

    // Itens padrão iniciais caso esteja vazio (para facilitar o primeiro uso)
    const defaultItems = [
        { name: 'Polpa de Morango', qty: '10 un', date: '2026-04-10' },
        { name: 'Leite Condensado', qty: '6 un', date: '2026-04-05' },
        { name: 'Cobertura de Chocolate', qty: '3 un', date: '2026-04-03' }
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

    // Renderizar a tabela
    function renderTable() {
        const items = getItems();
        tableBody.innerHTML = '';

        if (items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #8a99ad;">Nenhum item cadastrado.</td></tr>`;
            return;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        items.forEach((item, index) => {
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

            // Formatar data para exibição (DD/MM/AAAA)
            const [ano, mes, dia] = item.date.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;

            const tr = document.createElement('tr');
            tr.className = rowClass;
            tr.innerHTML = `
                <td><strong>${item.name}</strong></td>
                <td>${item.qty}</td>
                <td>${dataFormatada}</td>
                <td>${statusText}</td>
                <td>
                    <div class="action-btn-group">
                        <button class="edit-btn" onclick="editItem(${index})" title="Editar / Atualizar Data">✏️</button>
                        <button class="delete-btn" onclick="deleteItem(${index})" title="Excluir Item">🗑️</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Adicionar ou Atualizar Item
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const items = getItems();
        const index = itemIndexInput.value;

        const newItem = {
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

    // Funções globais para Editar e Excluir
    window.editItem = function(index) {
        const items = getItems();
        const item = items[index];
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

    // Enviar Relatório via WhatsApp
    sendWhatsappBtn.addEventListener('click', () => {
        const items = getItems();
        if (items.length === 0) {
            alert('Não há itens cadastrados para enviar.');
            return;
        }

        let mensagem = `*XKMIX - CONTROLE DE VALIDADE*\n`;
        mensagem += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`;
        mensagem += `*STATUS DO ESTOQUE:*\n`;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        items.forEach(item => {
            const dataValidade = new Date(item.date + 'T00:00:00');
            const diffDays = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
            
            let icone = '🟢';
            if (diffDays <= 0) icone = '🔴';
            else if (diffDays <= 5) icone = '⚠️';

            const [ano, mes, dia] = item.date.split('-');
            mensagem += `${icone} *${item.name}* (${item.qty}) - Val: ${dia}/${mes}/${ano}\n`;
        });

        const telefone = ''; // Insira o número se desejar fixar (ex: 5581999999999)
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
        window.open(urlWhatsApp, '_blank');
    });

    // Carga inicial
    renderTable();
});
