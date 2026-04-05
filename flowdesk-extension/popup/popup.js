// FlowDesk MV3 — popup.js

document.addEventListener('DOMContentLoaded', async () => {
    // Carregar identidade do operador parseando dados nativos do chrome.storage.local
    const result = await chrome.storage.local.get(['user_nome', 'user_equipe']);
    const nome = result.user_nome ? JSON.parse(result.user_nome) : null;
    const equipe = result.user_equipe ? JSON.parse(result.user_equipe) : null;

    const statusEl = document.getElementById('status-operador');
    if (nome && equipe) {
        statusEl.textContent = `Ativo: ${nome} - ${equipe}`;
    } else {
        statusEl.textContent = `Identificar Operador (Login pendente)`;
    }

    // Auxiliar para despachar o clique com segurança para a aba alvo
    const sendCmd = (cmd) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'tamperMenu', cmd: cmd }, () => {
                    if (chrome.runtime.lastError) {
                        console.warn('[FlowDesk Popup]', chrome.runtime.lastError.message);
                        return;
                    }
                    // Fecha popup automaticamente após chamar uma ação para a tela fluir
                    window.close();
                });
            }
        });
    };

    // Vínculo dos botões
    document.getElementById('btn-change').onclick = () => sendCmd('changeOperator');
    document.getElementById('btn-reset-pos').onclick = () => sendCmd('resetPositions');
    document.getElementById('btn-export').onclick = () => sendCmd('exportBackup');
    document.getElementById('btn-import').onclick = () => sendCmd('importBackup');
    document.getElementById('btn-clear-hist').onclick = () => sendCmd('clearProposalHistory');
    document.getElementById('btn-reset-all').onclick = () => sendCmd('resetToDefaults');
});
