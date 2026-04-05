// FlowDesk MV3 — utils.js

if (!globalThis.getVencimento3DiasUteis) {

/**
 * Calcula a data de vencimento considerando 3 dias úteis a partir de hoje.
 * Ignora fins de semana e feriados nacionais.
 * @returns {Promise<string>} Data formatada em pt-BR (dd/mm/aaaa)
 */
async function getVencimento3DiasUteis() {
    const data = new Date();
    let diasAdicionados = 0;
    let feriadosAno = null;
    let anoAtual = null;

    while (diasAdicionados < 3) {
        data.setDate(data.getDate() + 1);
        const diaSemana = data.getDay();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();

        // Recarregar feriados se o ano mudou (travessia de virada de ano)
        if (ano !== anoAtual) {
            feriadosAno = await globalThis.HolidayService.getHolidaySet(ano);
            anoAtual = ano;
        }

        const dataFormatada = `${dia}/${mes}/${ano}`;
        if (diaSemana !== 0 && diaSemana !== 6 && !feriadosAno.has(dataFormatada)) {
            diasAdicionados++;
        }
    }
    return data.toLocaleDateString('pt-BR');
}

/**
 * Escapa caracteres HTML para prevenir XSS.
 * @param {string} str
 * @returns {string}
 */
const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
};

/**
 * Cria versão debounced de uma função.
 * @param {Function} func - Função a ser adiada
 * @param {number} wait - Tempo de espera em ms
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Restringe um elemento dentro dos limites visíveis da viewport.
 * Garante que nenhuma borda do elemento ultrapasse a tela.
 * Converte para left/top absolutas para consistência.
 * @param {HTMLElement} element - Elemento a ser contido na viewport
 */
function clampToViewport(element) {
    const rect = element.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let left = rect.left;
    let top = rect.top;

    if (left < 0) left = 0;
    if (left + rect.width > winW) left = winW - rect.width;
    if (top < 0) top = 0;
    if (top + rect.height > winH) top = winH - rect.height;

    if (left < 0) left = 0;
    if (top < 0) top = 0;

    element.style.left = left + 'px';
    element.style.top = top + 'px';
    element.style.right = 'auto';
    element.style.bottom = 'auto';
}

/**
 * Reposiciona todos os elementos fixos para dentro da viewport
 * quando a janela do navegador é redimensionada.
 */
function clampAllElementsToViewport() {
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    /**
     * Restringe um elemento individual dentro da viewport.
     * @param {HTMLElement} el - Elemento a clampar
     * @param {boolean} dontResize - Se true, não permite reduzir as dimensões originais (útil para o Speed Dial circular)
     */
    function clampEl(el, dontResize = false) {
        if (!el || el.style.display === 'none') return;
        const rect = el.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        let width = rect.width;
        let height = rect.height;

        // Se o elemento é maior que a viewport, reduzir o tamanho (se permitido)
        if (!dontResize) {
            if (width > winW) {
                el.style.width = (winW - 10) + 'px';
                width = winW - 10;
            }
            if (height > winH) {
                el.style.height = (winH - 10) + 'px';
                height = winH - 10;
            }
        }

        // Clampar posição
        if (left + width > winW) left = winW - width;
        if (top + height > winH) top = winH - height;
        if (left < 0) left = 0;
        if (top < 0) top = 0;

        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
    }

    // Clampar Painel Financeiro
    const painelFin = document.getElementById('painel-financeiro');
    if (painelFin && painelFin.style.display === 'flex') clampEl(painelFin, false);

    // Clampar Bloco de Notas
    const blocoNotas = document.getElementById('bloco-notas');
    if (blocoNotas && blocoNotas.style.display === 'flex') clampEl(blocoNotas, false);

    // Clampar Botão Speed Dial (sempre visível, mas sem alterar proporções)
    const btnFloat = document.getElementById('abrir-painel');
    if (btnFloat) clampEl(btnFloat, true);
}

// Debounce do resize para evitar execuções excessivas
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(clampAllElementsToViewport, 100);
});

globalThis.getVencimento3DiasUteis = getVencimento3DiasUteis;
globalThis.escapeHTML = escapeHTML;
globalThis.debounce = debounce;
globalThis.clampToViewport = clampToViewport;
globalThis.clampAllElementsToViewport = clampAllElementsToViewport;

}
