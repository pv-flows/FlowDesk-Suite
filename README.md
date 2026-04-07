# FlowDesk — Suite Corporativa

> Extensão Chrome (Manifest V3) para produtividade de operadores de negociação no [Hyperflow](https://conversas.hyperflow.global).

Migrada de um userscript Tampermonkey de 3.979 linhas para extensão nativa MV3 — sem dependências externas, sem bundler.

**Autor:** Paulo Victor Freire da Silva

---

## Funcionalidades

### Painel GERADOR DE PROPOSTAS FINANCEIRAS
- Gerador de propostas com campos de valor, vencimento e condições
- Cálculo automático de vencimento em 3 dias úteis (com feriados)
- Histórico de propostas com exportação
- Temas claro e escuro
- Envio automático para Google Sheets via webhook

### Bloco de Notas
- Editor persistente com múltiplas abas
- Revisão de texto via IA (Groq — Llama 3.3 70B)
- Macros de texto rápido
- Agenda integrada
- Histórico de rascunhos

### Speed Dial
- Botão flutuante de acesso rápido ao painel financeiro
- Posicionamento arrastável e persistido

### Popup (substitui TamperMenu)
- Trocar operador
- Resetar posições dos painéis
- Exportar / Importar backup
- Limpar histórico de propostas
- Reset de fábrica

### Atalhos de teclado

| Atalho | Ação |
|---|---|
| `Ctrl+1` | Abrir painel financeiro |
| `Ctrl+2` | Abrir bloco de notas |

---

## Estrutura do projeto

```
flowdesk-extension/
├── manifest.json
├── background/
│   └── service-worker.js
├── content/
│   ├── main.js
│   ├── config.js
│   ├── storage.js
│   ├── utils.js
│   ├── global-state.js
│   ├── services/
│   │   ├── toast.js
│   │   ├── modal.js
│   │   ├── holiday.js
│   │   └── groq.js
│   └── modules/
│       ├── fin-module.js
│       ├── notes-module.js
│       └── speed-dial.js
└── popup/
    ├── popup.html
    └── popup.js
```

---

## Instalação (modo desenvolvedor)

1. Clone o repositório
2. Acesse `chrome://extensions` no navegador
3. Ative o **Modo do desenvolvedor** (canto superior direito)
4. Clique em **Carregar sem compactação**
5. Selecione a pasta `flowdesk-extension/`

---

## Arquitetura

| Camada | Responsabilidade |
|---|---|
| `content scripts` | Injeção de UI e lógica na página do Hyperflow |
| `service worker` | Fetch cross-origin, Groq API, Google Calendar |
| `popup` | Menu de ações e status do operador |
| `chrome.storage.local` | Persistência de dados, posições e configurações |

### Decisões técnicas

- Scripts clássicos carregados em ordem via `manifest.json` — sem ES modules, sem bundler
- Objetos expostos via `globalThis` para compartilhamento entre módulos
- Todo fetch externo passa pelo service worker — nunca diretamente do content script
- `SafeStorage` como wrapper assíncrono sobre `chrome.storage.local`

---

## Roadmap

- [ ] Sincronização entre máquinas via `chrome.storage.sync`
- [ ] Badge no ícone com contador de propostas do dia
- [ ] Página de opções com configuração da API key do Groq
- [ ] Relatório diário automático via `chrome.alarms`
- [ ] Indicador de status do webhook no Speed Dial
- [ ] Publicação na Chrome Web Store

---

## Licença

Uso interno — SER Educacional.
