// FlowDesk MV3 — service-worker.js

/**
 * Service Worker da extensão FlowDesk.
 * Centraliza todas as chamadas fetch cross-origin que content scripts não podem fazer.
 * Ações suportadas:
 *   - 'groq'       → Chamada à API Groq (Llama 3.3) para revisão de texto
 *   - 'fetch-post' → POST genérico para webhooks (telemetria, propostas)
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    // ─── GROQ AI ────────────────────────────────────────────────────────
    if (msg.action === 'groq') {
        const { text, apiKey, model, systemPrompt } = msg;

        fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ]
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.error) {
                sendResponse({ ok: false, error: `Groq: ${json.error.message}` });
                return;
            }
            const resultado = json.choices?.[0]?.message?.content;
            if (!resultado) {
                sendResponse({ ok: false, error: 'Groq retornou resposta vazia.' });
                return;
            }
            sendResponse({ ok: true, data: resultado.trim() });
        })
        .catch(() => {
            sendResponse({ ok: false, error: 'Erro de rede ao chamar o Groq.' });
        });

        return true; // mantém canal aberto para async
    }

    // ─── FETCH POST GENÉRICO (telemetria, propostas) ────────────────────
    if (msg.action === 'fetch-post') {
        const { url, body } = msg;

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(() => {
            sendResponse({ ok: true });
        })
        .catch((err) => {
            sendResponse({ ok: false, error: err.message || 'Erro de rede.' });
        });

        return true; // mantém canal aberto para async
    }

    if (msg.action === 'fetch-get') {
        fetch(msg.url, { method: 'GET' })
            .then(res => {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(data => sendResponse({ ok: true, data }))
            .catch(err => sendResponse({ ok: false, error: err.message }));
        return true;
    }

});

chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'command', cmd: command });
    }
});
