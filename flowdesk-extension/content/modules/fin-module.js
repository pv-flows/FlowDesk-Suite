// FlowDesk MV3 — fin-module.js

if (!globalThis.FinModule) {

globalThis.FinModule = (function () {

        // --- ESTADO DO MÓDULO ---
        let isDarkMode = false;
        let lastInputState = {};

        // -----------------------------------------------------------------
        // CSS DO MÓDULO (extraído de injetarFerramenta)
        // -----------------------------------------------------------------

        /**
         * Retorna os estilos CSS do FinModule.
         * @returns {string} CSS completo do painel financeiro, login e Speed Dial
         */
        function getFinModuleStyles() {
            return `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto:wght@400;500&display=swap');

                /* --- Variáveis de Tema (Light) --- */
                :root {
                    --fin-bg: #ffffff;
                    --fin-text: #1a202c;
                    --fin-label: #718096;
                    --fin-border: #e2e8f0;
                    --fin-input-bg: #edf2f7;
                    --fin-input-border: #e2e8f0;
                    --fin-input-focus: #6b46c1;
                    --fin-primary: #6b46c1;
                    --fin-header-bg: #6b46c1;
                    --fin-header-text: white;
                    --fin-badge-bg: #f3ebff;
                    --fin-badge-text: #553c9a;
                    --fin-box-border: #b794f4;
                    --fin-btn-limpar-bg: #edf2f7;
                    --fin-btn-limpar-text: #4a5568;
                    --fin-shadow: rgba(0,0,0,0.15);
                    --fin-placeholder: #4a5568;
                }

                /* --- Variáveis de Tema (Dark) --- */
                /* Todos os valores calibrados para WCAG AA (contraste ≥ 4.5:1) */
                #painel-financeiro.dark-mode {
                    --fin-bg: #1a202c;
                    --fin-text: #f0f4f8;
                    --fin-label: #a0aec0;
                    --fin-border: #2d3748;
                    --fin-input-bg: #111827;
                    --fin-input-border: #4a5568;
                    --fin-input-focus: #b794f4;           /* era #9f7aea: mais brilhante */
                    --fin-primary: #9f7aea;               /* era #553c9a: contraste 5.2:1 sobre #1a202c */
                    --fin-header-text: #ffffff;
                    --fin-badge-bg: #4a3880;              /* era #44337a: +contraste com texto */
                    --fin-badge-text: #ede9fe;            /* era #d6bcfa: 6.1:1 sobre #4a3880 */
                    --fin-box-border: #9f7aea;            /* era #553c9a: alinhado com primary */
                    --fin-btn-limpar-bg: #2d3748;
                    --fin-btn-limpar-text: #e2e8f0;       /* era #cbd5e0: +claro */
                    --fin-shadow: rgba(0,0,0,0.5);
                    --fin-placeholder: #a0aec0;
                }

                /* --- Reset & Tipografia --- */
                #painel-financeiro * {
                    box-sizing: border-box;
                    font-family: 'Inter', 'Roboto', sans-serif;
                    line-height: 1.3;
                }

                #painel-financeiro *::placeholder {
                    color: var(--fin-placeholder);
                    opacity: 1;
                }

                /* --- Container Principal --- */
                #painel-financeiro {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    width: 260px;
                    background: var(--fin-bg);
                    border-radius: 12px;
                    z-index: 9999;
                    box-shadow: 0 5px 20px var(--fin-shadow);
                    border: 1px solid var(--fin-border);
                    display: none;
                    flex-direction: column;
                    animation: fadeIn 0.2s ease-out;
                    transition: background 0.2s, border 0.2s;
                    max-height: 95vh;
                    overflow: hidden;
                    resize: both;
                    min-width: 260px;
                    min-height: 250px;
                }
                #painel-financeiro::after {
                    content: '';
                    position: absolute;
                    bottom: 3px;
                    right: 3px;
                    width: 10px;
                    height: 10px;
                    background: linear-gradient(135deg, transparent 50%, var(--fin-label) 50%);
                    opacity: 0.5;
                    pointer-events: none;
                    z-index: 10;
                    cursor: se-resize;
                }

                /* --- Animações --- */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }

                /* --- Login Overlay --- */
                #login-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(255,255,255,0.6);
                    backdrop-filter: blur(5px);
                    z-index: 100000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                }
                #painel-login {
                    background: white;
                    width: 320px;
                    padding: 25px;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(107, 70, 193, 0.2);
                    border: 1px solid #e2e8f0;
                    text-align: center;
                    font-family: 'Inter', sans-serif;
                    animation: scaleIn 0.3s ease-out;
                    position: fixed;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                }
                #painel-login h2 { color: #6b46c1; margin: 0 0 5px 0; font-size: 20px; font-weight: 700; }
                #painel-login p { color: #718096; font-size: 12px; margin-bottom: 20px; }

                /* Scrollbars Compartilhadas no Módulo Financeiro */
                #painel-financeiro *::-webkit-scrollbar {
                    width: 6px;
                    background: transparent;
                }
                #painel-financeiro *::-webkit-scrollbar-thumb {
                    background: rgba(160, 174, 192, 0.5);
                    border-radius: 10px;
                }
                #painel-financeiro.dark-mode *::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.6);
                }

                .login-field { margin-bottom: 15px; text-align: left; }
                .login-field label {
                    display: block;
                    font-size: 11px;
                    color: #4a5568;
                    font-weight: 600;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                }
                .login-field input, .login-field select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #cbd5e0;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #2d3748;
                    outline: none;
                    transition: 0.2s;
                    background: #f7fafc;
                }
                .login-field input:focus, .login-field select:focus {
                    border-color: #6b46c1;
                    background: white;
                    box-shadow: 0 0 0 2px rgba(107, 70, 193, 0.2);
                }
                #btn-entrar {
                    background: #6b46c1;
                    color: white;
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                    transition: 0.2s;
                    margin-top: 10px;
                }
                #btn-entrar:hover { background: #553c9a; transform: translateY(-1px); }

                /* --- Cabeçalho do Painel --- */
                #cabecalho-fin {
                    background: var(--fin-header-bg);
                    color: var(--fin-header-text);
                    padding: 7px 13px;
                    cursor: move;
                    font-weight: 700;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    user-select: none;
                    flex-shrink: 0;
                }
                #btn-undo-fin {
                    cursor: pointer;
                    font-size: 16px;
                    margin-left: 8px;
                    display: none;
                    transition: opacity 0.2s;
                }
                #btn-undo-fin:hover { opacity: 0.8; }

                /* --- Corpo do Painel --- */
                .corpo-fin {
                    padding: 8px;
                    background: var(--fin-bg);
                    transition: background 0.2s;
                    overflow-y: auto;
                    flex: 1;
                    min-height: 0;
                }
                .corpo-fin::-webkit-scrollbar { width: 5px; }
                .corpo-fin::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 4px; }
                .corpo-fin::-webkit-scrollbar-track { background: transparent; }

                /* --- Campos de Input --- */
                .campo-fin { margin-bottom: 5px; }
                .campo-fin label {
                    font-size: 10px;
                    color: var(--fin-label);
                    font-weight: 700;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 2px;
                }
                .campo-fin input {
                    width: 100%;
                    padding: 5px 8px;
                    border: 1px solid var(--fin-input-border);
                    border-radius: 5px;
                    font-size: 12px;
                    color: var(--fin-text);
                    background-color: var(--fin-input-bg);
                    outline: none;
                    transition: 0.2s;
                    font-weight: 600;
                }
                .campo-fin input:focus {
                    border-color: var(--fin-input-focus);
                    background: var(--fin-bg);
                    box-shadow: 0 0 0 1px var(--fin-input-focus);
                }
                .campo-fin input::placeholder {
                    color: var(--fin-label);
                    opacity: 0.8;
                    font-weight: 400;
                }
                #painel-financeiro input[type="number"] { color-scheme: light; }
                #painel-financeiro.dark-mode input[type="number"] { color-scheme: dark; }

                /* --- Layout e Badges --- */
                .linha-dupla { display: grid; grid-template-columns: 1.5fr 1fr; gap: 6px; }
                .box-op3 { margin-bottom: 5px; }
                .badge-op {
                    background: var(--fin-badge-bg);
                    color: var(--fin-badge-text);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 9px;
                    margin-bottom: 3px;
                    display: inline-block;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    margin-top: 3px;
                }

                /* --- Botões do Rodapé --- */
                .botoes-container {
                    display: flex;
                    width: 100%;
                    border-top: 1px solid var(--fin-border);
                    align-items: center;
                    flex-shrink: 0;
                    background: var(--fin-bg);
                    position: relative;
                    z-index: 1;
                }
                #btn-limpar-fin, #btn-copiar-fin {
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                    transition: 0.2s;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }
                #btn-limpar-fin {
                    width: 30%;
                    background: var(--fin-btn-limpar-bg);
                    color: var(--fin-btn-limpar-text);
                    font-size: 11px;
                    border-right: 1px solid var(--fin-border);
                }
                #btn-limpar-fin:hover { filter: brightness(0.95); }
                #btn-copiar-fin { width: 70%; background: #6b46c1; color: white; font-size: 12px; }
                #btn-copiar-fin:hover { background: #553c9a; }
            `;
        }

        // -----------------------------------------------------------------
        // HTML TEMPLATES (extraídos de injetarFerramenta)
        // -----------------------------------------------------------------

        /**
         * Retorna o HTML do overlay de login.
         * @returns {string}
         */
        function getFinLoginHTML() {
            return `
                <div id="painel-login">
                    <h2>Bem-vindo! 👋</h2>
                    <p>Identifique-se para acessar o FlowDesk.</p>
                    <div class="login-field">
                        <label>Nome do Operador</label>
                        <input type="text" id="input-login-nome" placeholder="Ex: Paulo Silva">
                    </div>
                    <div class="login-field">
                        <label>Sua Equipe</label>
                        <select id="input-login-equipe">
                            <option value="" disabled selected>Selecione...</option>
                            <option value="DIGITAL">DIGITAL</option>
                            <option value="PRESENCIAL">PRESENCIAL</option>
                            <option value="PÓS">PÓS</option>
                        </select>
                    </div>
                    <button id="btn-entrar">ACESSAR SISTEMA</button>
                </div>
            `;
        }

        /**
         * Retorna o HTML do painel financeiro (negociação).
         * @param {boolean} darkMode - Se o tema escuro está ativo
         * @returns {string}
         */
        function getFinPanelHTML(darkMode) {
            return `
                <div id="cabecalho-fin">
                    <div style="display:flex; align-items:center; gap:8px;">
                        🟣 NEGOCIAÇÃO
                        <span id="btn-theme-fin" style="cursor:pointer; font-size:16px; margin-left:5px;" title="Alternar Tema">${darkMode ? '🌙' : '☀️'}</span>
                        <span id="btn-undo-fin" title="Desfazer Limpeza" style="display:none;">↩</span>
                        <span id="btn-hist-propostas" title="Histórico de Propostas" style="cursor:pointer; font-size:14px;">📋</span>
                    </div>
                    <span id="fechar-fin" style="cursor:pointer">✕</span>
                </div>
                <div id="screen-hist-propostas" style="display:none; flex-direction:column; position:absolute; top:0; left:0; width:100%; height:100%; z-index:10; background:var(--fin-bg);">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--fin-header-bg); color:white; font-size:12px; font-weight:700; flex-shrink:0;">
                        <span>📋 Histórico de Propostas</span>
                        <span id="fechar-hist" style="cursor:pointer; font-size:14px;">✕</span>
                    </div>
                    <div style="padding:8px; flex-shrink:0;">
                        <input type="text" id="hist-busca-matricula" placeholder="🔍 Buscar por nº matrícula..." style="width:100%; padding:6px 8px; border:1px solid var(--fin-input-border); border-radius:5px; font-size:12px; background:var(--fin-input-bg); color:var(--fin-text); outline:none; transition:border 0.2s;">
                    </div>
                    <div id="lista-hist-propostas" style="flex:1; overflow-y:auto; padding:0 8px;"></div>
                    <div style="padding:8px; flex-shrink:0; border-top:1px solid var(--fin-border);">
                        <button id="btn-voltar-hist" style="width:100%; padding:7px; background:transparent; border:1px solid var(--fin-border); border-radius:5px; color:var(--fin-text); font-size:12px; cursor:pointer; font-weight:600; transition:background 0.2s;">← Voltar ao Painel</button>
                    </div>
                </div>
                <div id="screen-preview-proposta" style="display:none; flex-direction:column; position:absolute; top:0; left:0; width:100%; height:100%; z-index:11; background:var(--fin-bg); border-radius:12px; overflow:hidden;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--fin-header-bg); color:white; font-size:12px; font-weight:700; flex-shrink:0;">
                        <span>👁 Pré-visualização</span>
                        <span id="fechar-preview" style="cursor:pointer; font-size:14px;">✕</span>
                    </div>
                    <textarea id="preview-proposta-text" readonly style="flex:1; margin:8px; padding:8px; font-size:11px; line-height:1.5; resize:none; border:1px solid var(--fin-border); border-radius:5px; background:var(--fin-input-bg); color:var(--fin-text); font-family:inherit;"></textarea>
                    <div style="display:flex; gap:6px; padding:8px; flex-shrink:0; border-top:1px solid var(--fin-border);">
                        <button id="btn-preview-voltar" style="flex:1; padding:7px; background:transparent; border:1px solid var(--fin-border); border-radius:5px; color:var(--fin-text); font-size:12px; cursor:pointer; transition:all 0.15s;" onmouseover="this.style.background='var(--fin-border)'" onmouseout="this.style.background='transparent'">← Voltar</button>
                        <button id="btn-preview-aplicar" style="flex:2; padding:7px; background:var(--fin-primary); border:none; border-radius:5px; color:white; font-size:12px; font-weight:700; cursor:pointer; transition:opacity 0.15s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">📋 Preencher Painel</button>
                    </div>
                </div>
                <div class="corpo-fin">
                    <div class="campo-fin" style="position:relative; border:2px solid var(--fin-primary); border-radius:6px; background:var(--fin-input-bg); padding:0;">
                        <div style="display:flex; align-items:center; gap:6px; padding:4px 8px 2px; background:var(--fin-header-bg); border-radius:4px 4px 0 0;">
                            <span style="font-size:10px; font-weight:800; color:white; letter-spacing:0.08em; text-transform:uppercase;">🆔 Matrícula</span>
                            <span style="font-size:9px; color:rgba(255,255,255,0.75); font-style:italic; margin-left:auto;">somente números</span>
                        </div>
                        <input type="text" id="fin-matricula" inputmode="numeric" pattern="[0-9]*" maxlength="20" autocomplete="off" placeholder="Ex: 01223344" style="width:100%; padding:5px 8px; border:none; border-radius:0 0 4px 4px; background:var(--fin-input-bg); color:var(--fin-text); font-weight:700; font-size:13px; letter-spacing:0.12em; box-sizing:border-box; outline:none;">
                    </div>
                    <div class="campo-fin">
                        <label>Valor Total Pendente (R$)</label>
                        <input type="text" id="fin-total" placeholder="0,00" style="font-weight:bold;">
                    </div>
                    <div class="campo-fin">
                    <div class="badge-op">PIX</div>
                    <div class="campo-fin"><input type="text" id="fin-pix" placeholder="0,00"></div>
                    <div class="badge-op">BOLETO À VISTA</div>
                    <div class="campo-fin">
                        <label>Valor à Vista (R$)</label>
                        <input type="text" id="fin-bol-vista" placeholder="0,00">
                    </div>
                    <div class="badge-op">CARTÃO</div>
                    <div class="linha-dupla">
                        <div class="campo-fin">
                            <label>Total ou Parc (R$)</label>
                            <input type="text" id="fin-cartao-val" placeholder="0,00">
                        </div>
                        <div class="campo-fin">
                            <label>Qtd Parc ➗</label>
                            <input type="number" id="fin-cartao-qtd" min="0">
                        </div>
                    </div>
                    <div class="badge-op">BOLETO PARCELADO</div>
                    <div class="box-op3">
                        <div class="campo-fin">
                            <label>Entrada (R$)</label>
                            <input type="text" id="fin-bol-ent" placeholder="0,00">
                        </div>
                        <div class="linha-dupla">
                            <div class="campo-fin">
                                <label>Valor Parc (R$)</label>
                                <input type="text" id="fin-bol-parc" placeholder="0,00">
                            </div>
                            <div class="campo-fin">
                                <label>Qtd Parc ➗</label>
                                <input type="number" id="fin-bol-qtd" min="0">
                            </div>
                        </div>
                    </div>
                    <label>Valores de referência</label>
                        <input type="text" id="fin-ref" placeholder="Ex: Nov./2025,Dez./2025">
                    </div>
                    <div class="campo-fin">
                        <label>📅 Vencimento</label>
                        <input type="text" id="fin-data" style="font-weight:bold;">
                    </div>
                </div>
                <div class="botoes-container">
                    <button id="btn-limpar-fin">LIMPAR</button>
                    <button id="btn-copiar-fin">GERAR PROPOSTA</button>
                </div>
            `;
        }


        // -----------------------------------------------------------------
        // FUNÇÃO PRINCIPAL: INJEÇÃO DO PAINEL FINANCEIRO
        // -----------------------------------------------------------------

        /**
         * Injeta todos os elementos do FinModule no DOM.
         * Cria estilos, HTML, event handlers de login, Speed Dial, drag e inputs.
         */
        async function injetarFerramenta() {
            if (document.getElementById('abrir-painel')) return;

            // --- Injetar CSS ---
            const styleId = 'estilo-painel-final-v4-2';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = getFinModuleStyles();
                document.head.appendChild(style);
            }

            // --- Injetar Login Overlay ---
            const loginOverlay = document.createElement('div');
            loginOverlay.id = 'login-overlay';
            loginOverlay.innerHTML = getFinLoginHTML();
            document.body.appendChild(loginOverlay);

            // --- Injetar Painel Financeiro ---
            const container = document.createElement('div');
            container.id = 'painel-financeiro';
            if (isDarkMode) container.classList.add('dark-mode');
            container.innerHTML = getFinPanelHTML(isDarkMode);
            document.body.appendChild(container);

            // Z-index: painel financeiro fica na frente ao clicar
            container.addEventListener('mousedown', () => {
                container.style.zIndex = "10000";
                const notePanel = document.getElementById('bloco-notas');
                if (notePanel) notePanel.style.zIndex = "9999";
            });

            // Preencher vencimento padrão
            document.getElementById('fin-data').value = await getVencimento3DiasUteis();

            // =============================================================
            // EVENT HANDLERS: LOGIN
            // =============================================================

            const btnEntrar = document.getElementById('btn-entrar');
            const inputNome = document.getElementById('input-login-nome');
            const selectEquipe = document.getElementById('input-login-equipe');

            /** Executa o login do operador após validação */
            const performLogin = async () => {
                const nome = inputNome.value.trim();
                const equipe = selectEquipe.value;
                if (!nome || !equipe) {
                    alert("Por favor, preencha seu nome e selecione uma equipe.");
                    return;
                }
                await SafeStorage.set('user_nome', nome);
                await SafeStorage.set('user_equipe', equipe);
                loginOverlay.style.display = 'none';
                SpeedDial.toggle(true);
                if (typeof TamperMenu !== 'undefined') TamperMenu.register();
            };

            btnEntrar.onclick = performLogin;
            inputNome.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') performLogin();
            });

            // =============================================================
            // EVENT HANDLERS: TEMA E UNDO
            // =============================================================

            const btnTheme = document.getElementById('btn-theme-fin');
            /** Alterna entre tema claro e escuro */
            btnTheme.onclick = async (e) => {
                e.stopPropagation();
                let novoModo = !isDarkMode;
                await SafeStorage.set(CONFIG_APP.STORAGE_THEME, novoModo);
                document.dispatchEvent(new CustomEvent('flowdeskThemeChanged', { detail: { isDark: novoModo } }));
            };

            document.addEventListener('flowdeskThemeChanged', (e) => {
                isDarkMode = e.detail.isDark;
                if (isDarkMode) {
                    container.classList.add('dark-mode');
                    btnTheme.innerText = '🌙';
                } else {
                    container.classList.remove('dark-mode');
                    btnTheme.innerText = '☀️';
                }
            });

            const btnUndo = document.getElementById('btn-undo-fin');
            let lastInputState = {}; // Restaurando declaração para evitar ReferenceErrors

            /** Desfaz a última limpeza restaurando os valores */
            btnUndo.onclick = (e) => {
                e.stopPropagation();
                container.querySelectorAll('input').forEach(input => {
                    if (input.id !== 'fin-data' && lastInputState[input.id] !== undefined) {
                        input.value = lastInputState[input.id];
                    }
                });
            };

            // Escape fecha tudo
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (SpeedDial.isOpen()) SpeedDial.close();
                    if (container.style.display === 'flex') container.style.display = 'none';
                    loginOverlay.style.display = 'none';
                }
            });

            // =============================================================
            // EVENT HANDLERS: INPUTS DO PAINEL FINANCEIRO
            // =============================================================

            const inputs = container.querySelectorAll('input');

            inputs.forEach((input) => {
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('spellcheck', 'false');
                input.addEventListener('focus', function () { this.select(); });

                // Máscara monetária: aplicada apenas em campos de valor (exceto number, data, ref e matrícula)
                if (input.type !== 'number' && input.id !== 'fin-data' && input.id !== 'fin-ref' && input.id !== 'fin-matricula') {
                    input.addEventListener('input', (e) => {
                        let val = e.target.value.replace(/[^0-9,]/g, '');
                        if ((val.match(/,/g) || []).length > 1) {
                            val = val.replace(/,([^,]*)$/, '$1');
                        }
                        e.target.value = val;
                    });
                    input.addEventListener('blur', (e) => {
                        if (!e.target.value) return;
                        let val = parseFloat(e.target.value.replace(/\./g, '').replace(',', '.'));
                        if (!isNaN(val)) {
                            e.target.value = val.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }
                    });
                }

                // Enter no input = gerar proposta
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') document.getElementById('btn-copiar-fin').click();
                });
            });

            // Limpeza automática de campos dependentes
            document.getElementById('fin-cartao-val').addEventListener('input', (e) => {
                if (e.target.value === '') document.getElementById('fin-cartao-qtd').value = '';
            });
            document.getElementById('fin-bol-ent').addEventListener('input', (e) => {
                if (e.target.value === '') {
                    document.getElementById('fin-bol-parc').value = '';
                    document.getElementById('fin-bol-qtd').value = '';
                }
            });
            document.getElementById('fin-bol-parc').addEventListener('input', (e) => {
                if (e.target.value === '') document.getElementById('fin-bol-qtd').value = '';
            });

            // =============================================================
            // EVENT HANDLERS: LIMPAR / FECHAR / GERAR PROPOSTA
            // =============================================================

            /** Limpa todos os campos (exceto data de vencimento) */
            document.getElementById('btn-limpar-fin').onclick = () => {
                inputs.forEach(input => {
                    if (input.id !== 'fin-data') input.value = '';
                });
                document.getElementById('fin-total').focus();
            };

            /** Fecha o painel financeiro */
            document.getElementById('fechar-fin').onclick = () => {
                container.style.display = 'none';
                document.getElementById('screen-hist-propostas').style.display = 'none';
                document.getElementById('screen-preview-proposta').style.display = 'none';
            };

            /**
             * Gera texto da proposta financeira, copia para clipboard e envia telemetria.
             * Detecta automaticamente o método de pagamento preenchido.
             */
            document.getElementById('btn-copiar-fin').onclick = async () => {
                const d = (id) => document.getElementById(id).value.trim();
                const has = (id) => d(id) !== "";

                // Validação: valor total é obrigatório
                if (!has('fin-total')) {
                    const el = document.getElementById('fin-total');
                    el.focus();
                    el.style.borderColor = "red";
                    setTimeout(() => el.style.borderColor = isDarkMode ? "#4a5568" : "#cbd5e0", 1000);
                    return;
                }

                // Validação: Opção 4 (Entrada e Parcelas)
                if (has('fin-bol-ent') || has('fin-bol-parc') || has('fin-bol-qtd')) {
                    if (!has('fin-bol-ent') || !has('fin-bol-parc') || !has('fin-bol-qtd') || d('fin-bol-qtd') === "0") {
                        let target = 'fin-bol-ent';
                        if (!has('fin-bol-ent')) target = 'fin-bol-ent';
                        else if (!has('fin-bol-parc')) target = 'fin-bol-parc';
                        else target = 'fin-bol-qtd';
                        const el = document.getElementById(target);
                        el.focus();
                        el.style.borderColor = "red";
                        setTimeout(() => el.style.borderColor = isDarkMode ? "#4a5568" : "#cbd5e0", 1000);
                        return;
                    }
                }

                // Salvar estado para undo
                lastInputState = {};
                inputs.forEach(input => { if (input.id !== 'fin-data') lastInputState[input.id] = input.value; });
                btnUndo.style.display = 'inline';

                // Montar payload da proposta
                const now = new Date();
                const dadosProposta = {
                    matricula: d('fin-matricula'),
                    data_acao: now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                    hora_acao: now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                    valor_total: d('fin-total'),
                    referencia: d('fin-ref'),
                    pix: d('fin-pix'),
                    boleto_vista: d('fin-bol-vista'),
                    cartao_valor: d('fin-cartao-val'),
                    cartao_parcelas: d('fin-cartao-qtd'),
                    boleto_entrada: d('fin-bol-ent'),
                    boleto_parc_valor: d('fin-bol-parc'),
                    boleto_parc_qtd: d('fin-bol-qtd'),
                    vencimento: d('fin-data')
                };

                // Salvar no histórico local
                let histArr = await SafeStorage.get(CONFIG_APP.STORAGE_PROPOSALS, []);
                if (!Array.isArray(histArr)) histArr = []; // Curar se localStorage possuir 'null'
                histArr.unshift(dadosProposta);
                if (histArr.length > CONFIG_APP.MAX_PROPOSALS) histArr.length = CONFIG_APP.MAX_PROPOSALS;
                await SafeStorage.set(CONFIG_APP.STORAGE_PROPOSALS, histArr);

                // Enviar para planilha Google
                await GlobalState.sendProposal(dadosProposta);

                // Montar mensagem da proposta usando a função dedicada (DRY)
                const msg = mountProposalText(dadosProposta);

                // Copiar e feedback visual
                await navigator.clipboard.writeText(msg);
                const btn = document.getElementById('btn-copiar-fin');
                btn.innerText = "COPIADO! ✅";
                btn.style.background = "#48bb78";
                btn.style.pointerEvents = "none";
                setTimeout(() => {
                    btn.innerText = "GERAR PROPOSTA";
                    btn.style.background = "#6b46c1";
                    btn.style.pointerEvents = "auto";
                    container.style.display = 'none';
                    inputs.forEach(input => { if (input.id !== 'fin-data') input.value = ''; });
                }, 750);
            };

            // =============================================================
            // EVENT HANDLERS: HISTÓRICO DE PROPOSTAS
            // =============================================================

            /**
             * Renderiza os cards do histórico de propostas.
             * @param {string} [filterMatricula] - Filtrar por matrícula (opcional)
             */
            /**
             * Monta o texto da proposta financeira a partir dos dados salvos.
             * @param {Object} proposta - Dados da proposta
             * @returns {string} Texto formatado
             */
            function mountProposalText(proposta) {
                const v = (key) => proposta[key] || '';
                const has = (key) => !!v(key);

                let msg = `Consta uma pendência financeira em sua matrícula no valor total de *R$ ${v('valor_total')}*`;
                if (has('referencia')) msg += `, referente a *${v('referencia')}*`;
                msg += `. Temos uma oportunidade de negociação para regularizar hoje, conforme as condições abaixo:\n\n`;

                let optCount = 1;
                if (has('pix')) {
                    msg += `✅ *Opção ${optCount} - PIX:* Por R$ ${v('pix')} (com desconto extra). Vencimento em 24h.\n\n`;
                    optCount++;
                }
                if (has('boleto_vista')) {
                    msg += `📄 *Opção ${optCount} - Boleto à Vista:* Por R$ ${v('boleto_vista')}.\n\n`;
                    optCount++;
                }
                if (has('cartao_valor')) {
                    const qtd = v('cartao_parcelas') || '1';
                    msg += `💳 *Opção ${optCount} - Cartão de Crédito:* ${qtd}x de R$ ${v('cartao_valor')}.\n\n`;
                    optCount++;
                }
                if (has('boleto_entrada') || has('boleto_parc_valor')) {
                    const fQtd = v('boleto_parc_qtd') || '1';
                    const lbl = fQtd === '1' ? 'parcela' : 'parcelas';
                    let txtOp = `📄 *Opção ${optCount} - Boleto Parcelado:* `;
                    if (has('boleto_entrada')) txtOp += `Entrada de R$ ${v('boleto_entrada')}`;
                    if (has('boleto_entrada') && has('boleto_parc_valor')) txtOp += ` + `;
                    if (has('boleto_parc_valor')) txtOp += `${fQtd} ${lbl} de R$ ${v('boleto_parc_valor')}`;
                    txtOp += `.\n\n`;
                    msg += txtOp;
                    optCount++;
                }
                msg += `Vencimento das propostas: *${v('vencimento')}*`;
                return msg;
            }

            // Proposta selecionada para preview
            let propostaPreview = null;

            /**
             * Renderiza os cards do histórico de propostas.
             * @param {string} [searchTerm] - Filtrar por matrícula ou valor total (opcional)
             */
            async function renderProposalHistory(searchTerm = '') {
                const histArr = await SafeStorage.get(CONFIG_APP.STORAGE_PROPOSALS, []);
                const listaEl = document.getElementById('lista-hist-propostas');
                if (!listaEl) return;

                const queryNormalized = searchTerm.replace(/[\.,\s]/g, '');

                const filtered = queryNormalized
                    ? histArr.filter(p => {
                        const matNorm = (p.matricula || '').replace(/[\.,\s]/g, '');
                        const valNorm = (p.valor_total || '').replace(/[\.,\s]/g, '');
                        return matNorm.includes(queryNormalized) || valNorm.includes(queryNormalized);
                    })
                    : histArr;

                if (filtered.length === 0) {
                    listaEl.innerHTML = '<div style="text-align:center; padding:20px; color:var(--fin-label); font-size:11px;">Nenhuma proposta encontrada.</div>';
                    return;
                }

                listaEl.innerHTML = '';
                filtered.forEach((proposta, index) => {
                    const card = document.createElement('div');
                    card.style.cssText = 'background:var(--fin-input-bg); border:1px solid var(--fin-border); border-radius:6px; padding:8px; margin-bottom:6px; cursor:pointer; font-size:11px; display:flex; justify-content:space-between; align-items:center;';
                    card.innerHTML = `
                        <div style="flex:1;">
                            <div style="font-weight:700; color:var(--fin-primary); margin-bottom:3px;">
                                ${proposta.matricula ? '🆔 ' + escapeHTML(proposta.matricula) + ' — ' : ''}
                                R$ ${escapeHTML(proposta.valor_total || '-')}
                            </div>
                            <div style="color:var(--fin-label); font-size:10px; word-break:break-word; overflow-wrap:break-word; white-space:normal;">${escapeHTML(proposta.referencia || '')}</div>
                            <div style="color:var(--fin-label); font-size:9px; margin-top:2px;">${escapeHTML(proposta.data_acao || '')} ${escapeHTML(proposta.hora_acao || '')} — <span style="opacity:.7;">Clique para pré-visualizar</span></div>
                        </div>
                        <div class="fin-hist-btn-del" style="padding:4px; opacity:0.5; transition:opacity 0.2s;" title="Excluir proposta">🗑️</div>
                    `;
                    card.onclick = (e) => {
                        if (e.target.classList.contains('fin-hist-btn-del')) return;
                        // Abrir preview da proposta (B3: não restaura direto)
                        propostaPreview = proposta;
                        document.getElementById('preview-proposta-text').value = mountProposalText(proposta);
                        document.getElementById('screen-hist-propostas').style.display = 'none';
                        document.getElementById('screen-preview-proposta').style.display = 'flex';
                    };

                    const btnDel = card.querySelector('.fin-hist-btn-del');
                    btnDel.onmouseenter = () => btnDel.style.opacity = '1';
                    btnDel.onmouseleave = () => btnDel.style.opacity = '0.5';
                    btnDel.onclick = (e) => {
                        e.stopPropagation();
                        const desc = proposta.matricula
                            ? `Deseja excluir a proposta da matrícula ${proposta.matricula}?`
                            : `Deseja excluir esta proposta de R$ ${proposta.valor_total}?`;

                        ModalService.confirm('Excluir Proposta?', desc, async () => {
                            const currentHist = await SafeStorage.get(CONFIG_APP.STORAGE_PROPOSALS, []);
                            // Buscar o índice real no array original

                            const realIdx = currentHist.findIndex(p =>
                                p.data_acao === proposta.data_acao &&
                                p.hora_acao === proposta.hora_acao &&
                                p.matricula === proposta.matricula
                            );

                            if (realIdx > -1) {
                                currentHist.splice(realIdx, 1);
                                await SafeStorage.set(CONFIG_APP.STORAGE_PROPOSALS, currentHist);
                                ToastService.success("Proposta removida!", "painel-financeiro");
                                const buscaEl = document.getElementById('hist-busca-matricula');
                                renderProposalHistory(buscaEl ? buscaEl.value.trim() : '');
                            }
                        }, 'painel-financeiro');
                    };

                    card.onmouseenter = () => card.style.borderColor = 'var(--fin-primary)';
                    card.onmouseleave = () => card.style.borderColor = 'var(--fin-border)';
                    listaEl.appendChild(card);
                });
            }

            // Abrir histórico de propostas
            document.getElementById('btn-hist-propostas').onclick = (e) => {
                e.stopPropagation();
                document.getElementById('screen-hist-propostas').style.display = 'flex';
                document.getElementById('hist-busca-matricula').value = '';
                renderProposalHistory();
            };

            // Fechar histórico (✕)
            document.getElementById('fechar-hist').onclick = (e) => {
                e.stopPropagation();
                document.getElementById('screen-hist-propostas').style.display = 'none';
                document.getElementById('screen-preview-proposta').style.display = 'none';
            };

            // Botão Voltar ao Painel (B2)
            document.getElementById('btn-voltar-hist').onclick = () => {
                document.getElementById('screen-hist-propostas').style.display = 'none';
            };

            // Busca reativa por matrícula no histórico
            document.getElementById('hist-busca-matricula').addEventListener('input', (e) => {
                renderProposalHistory(e.target.value.trim());
            });

            // =============================================================
            // PREVIEW: handlers dos botões Voltar e Preencher Painel (B3)
            // =============================================================

            // Fechar preview (✕)
            document.getElementById('fechar-preview').onclick = (e) => {
                e.stopPropagation();
                document.getElementById('screen-preview-proposta').style.display = 'none';
            };

            // Botão Voltar → retorna à lista do histórico
            document.getElementById('btn-preview-voltar').onclick = () => {
                document.getElementById('screen-preview-proposta').style.display = 'none';
                document.getElementById('screen-hist-propostas').style.display = 'flex';
            };

            // Botão Preencher Painel → restaura campos + fecha tudo
            document.getElementById('btn-preview-aplicar').onclick = () => {
                if (!propostaPreview) return;
                const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
                setVal('fin-matricula', propostaPreview.matricula);
                setVal('fin-total', propostaPreview.valor_total);
                setVal('fin-ref', propostaPreview.referencia);
                setVal('fin-pix', propostaPreview.pix);
                setVal('fin-bol-vista', propostaPreview.boleto_vista);
                setVal('fin-cartao-val', propostaPreview.cartao_valor);
                setVal('fin-cartao-qtd', propostaPreview.cartao_parcelas);
                setVal('fin-bol-ent', propostaPreview.boleto_entrada);
                setVal('fin-bol-parc', propostaPreview.boleto_parc_valor);
                setVal('fin-bol-qtd', propostaPreview.boleto_parc_qtd);
                document.getElementById('screen-preview-proposta').style.display = 'none';
                propostaPreview = null;
            };

            // Auto-preenchimento por matrícula ao sair do campo
            document.getElementById('fin-matricula').addEventListener('blur', async (e) => {
                const matricula = e.target.value.trim();
                if (!matricula) return;
                const histArr = await SafeStorage.get(CONFIG_APP.STORAGE_PROPOSALS, []);
                const match = histArr.find(p => p.matricula === matricula);
                if (match) {
                    const setIfEmpty = (id, val) => {
                        const el = document.getElementById(id);
                        if (el && !el.value.trim() && val) el.value = val;
                    };
                    setIfEmpty('fin-total', match.valor_total);
                    setIfEmpty('fin-ref', match.referencia);
                    document.getElementById('fin-total').focus();
                }
            });

            // Filtro numérico: remove qualquer caractere não-numérico da matrícula (B1)
            document.getElementById('fin-matricula').addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });

            // Prevenção de drag ao clicar no botão de histórico
            document.getElementById('btn-hist-propostas').addEventListener('mousedown', (e) => e.stopPropagation());

            // =============================================================
            // EVENT HANDLERS: DRAG DO PAINEL FINANCEIRO
            // =============================================================

            const header = document.getElementById('cabecalho-fin');
            let isDraggingPanel = false, hStartX, hStartY, hInitialLeft, hInitialTop;

            const onMouseMovePanel = (e) => {
                if (!isDraggingPanel) return;
                e.preventDefault();
                const winW = window.innerWidth;
                const winH = window.innerHeight;
                const panelW = container.offsetWidth;
                const panelH = container.offsetHeight;

                let newLeft = hInitialLeft + (e.clientX - hStartX);
                let newTop = hInitialTop + (e.clientY - hStartY);

                // Clampar dentro da viewport
                newLeft = Math.max(0, Math.min(newLeft, winW - panelW));
                newTop = Math.max(0, Math.min(newTop, winH - panelH));

                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
            };

            const onMouseUpPanel = () => {
                isDraggingPanel = false;
                header.style.cursor = 'move';
                document.removeEventListener('mousemove', onMouseMovePanel);
                document.removeEventListener('mouseup', onMouseUpPanel);
                clampToViewport(container);
            };

            header.onmousedown = (e) => {
                if (e.target.id === 'btn-theme-fin' || e.target.id === 'fechar-fin' || e.target.id === 'btn-undo-fin' || e.target.id === 'btn-hist-propostas') return;
                isDraggingPanel = true;
                hStartX = e.clientX;
                hStartY = e.clientY;
                hInitialLeft = container.offsetLeft;
                hInitialTop = container.offsetTop;
                header.style.cursor = 'grabbing';
                document.addEventListener('mousemove', onMouseMovePanel);
                document.addEventListener('mouseup', onMouseUpPanel);
            };
        }

        // --- API PÚBLICA DO MÓDULO ---
        return {
            init: async () => {
                isDarkMode = await globalThis.SafeStorage.get(globalThis.CONFIG_APP.STORAGE_THEME, false);
                setInterval(() => {
                    if (!document.getElementById('abrir-painel')) injetarFerramenta();
                }, 2000);
                injetarFerramenta();

                if (await globalThis.SafeStorage.get('force_relogin', false)) {
                    await globalThis.SafeStorage.set('force_relogin', false);
                    await globalThis.SafeStorage.set('user_nome', '');
                    await globalThis.SafeStorage.set('user_equipe', '');
                    setTimeout(() => {
                        const overlay = document.getElementById('login-overlay');
                        const inputNome = document.getElementById('input-login-nome');
                        if (overlay) {
                            overlay.style.display = 'flex';
                            if (inputNome) inputNome.focus();
                        }
                    }, 500);
                }
            }
        };
})();

}

