// FlowDesk MV3 — speed-dial.js

if (!globalThis.SpeedDial) {

const SpeedDial = (function () {
    let isDialOpen = false;
    let dragTimer, isDraggingBtn = false, bStartX, bStartY, bStartLeft, bStartTop;

    function getStyles() {
        return `
                /* --- Speed Dial (FAB) --- */
                #abrir-painel {
                    position: fixed;
                    bottom: 80px;
                    left: 15px;
                    z-index: 9999;
                    background: #ffffff;
                    color: #6b46c1;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    min-width: 50px;
                    min-height: 50px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(107, 70, 193, 0.4);
                    font-size: 24px;
                    transition: transform 0.2s, background 0.2s;
                    user-select: none;
                }
                #abrir-painel:hover { background: #f7fafc; }
                #main-icon { transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); display: inline-block; }
                #abrir-painel.sd-open #main-icon { transform: rotate(225deg); }

                /* --- Alerta de Agenda (Pulse) --- */
                #abrir-painel.sd-alert:not(.sd-open) {
                    animation: sd-pulse 2s infinite;
                }

                @keyframes sd-pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7), 0 4px 15px rgba(107, 70, 193, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 15px rgba(255, 255, 255, 0), 0 4px 15px rgba(107, 70, 193, 0.4);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0), 0 4px 15px rgba(107, 70, 193, 0.4);
                    }
                }

                .sd-action {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    opacity: 0;
                    pointer-events: none;
                    transform: scale(0.5) translateY(0);
                    color: white;
                    font-size: 18px;
                    z-index: -1;
                    right: 5px;
                }
                #abrir-painel.sd-open .sd-action { opacity: 1; pointer-events: auto; transform: scale(1); }
                #abrir-painel.sd-open #btn-sd-fin { transform: translateY(-60px); }
                #abrir-painel.sd-open #btn-sd-note { transform: translateY(-110px); }
                #btn-sd-fin { background: #6b46c1; }
                #btn-sd-note { background: #dd6b20; }
                #btn-sd-note:hover { background: #c05621; }
                #btn-sd-fin:hover { background: #553c9a; }
        `;
    }

    function init() {
        if (document.getElementById('abrir-painel')) return;

        // Injetar CSS
        const styleId = 'estilo-speed-dial';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = getStyles();
            document.head.appendChild(style);
        }

        // --- Injetar Botão Speed Dial (FAB) ---
        const btnAbrir = document.createElement('div');
        btnAbrir.id = 'abrir-painel';
        btnAbrir.innerHTML = `
            <span id="main-icon">➕</span>
            <div id="btn-sd-fin" class="sd-action" title="Gerador de Propostas">💰</div>
            <div id="btn-sd-note" class="sd-action" title="Bloco de Notas">📝</div>
        `;
        document.body.appendChild(btnAbrir);

        // Recuperar referências após injetar
        const btnSdFin = document.getElementById('btn-sd-fin');
        const btnSdNote = document.getElementById('btn-sd-note');
        const container = document.getElementById('painel-financeiro');
        const loginOverlay = document.getElementById('login-overlay');
        const inputNome = document.getElementById('input-login-nome');

        // =============================================================
        // EVENT HANDLERS: BOTÕES SPEED DIAL (FINANCEIRO / NOTAS)
        // =============================================================

        btnSdFin.addEventListener('mousedown', (e) => e.stopPropagation());
        /** Abre/fecha o painel financeiro */
        btnSdFin.onclick = (e) => {
            e.stopPropagation();
            if (container && container.style.display === 'flex') {
                container.style.display = 'none';
            } else if (container) {
                container.style.display = 'flex';
                container.style.zIndex = '10000';
                const notePanel = document.getElementById('bloco-notas');
                if (notePanel) notePanel.style.zIndex = '9999';
                setTimeout(() => {
                    const el = document.getElementById('fin-total');
                    if (el) el.focus();
                }, 50);
            }
        };

        btnSdNote.addEventListener('mousedown', (e) => e.stopPropagation());
        /** Abre/fecha o bloco de notas */
        btnSdNote.onclick = (e) => {
            e.stopPropagation();
            const blocoContainer = document.getElementById('bloco-notas');
            if (blocoContainer) {
                if (blocoContainer.style.display === 'flex') {
                    blocoContainer.style.display = 'none';
                } else {
                    blocoContainer.style.display = 'flex';
                    blocoContainer.style.zIndex = '10000';
                    if (container) container.style.zIndex = '9999';
                    const areaTexto = document.getElementById('area-texto');
                    if (areaTexto) areaTexto.focus();
                }
            }
        };

        const onMouseMoveBtn = (e) => {
            if (!isDraggingBtn) return;
            e.preventDefault();
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const btnW = btnAbrir.offsetWidth;
            const btnH = btnAbrir.offsetHeight;

            let newLeft = bStartLeft + (e.clientX - bStartX);
            let newTop = bStartTop + (e.clientY - bStartY);

            newLeft = Math.max(0, Math.min(newLeft, winW - btnW));
            newTop = Math.max(0, Math.min(newTop, winH - btnH));

            btnAbrir.style.left = newLeft + 'px';
            btnAbrir.style.top = newTop + 'px';
            btnAbrir.style.right = 'auto';
            btnAbrir.style.bottom = 'auto';
        };

        const onMouseUpBtn = async () => {
            clearTimeout(dragTimer);
            document.removeEventListener('mousemove', onMouseMoveBtn);
            document.removeEventListener('mouseup', onMouseUpBtn);

            if (isDraggingBtn) {
                isDraggingBtn = false;
                btnAbrir.style.cursor = 'pointer';
                btnAbrir.style.transform = 'scale(1)';
                globalThis.clampToViewport(btnAbrir);
            } else {
                if (!await globalThis.GlobalState.isLogged()) {
                    if (loginOverlay) loginOverlay.style.display = 'flex';
                    if (inputNome) inputNome.focus();
                } else {
                    toggle(false);
                }
            }
        };

        btnAbrir.addEventListener('mousedown', (e) => {
            if (e.target.closest('.sd-action')) return;
            e.preventDefault();
            isDraggingBtn = false;
            bStartX = e.clientX;
            bStartY = e.clientY;
            bStartLeft = btnAbrir.offsetLeft;
            bStartTop = btnAbrir.offsetTop;
            document.addEventListener('mousemove', onMouseMoveBtn);
            document.addEventListener('mouseup', onMouseUpBtn);
            dragTimer = setTimeout(() => {
                isDraggingBtn = true;
                btnAbrir.style.cursor = 'move';
                btnAbrir.style.transform = 'scale(1.2)';
            }, 200);
        });

    }

    const toggle = (forceOpen = false) => {
        const btnAbrir = document.getElementById('abrir-painel');
        if (!btnAbrir) return;

        if (forceOpen) {
            isDialOpen = true;
            btnAbrir.classList.add('sd-open');
        } else {
            isDialOpen = !isDialOpen;
            if (isDialOpen) {
                btnAbrir.classList.add('sd-open');
            } else {
                btnAbrir.classList.remove('sd-open');
            }
        }
        document.dispatchEvent(new CustomEvent('flowdeskRefreshNotifications'));
    };

    const close = () => {
        isDialOpen = false;
        const btnAbrir = document.getElementById('abrir-painel');
        if (btnAbrir) btnAbrir.classList.remove('sd-open');
        document.dispatchEvent(new CustomEvent('flowdeskRefreshNotifications'));
    };

    const isOpen = () => isDialOpen;

    return { init, toggle, close, isOpen };
})();

globalThis.SpeedDial = SpeedDial;

}
