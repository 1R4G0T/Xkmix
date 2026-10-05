document.addEventListener('DOMContentLoaded', () => {
    const valInput = document.getElementById('valInput');
    const payButtons = document.querySelectorAll('.pay-btn');
    const historyList = document.getElementById('historyList');
    const clearBtn = document.getElementById('clearBtn');

    const totDinheiro = document.getElementById('totDinheiro');
    const totDebito = document.getElementById('totDebito');
    const totCredito = document.getElementById('totCredito');
    const totPix = document.getElementById('totPix');
    const totGeral = document.getElementById('totGeral');

    // Carrega registros guardados do localStorage
    let registros = JSON.parse(localStorage.getItem('caderno_vendas')) || [];

    // 1. Atualiza e Renderiza a Interface
    function render() {
        historyList.innerHTML = '';

        let somaDinheiro = 0;
        let somaDebito = 0;
        let somaCredito = 0;
        let somaPix = 0;

        // Itera de trás para a frente para mostrar os mais recentes no topo
        registros.slice().reverse().forEach((item, indexActual) => {
            const indexOriginal = registros.length - 1 - indexActual;
            const val = parseFloat(item.valor) || 0;

            if (item.tipo === 'Dinheiro') somaDinheiro += val;
            if (item.tipo === 'Débito') somaDebito += val;
            if (item.tipo === 'Crédito') somaCredito += val;
            if (item.tipo === 'PIX') somaPix += val;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.hora}</td>
                <td>${item.tipo}</td>
                <td>R$ ${val.toFixed(2)}</td>
                <td><button class="del-item-btn" data-index="${indexOriginal}">X</button></td>
            `;
            historyList.appendChild(tr);
        });

        // Atualiza Totais
        totDinheiro.textContent = `R$ ${somaDinheiro.toFixed(2)}`;
        totDebito.textContent = `R$ ${somaDebito.toFixed(2)}`;
        totCredito.textContent = `R$ ${somaCredito.toFixed(2)}`;
        totPix.textContent = `R$ ${somaPix.toFixed(2)}`;

        const somaGeral = somaDinheiro + somaDebito + somaCredito + somaPix;
        totGeral.textContent = `R$ ${somaGeral.toFixed(2)}`;

        // Guarda no LocalStorage
        localStorage.setItem('caderno_vendas', JSON.stringify(registros));
    }

    // 2. Adicionar Novo Lançamento
    function adicionarVenda(tipo) {
        const val = parseFloat(valInput.value);
        if (isNaN(val) || val <= 0) {
            alert('Digite um valor válido!');
            valInput.focus();
            return;
        }

        const agora = new Date();
        const horaStr = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        registros.push({
            hora: horaStr,
            tipo: tipo,
            valor: val
        });

        valInput.value = '';
        valInput.focus();
        render();
    }

    // Eventos nos Botões de Pagamento
    payButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tipo = btn.getAttribute('data-type');
            adicionarVenda(tipo);
        });
    });

    // 3. Remover Item Específico
    historyList.addEventListener('click', (e) => {
        if (e.target.classList.contains('del-item-btn')) {
            const index = e.target.getAttribute('data-index');
            registros.splice(index, 1);
            render();
        }
    });

    // 4. Limpar Todo o Turno
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Tem certeza de que deseja apagar TODOS os lançamentos deste caderno?')) {
                registros = [];
                render();
                valInput.focus();
            }
        });
    }

    // Renderização inicial ao carregar a página
    render();
});
