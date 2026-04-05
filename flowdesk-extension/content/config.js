// FlowDesk MV3 — config.js

/** @constant {string} URL do webhook para telemetria via Google Apps Script */
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzVWMIWL04h4mKoo8fwob1c0Z0Sqalnz2yZBRyG_6B3hcmVrWm-8p6I8cO1bn6El2xh/exec";

const CONFIG_APP = {
    STORAGE_DATA: 'hyper_bloco_data_v2',
    STORAGE_POS: 'hyper_bloco_pos',
    STORAGE_MACROS: 'hyper_bloco_macros_v2',
    STORAGE_AGENDA: 'hyper_bloco_agenda_v1',
    STORAGE_THEME: 'hyper_bloco_theme',
    STORAGE_PROPOSALS: 'flowdesk_proposals_v1',
    STORAGE_HOLIDAYS: 'flowdesk_holidays_cache',
    FIN_THEME: 'fin_painel_theme',
    MAX_TABS: 4,
    MAX_HISTORY: 30,
    MAX_PROPOSALS: 30,
    DOM_ID: {
        CONTAINER: 'bloco-notas',
        TEXT_AREA: 'area-texto',
        BTN_OPEN: 'btn-sd-note'
    }
};

/**
 * Feriados nacionais brasileiros fixos como fallback (formato MM-DD).
 * Usado quando o cache do Google Calendar não está disponível.
 * Não inclui carnaval (não é feriado nacional) nem datas regionais.
 */
const FERIADOS_NACIONAIS_FIXOS = [
    '01-01', // Confraternização Universal
    '04-21', // Tiradentes
    '05-01', // Dia do Trabalho
    '09-07', // Independência do Brasil
    '10-12', // Nossa Senhora Aparecida
    '11-02', // Finados
    '11-15', // Proclamação da República
    '11-20', // Consciência Negra
    '12-25'  // Natal
];

/**
 * Palavras-chave de feriados NÃO nacionais/regionais para filtrar.
 * Garante que apenas feriados federais sejam considerados.
 */
const HOLIDAY_BLACKLIST = [
    'carnaval', 'carnival', 'quarta-feira de cinzas', 'segunda-feira de carnaval',
    'terça-feira de carnaval', 'véspera de carnaval', 'corpus christi'
];

globalThis.CONFIG_APP = CONFIG_APP;
globalThis.WEBHOOK_URL = WEBHOOK_URL;
globalThis.FERIADOS_NACIONAIS_FIXOS = FERIADOS_NACIONAIS_FIXOS;
globalThis.HOLIDAY_BLACKLIST = HOLIDAY_BLACKLIST;
