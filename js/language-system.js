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

    // Atualizar a URL para incluir o código do idioma
    const currentPath = window.location.pathname;
    const currentHost = window.location.host;
    const protocol = window.location.protocol;
    const currentSearch = window.location.search;
    
    // Criar ou atualizar o parâmetro 'lang' na URL, preservando outros parâmetros
    const searchParams = new URLSearchParams(currentSearch);
    searchParams.set('lang', lang);
    
    // Construir a nova URL usando parâmetros de query
    const newURL = `${protocol}//${currentHost}${currentPath}?${searchParams.toString()}`;
    
    // Atualizar a URL sem recarregar a página
    window.history.pushState({lang: lang}, '', newURL);
    
    // Forçar atualização dos dados para que elementos gerados dinamicamente sejam traduzidos
    if (window.forceDataUpdate) {
        console.log("Forçando atualização dos dados para aplicar traduções em elementos dinâmicos");
        setTimeout(() => {
            window.forceDataUpdate();
        }, 100); // Pequeno atraso para garantir que as traduções estejam aplicadas
    }

    // Atualizar o conteúdo HTML com base no idioma atual
    updateContent();
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
        // Verificar parâmetro de URL (prioridade máxima)
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        const supportedLanguages = CONFIG ? CONFIG.SUPPORTED_LANGUAGES : ['pt', 'de', 'ja', 'zh'];
        
        // Verificar localStorage
        const storedLang = localStorage.getItem('language') || (CONFIG && localStorage.getItem(CONFIG.LANGUAGE_KEY));
        
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
        
        // Verificar se a URL já tem o parâmetro de idioma
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        // Se não tiver o parâmetro lang ou se for diferente do idioma preferido, adicionar
        if (!langParam || langParam !== preferredLanguage) {
            // Configurar o parâmetro de URL sem recarregar a página, preservando outros parâmetros
            urlParams.set('lang', preferredLanguage);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({lang: preferredLanguage}, '', newUrl);
        }
        
        // Aplicar as traduções
        updateInterfaceTextsInternal(preferredLanguage);
        
        // Atualizar ícones de verificação
        updateLanguageCheckmarks(preferredLanguage);
        
        // Ajustar links internos para preservar o parâmetro de idioma
        setupLinkInterceptor(preferredLanguage);
        
        console.log("Sistema de idiomas inicializado com sucesso!");
    });
}

// Configurar interceptador de cliques em links para preservar o parâmetro de idioma
function setupLinkInterceptor(currentLang) {
    console.log("Configurando interceptador de links para preservar idioma...");
    
    try {
        // Remover listener anterior, se existir
        if (window.languageLinkHandler) {
            document.body.removeEventListener('click', window.languageLinkHandler);
        }
        
        // Função para manipular cliques em links
        const linkHandler = function(e) {
            // Verificar se o clique foi em um link
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Ignorar links externos, âncoras, e-mails, links de idioma, ou links que abrem em nova janela
            if (href.startsWith('http') || 
                href.startsWith('#') || 
                href.startsWith('mailto:') || 
                link.classList.contains('language-option') ||
                link.getAttribute('target') === '_blank') {
                return;
            }
            
            // Prevenir navegação padrão
            e.preventDefault();
            
            // Construir nova URL com parâmetro de idioma
            let url = new URL(href, window.location.origin);
            
            // Preservar o parâmetro de idioma atual
            url.searchParams.set('lang', currentLang);
            
            // Preservar outros parâmetros importantes da URL atual (exceto o idioma)
            const currentParams = new URLSearchParams(window.location.search);
            for (const [key, value] of currentParams.entries()) {
                if (key !== 'lang' && !url.searchParams.has(key)) {
                    url.searchParams.set(key, value);
                }
            }
            
            // Navegar para a nova URL
            window.location.href = url.toString();
        };
        
        // Armazenar o handler para remover posteriormente, se necessário
        window.languageLinkHandler = linkHandler;
        
        // Adicionar listener para cliques em todo o documento
        document.body.addEventListener('click', linkHandler);
        
        console.log("Interceptador de links configurado com sucesso");
    } catch (error) {
        console.error("Erro ao configurar interceptador de links:", error);
    }
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

// Atualizar o conteúdo HTML com base no idioma atual
function updateContent() {
    const currentLang = languageState.currentLanguage;
    const translationsObj = translations[currentLang] || translations.pt;
    
    // Atualizar elementos com atributo data-lang
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translationsObj[key]) {
            el.textContent = translationsObj[key];
        }
    });
    
    // Atualizar placeholders com atributo data-lang-placeholder
    const placeholderElements = document.querySelectorAll('[data-lang-placeholder]');
    placeholderElements.forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        if (translationsObj[key]) {
            el.setAttribute('placeholder', translationsObj[key]);
        }
    });
    
    // Atualizar elementos com data-lang-html (para conteúdo HTML)
    const htmlElements = document.querySelectorAll('[data-lang-html]');
    htmlElements.forEach(el => {
        const key = el.getAttribute('data-lang-html');
        if (translationsObj[key]) {
            el.innerHTML = translationsObj[key];
        }
    });
    
    // Atualizar titles com data-lang-title
    const titleElements = document.querySelectorAll('[data-lang-title]');
    titleElements.forEach(el => {
        const key = el.getAttribute('data-lang-title');
        if (translationsObj[key]) {
            el.setAttribute('title', translationsObj[key]);
        }
    });
    
    // Atualizar notificações se o menuManager existir
    if (window.menuManager) {
        window.menuManager.updateNotificationsLanguage();
    }
    
    // Disparar evento personalizado para informar que os idiomas foram atualizados
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: currentLang }
    }));
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

// Definir o idioma atual
function setLanguage(lang) {
    if (!CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
        console.warn(`Idioma não suportado: ${lang}. Usando o idioma padrão (pt).`);
        lang = 'pt';
    }
    
    languageState.currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    
    // Atualizar URLs que contêm parâmetro lang=
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('lang')) {
        currentUrl.searchParams.set('lang', lang);
        window.history.replaceState({}, '', currentUrl.toString());
    }
    
    // Atualizar o conteúdo da página
    updateContent();
    
    // Debug: Exibir idioma atual
    console.log(`Idioma definido: ${lang}`);
    
    return lang;
}
