/**
 * language-system.js
 * Sistema de tradução para o projeto EcoPonto - Versão Simplificada
 */

// Importar as configurações e traduções
let CONFIG, translations;

// Criar um objeto global para armazenar o estado do idioma atual
export const languageState = {
    currentLanguage: "pt" // Idioma padrão
};

// Tornar o estado de idioma disponível globalmente
window.languageState = languageState;

// Carregar configurações e traduções
export function loadTranslations() {
    console.log("Carregando traduções...");
    
    return import("./config.js")
        .then(module => {
            CONFIG = module.CONFIG;
            translations = module.translations;
            
            console.log("CONFIG e traduções carregados com sucesso");
            console.log("Idiomas disponíveis:", Object.keys(translations));
            
            // Adicionar traduções para o modo escuro/claro em todos os idiomas
            ensureDarkModeTranslations();
            
            return { CONFIG, translations };
        })
        .catch(error => {
            console.error("Erro ao importar configurações:", error);
            return null;
        });
}

// Função principal para atualizar os textos da interface
export function updateInterfaceTexts(lang) {
    console.log("Atualizando textos da interface para idioma:", lang);
    
    // Se não temos traduções, carregá-las primeiro
    if (!translations) {
        loadTranslations().then(() => {
            if (translations) {
                updateInterfaceTextsInternal(lang);
            }
        });
    } else {
        updateInterfaceTextsInternal(lang);
    }
}

// Função interna para atualizar os textos (após garantir que as traduções estão carregadas)
function updateInterfaceTextsInternal(lang) {
    try {
        // Verificar se o idioma é suportado
        if (!translations[lang]) {
            console.error(`Traduções não encontradas para o idioma: ${lang}`);
            return;
        }
        
        // Obter as traduções para o idioma selecionado
        const texts = translations[lang];
        console.log("Textos de tradução carregados:", Object.keys(texts).length, "entradas");
        
        // Atualizar os textos da interface
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            if (texts[key]) {
                element.textContent = texts[key];
            } else {
                console.warn(`Tradução não encontrada para a chave: ${key}`);
            }
        });
        
        // Atualizar placeholders dos inputs
        document.querySelectorAll("input[data-placeholder-i18n]").forEach(input => {
            const placeholderKey = input.getAttribute("data-placeholder-i18n");
            if (placeholderKey && texts[placeholderKey]) {
                input.placeholder = texts[placeholderKey];
            }
        });
        
        // Atualizar textos dos botões
        document.querySelectorAll("button[data-btn-i18n], a[data-btn-i18n]").forEach(button => {
            const btnKey = button.getAttribute("data-btn-i18n");
            if (btnKey && texts[btnKey]) {
                // Verificar se o botão tem um ícone
                const icon = button.querySelector("i");
                if (icon) {
                    // Manter o ícone e atualizar apenas o texto
                    const iconHTML = icon.outerHTML;
                    button.innerHTML = iconHTML + " " + texts[btnKey];
                } else {
                    button.textContent = texts[btnKey];
                }
            }
        });
        
        console.log("Textos da interface atualizados com sucesso");
    } catch (error) {
        console.error("Erro ao atualizar textos da interface:", error);
    }
}

// Garante que existam traduções para modo escuro/claro
function ensureDarkModeTranslations() {
    if (!translations) return;
    
    // Adicionar traduções para o modo escuro/claro
    if (translations.pt) {
        translations.pt.darkMode = "Modo Escuro";
        translations.pt.lightMode = "Modo Claro";
    }
    if (translations.es) {
        translations.es.darkMode = "Modo Oscuro";
        translations.es.lightMode = "Modo Claro";
    }
    if (translations.en) {
        translations.en.darkMode = "Dark Mode";
        translations.en.lightMode = "Light Mode";
    }
    if (translations.de) {
        translations.de.darkMode = "Dunkler Modus";
        translations.de.lightMode = "Hellmodus";
    }
    if (translations.fr) {
        translations.fr.darkMode = "Mode Sombre";
        translations.fr.lightMode = "Mode Clair";
    }
    if (translations.ja) {
        translations.ja.darkMode = "ダークモード";
        translations.ja.lightMode = "ライトモード";
    }
}

// Função para mudar o idioma
export function changeLanguage(lang) {
    console.log("Alterando idioma para:", lang);
    
    // Verificar se o idioma é suportado
    if (!CONFIG || !CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
        console.error(`Idioma não suportado: ${lang}`);
        return;
    }
    
    // Atualizar estado interno
    languageState.currentLanguage = lang;
    
    // Salvar a preferência do usuário
    localStorage.setItem(CONFIG.LANGUAGE_KEY, lang);
    
    // Atualizar os textos da interface
    updateInterfaceTextsInternal(lang);
    
    // Atualizar as marcações de seleção
    updateLanguageCheckmarks(lang);
    
    // Forçar atualização dos dados para que elementos gerados dinamicamente sejam traduzidos
    if (window.forceDataUpdate) {
        console.log("Forçando atualização dos dados para aplicar traduções em elementos dinâmicos");
        setTimeout(() => {
            window.forceDataUpdate();
        }, 100); // Pequeno atraso para garantir que as traduções estejam aplicadas
    }
}

// Atualizar os ícones de verificação no menu de idiomas
function updateLanguageCheckmarks(lang) {
    try {
        // Remover todos os ícones de verificação
        document.querySelectorAll('.language-option i.fas.fa-check').forEach(icon => {
            icon.style.visibility = 'hidden';
        });
        
        // Adicionar ícone de verificação ao idioma selecionado
        const selectedLangOption = document.querySelector(`.language-option[data-lang="${lang}"] i.fas.fa-check`);
        if (selectedLangOption) {
            selectedLangOption.style.visibility = 'visible';
        }
    } catch (error) {
        console.error("Erro ao atualizar checkmarks de idioma:", error);
    }
}

// Obter o idioma da URL, localStorage, ou usar o padrão
function getPreferredLanguage() {
    try {
        // Verificar parâmetro de URL
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        // Verificar localStorage
        const storedLang = localStorage.getItem('language') || (CONFIG && localStorage.getItem(CONFIG.LANGUAGE_KEY));
        
        // Determinar o idioma suportado
        const supportedLanguages = CONFIG ? CONFIG.SUPPORTED_LANGUAGES : ['pt', 'es', 'de', 'fr', 'ja'];
        
        // Retornar o idioma na seguinte ordem de prioridade:
        // 1. Parâmetro URL (se válido)
        // 2. Local Storage (se válido)
        // 3. Idioma padrão (pt)
        if (langParam && supportedLanguages.includes(langParam)) {
            return langParam;
        }
        
        if (storedLang && supportedLanguages.includes(storedLang)) {
            return storedLang;
        }
        
        return "pt"; // Idioma padrão
    } catch (error) {
        console.error("Erro ao obter idioma preferido:", error);
        return "pt"; // Fallback para português
    }
}

// Inicializar o sistema de idiomas
export function initializeLanguageSystem() {
    console.log("Inicializando sistema de idiomas simplificado...");
    
    // Carregar as traduções e depois inicializar
    loadTranslations().then(() => {
        // Obter o idioma preferido
        const preferredLanguage = getPreferredLanguage();
        
        // Atualizar o idioma atual
        languageState.currentLanguage = preferredLanguage;
        
        // Aplicar as traduções
        updateInterfaceTextsInternal(preferredLanguage);
        
        // Atualizar ícones de verificação
        updateLanguageCheckmarks(preferredLanguage);
        
        console.log("Sistema de idiomas inicializado com sucesso!");
    });
}

// Configurar event listeners para os botões de idioma
export function setupLanguageEventListeners() {
    console.log("Configurando event listeners para idiomas...");
    
    try {
        // Selecionar todos os botões de idioma
        const languageOptions = document.querySelectorAll('.language-option');
        
        // Adicionar event listener para cada opção de idioma
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obter o código do idioma
                const lang = this.getAttribute('data-lang');
                
                if (!lang) {
                    console.error("Atributo data-lang não encontrado");
                    return;
                }
                
                console.log("Opção de idioma clicada:", lang);
                
                // Mudar o idioma
                changeLanguage(lang);
            });
        });
    } catch (error) {
        console.error("Erro ao configurar event listeners de idioma:", error);
    }
}

// Exportar todas as funções necessárias
export {
    updateInterfaceTextsInternal
};

// Disponibilizar funções globalmente
window.updateInterfaceTexts = updateInterfaceTexts;
window.changeLanguage = changeLanguage;
window.initializeLanguageSystem = initializeLanguageSystem;
window.setupLanguageEventListeners = setupLanguageEventListeners;
