// Configuração do seu Banco de Dados (Você pega isso no console do Firebase)
const firebaseConfig = {
    databaseURL: "https://SEU-PROJETO-DEFAULT-RTDB.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// FUNÇÃO PARA O ADM VER OS DADOS
database.ref('estoque_geral').on('value', (snapshot) => {
    const dados = snapshot.val();
    const container = document.getElementById('container-geral');
    container.innerHTML = ""; // Limpa para atualizar

    for (let id in dados) {
        const loja = dados[id];
        container.innerHTML += `
            <details class="section-group" open>
                <summary>Loja: ${loja.responsavel}</summary>
                <div class="estoque-grid" style="display: block; padding: 10px;">
                    <p><strong>Estoque:</strong> ${loja.itens}</p>
                    <p><strong>Observações:</strong> ${loja.obs || 'Nenhuma'}</p>
                    <hr border="1" color="#daa520">
                    <small>Enviado em: ${loja.data}</small>
                </div>
            </details>
        `;
    }
});
