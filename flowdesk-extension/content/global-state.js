// FlowDesk MV3 — global-state.js

if (!globalThis.GlobalState) {

/**
 * Estado global da aplicação.
 * Gerencia identidade do operador e envio de telemetria.
 */
globalThis.GlobalState = {
    /**
     * Verifica se o operador está identificado (sem forçar prompt).
     * @returns {Promise<boolean>}
     */
    isLogged: async () => {
        const nome = await globalThis.SafeStorage.get('user_nome', null);
        const equipe = await globalThis.SafeStorage.get('user_equipe', null);
        return !!(nome && equipe);
    },

    /**
     * Retorna a identidade do operador atual.
     * @returns {Promise<{ nome: string, equipe: string }>}
     */
    getIdentity: async () => {
        return {
            nome: (await globalThis.SafeStorage.get('user_nome', null)) || "Operador",
            equipe: (await globalThis.SafeStorage.get('user_equipe', null)) || "Geral"
        };
    },

    /**
     * Envia ping de telemetria para o webhook.
     * @param {string} tipoAcao - Tipo da ação realizada
     * @param {string} metodoPagto - Método de pagamento utilizado
     * @param {number} [valor=0] - Valor monetário da ação
     */
    sendPing: async (tipoAcao, metodoPagto, valor = 0) => {
        if (globalThis.WEBHOOK_URL.includes("INSIRA_SUA_URL")) return;
        const ident = await globalThis.GlobalState.getIdentity();

        chrome.runtime.sendMessage({
            action: 'fetch-post',
            url: globalThis.WEBHOOK_URL,
            body: {
                operador: ident.nome,
                equipe: ident.equipe,
                tipo_acao: tipoAcao,
                metodo_pagto: metodoPagto,
                valor: valor
            }
        }, (response) => {
            if (response && response.ok) {
                console.log(`[FlowDesk] Ping: ${tipoAcao} - ${metodoPagto}`);
            } else {
                console.log(`[FlowDesk] Erro Ping:`, response?.error);
            }
        });
    },

    /**
     * Envia dados completos da proposta financeira para a planilha Google.
     * @param {Object} dadosProposta - Objeto com todos os campos do painel
     */
    sendProposal: async (dadosProposta) => {
        if (globalThis.WEBHOOK_URL.includes("INSIRA_SUA_URL")) return;
        const ident = await globalThis.GlobalState.getIdentity();

        chrome.runtime.sendMessage({
            action: 'fetch-post',
            url: globalThis.WEBHOOK_URL,
            body: {
                tipo_registro: "proposta",
                operador: ident.nome,
                equipe: ident.equipe,
                ...dadosProposta
            }
        }, (response) => {
            if (response && response.ok) {
                console.log(`[FlowDesk] Proposta registrada na planilha`);
            } else {
                console.error(`[FlowDesk] Erro ao registrar proposta:`, response?.error);
            }
        });
    }
};

}
