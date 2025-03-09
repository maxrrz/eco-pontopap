/**
 * language-system.js
 * Sistema de tradução para o projeto EcoPonto
 * Suporta mudança de idioma com atualização de URL
 */

// Verificar se os módulos estão sendo importados corretamente
console.log("Carregando sistema de idiomas...");

// Importar as configurações e traduções
let CONFIG, translations;
try {
    import("./config.js").then(module => {
        CONFIG = module.CONFIG;
        translations = module.translations;
        
        // Garantir que o termo "Password" seja mantido em português
        if (translations.pt && translations.pt.password) {
            translations.pt.password = "Password";
        }
        
        // Garantir que os termos específicos sejam mantidos em português de Portugal
        if (translations.pt) {
            // Manter "Guardar sessão" e "Esqueceste-te da palavra-passe?"
            translations.pt.rememberMe = "Guardar sessão";
            translations.pt.forgotPassword = "Esqueceste-te da palavra-passe?";
        }
        
        console.log("CONFIG e traduções carregados com sucesso");
        console.log("Idiomas suportados:", CONFIG.SUPPORTED_LANGUAGES);
        
        // Inicializar automaticamente se já houver elementos no DOM
        if (document.readyState === "complete" || document.readyState === "interactive") {
            console.log("Documento já carregado, inicializando sistema de idiomas imediatamente");
            setTimeout(initializeLanguageSystem, 0);
        }
    }).catch(error => {
        console.error("Erro ao importar configurações:", error);
    });
} catch(e) {
    console.error("Erro ao carregar config.js:", e);
}

// Estado do sistema de idiomas
const languageState = {
    currentLanguage: "pt" // Idioma padrão
};

// Inicializar o sistema de idiomas quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM carregado, inicializando sistema de idiomas...");
    setTimeout(() => {
        try {
            initializeLanguageSystem();
        } catch (error) {
            console.error("Erro ao inicializar sistema de idiomas:", error);
        }
    }, 100);
    setTimeout(() => {
        try {
            setupLanguageEventListeners();
        } catch (error) {
            console.error("Erro ao configurar event listeners dos idiomas:", error);
        }
    }, 100);
});

/**
 * Obtém o idioma da URL atual (do parâmetro de consulta)
 * @returns {string} Código do idioma
 */
function getLanguageFromUrl() {
    console.log("Obtendo idioma da URL...");
    
    try {
        // Obter o parâmetro de consulta "lang"
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        console.log("Parâmetro de idioma da URL:", langParam);
        
        // Verificar se o parâmetro é um código de idioma válido
        if (!CONFIG || !CONFIG.SUPPORTED_LANGUAGES) {
            console.error("CONFIG ou SUPPORTED_LANGUAGES não definidos");
            return "pt"; // Fallback para português
        }
        
        const validLanguages = CONFIG.SUPPORTED_LANGUAGES;
        if (langParam && validLanguages.includes(langParam)) {
            console.log("Idioma válido encontrado na URL:", langParam);
            return langParam;
        }
        
        // Se não encontrar um idioma válido na URL, tentar obter do localStorage
        const storedLang = localStorage.getItem(CONFIG.LANGUAGE_KEY);
        if (storedLang && validLanguages.includes(storedLang)) {
            console.log("Idioma encontrado no localStorage:", storedLang);
            return storedLang;
        }
        
        // Se não encontrar nem na URL nem no localStorage, retornar o idioma padrão
        console.log("Usando idioma padrão:", CONFIG.DEFAULT_LANGUAGE);
        return CONFIG.DEFAULT_LANGUAGE;
    } catch (error) {
        console.error("Erro ao obter idioma da URL:", error);
        return "pt"; // Fallback para português em caso de erro
    }
}

/**
 * Muda o idioma e atualiza a URL
 * @param {string} lang - Código do idioma
 */
function changeLanguage(lang) {
    console.log("Mudando idioma para:", lang);
    
    try {
        // Verificar se o idioma é válido
        if (!CONFIG || !CONFIG.SUPPORTED_LANGUAGES) {
            console.error("CONFIG ou SUPPORTED_LANGUAGES não definidos");
            return;
        }
        
        const validLanguages = CONFIG.SUPPORTED_LANGUAGES;
        if (!validLanguages.includes(lang)) {
            console.error(`Idioma inválido: ${lang}`);
            return;
        }
        
        // Verificar se há traduções complementares a serem adicionadas
        addMissingTranslations();
        
        // Atualizar o idioma atual
        languageState.currentLanguage = lang;
        
        // Salvar a preferência de idioma
        localStorage.setItem(CONFIG.LANGUAGE_KEY, lang);
        
        // Construir a nova URL com o parâmetro de consulta lang
        const currentUrl = new URL(window.location.href);
        
        // Definir o parâmetro lang na URL
        currentUrl.searchParams.set('lang', lang);
        
        console.log("Atualizando URL para:", currentUrl.toString());
        
        // Atualizar a URL sem recarregar a página
        window.history.pushState({}, "", currentUrl.toString());
        
        // Atualizar os textos da interface
        updateInterfaceTexts(lang);
        
        // Atualizar o ícone de verificação no menu de idiomas
        updateLanguageCheckmarks(lang);
        
        console.log(`Idioma alterado para: ${lang}`);
        
        // Forçar uma segunda atualização após um pequeno delay
        // Para garantir que todos os elementos sejam traduzidos corretamente
        setTimeout(() => {
            console.log("Verificação adicional de tradução após mudança de idioma...");
            updateInterfaceTexts(lang);
        }, 500);
    } catch (error) {
        console.error("Erro ao mudar idioma:", error);
    }
}

/**
 * Atualiza os ícones de verificação no menu de idiomas
 * @param {string} lang - Código do idioma selecionado
 */
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

/**
 * Atualiza os textos da interface com base no idioma
 * @param {string} lang - Código do idioma
 */
function updateInterfaceTexts(lang) {
    console.log("Atualizando textos da interface para idioma:", lang);
    
    try {
        // Verificar se temos as traduções carregadas
        if (!translations) {
            console.error("Traduções não carregadas");
            return;
        }
        
        // Verificar se o idioma é suportado
        if (!translations[lang]) {
            console.error(`Traduções não encontradas para o idioma: ${lang}`);
            return;
        }
        
        // Obter as traduções para o idioma selecionado
        const texts = translations[lang];
        console.log("Textos de tradução carregados");
        
        // Atualizar os textos da interface
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            if (texts[key]) {
                console.debug(`Traduzindo elemento [${element.tagName}] com chave [${key}] para: "${texts[key]}"`);
                element.textContent = texts[key];
            } else {
                console.warn(`Tradução não encontrada para a chave: ${key}`);
            }
        });
        
        // Atualizar placeholders dos inputs
        document.querySelectorAll("input[data-placeholder-i18n]").forEach(input => {
            const placeholderKey = input.getAttribute("data-placeholder-i18n");
            if (placeholderKey && texts[placeholderKey]) {
                console.debug(`Traduzindo placeholder com chave [${placeholderKey}] para: "${texts[placeholderKey]}"`);
                input.placeholder = texts[placeholderKey];
            } else {
                console.warn(`Tradução não encontrada para o placeholder: ${placeholderKey}`);
            }
        });
        
        // Atualizar textos dos botões - processa tanto botões quanto links
        document.querySelectorAll("button[data-btn-i18n], a[data-btn-i18n], button[data-i18n], a[data-i18n]").forEach(button => {
            // Primeiro verificar data-btn-i18n, depois data-i18n
            const btnKey = button.getAttribute("data-btn-i18n") || button.getAttribute("data-i18n");
            
            if (btnKey && texts[btnKey]) {
                console.debug(`Traduzindo botão com chave [${btnKey}] para: "${texts[btnKey]}"`);
                
                // Verificar se o botão tem um ícone
                const icon = button.querySelector("i");
                if (icon) {
                    // Manter o ícone e atualizar apenas o texto
                    const iconHTML = icon.outerHTML;
                    button.innerHTML = iconHTML + " " + texts[btnKey];
                } else {
                    button.textContent = texts[btnKey];
                }
            } else if (btnKey) {
                console.warn(`Tradução não encontrada para botão com chave: ${btnKey}`);
            }
        });
        
        // Atualizar textos específicos de elementos com classes específicas
        document.querySelectorAll(".login-divider span").forEach(element => {
            if (texts["or"]) {
                console.debug(`Traduzindo separador "ou" para: "${texts["or"]}"`);
                element.textContent = texts["or"];
            }
        });
        
        // Atualizar textos de benefícios
        const benefitItems = document.querySelectorAll(".benefit-item span");
        const benefitKeys = ["benefit1", "benefit2", "benefit3"];
        
        benefitItems.forEach((item, index) => {
            if (index < benefitKeys.length && texts[benefitKeys[index]]) {
                console.debug(`Traduzindo benefício ${index+1} para: "${texts[benefitKeys[index]]}"`);
                item.textContent = texts[benefitKeys[index]];
            }
        });
        
        console.log("Textos da interface atualizados com sucesso");
    } catch (error) {
        console.error("Erro ao atualizar textos da interface:", error);
    }
}

/**
 * Inicializa o sistema de idiomas
 */
export function initializeLanguageSystem() {
    console.log("Inicializando sistema de idiomas...");
    
    try {
        // Verificar se temos as configurações e traduções carregadas
        if (!CONFIG || !translations) {
            console.warn("CONFIG ou traduções ainda não carregados. Aguardando...");
            // Tentar novamente em 500ms
            setTimeout(initializeLanguageSystem, 500);
            return;
        }
        
        // Verificar se há traduções complementares a serem adicionadas
        addMissingTranslations();
        
        // Obter o idioma da URL ou localStorage ou usar o padrão
        let currentLang = getLanguageFromUrl();
        languageState.currentLanguage = currentLang;
        
        console.log("Idioma atual:", currentLang);
        
        // Atualizar os textos da interface
        updateInterfaceTexts(currentLang);
        
        // Atualizar ícones de verificação
        updateLanguageCheckmarks(currentLang);
        
        console.log("Sistema de idiomas inicializado com sucesso");
        
        // Se o idioma não estiver na URL, atualizar a URL
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('lang')) {
            // Construir a nova URL com o parâmetro de consulta lang
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('lang', currentLang);
            
            // Atualizar a URL sem recarregar a página
            window.history.replaceState({}, "", currentUrl.toString());
            console.log("URL atualizada com o idioma atual:", currentUrl.toString());
        }
        
        // Forçar uma atualização adicional após um pequeno delay
        // Isso garante que todos os elementos recebam a tradução mesmo em casos de carregamento tardio
        setTimeout(() => {
            console.log("Realizando verificação final de tradução...");
            updateInterfaceTexts(currentLang);
        }, 1000);
    } catch (error) {
        console.error("Erro ao inicializar sistema de idiomas:", error);
    }
}

/**
 * Configura os event listeners para mudança de idioma
 */
export function setupLanguageEventListeners() {
    console.log("Configurando event listeners para idiomas...");
    
    try {
        // Verificar se as configurações estão carregadas
        if (!CONFIG) {
            console.warn("CONFIG ainda não carregado. Aguardando...");
            // Tentar novamente em 500ms
            setTimeout(setupLanguageEventListeners, 500);
            return;
        }
        
        // Obter todos os links de idioma
        const languageOptions = document.querySelectorAll('.language-option');
        
        // Adicionar event listener para cada opção de idioma
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obter o código do idioma do atributo data-lang
                const lang = this.getAttribute('data-lang');
                
                if (!lang) {
                    console.error("Atributo data-lang não encontrado no elemento:", this);
                    return;
                }
                
                console.log("Opção de idioma clicada:", lang);
                
                // Mudar o idioma
                changeLanguage(lang);
                
                // Fechar o dropdown (se estiver aberto)
                const dropdown = document.querySelector('.language-dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            });
        });
        
        console.log("Event listeners para idiomas configurados com sucesso");
    } catch (error) {
        console.error("Erro ao configurar event listeners para idiomas:", error);
    }
}

// Adicionar traduções complementares para partes específicas da interface
function addMissingTranslations() {
    // Adicionar traduções para "ou" em todos os idiomas
    if (translations) {
        if (translations.pt && !translations.pt.or) translations.pt.or = "ou";
        if (translations.es && !translations.es.or) translations.es.or = "o";
        if (translations.en && !translations.en.or) translations.en.or = "or";
        if (translations.de && !translations.de.or) translations.de.or = "oder";
        if (translations.fr && !translations.fr.or) translations.fr.or = "ou";
        if (translations.ja && !translations.ja.or) translations.ja.or = "または";
        
        // Adicionar traduções para login
        if (translations.pt && !translations.pt.loginTitle) translations.pt.loginTitle = "Entra na tua conta myEcoPonto!";
        if (translations.es && !translations.es.loginTitle) translations.es.loginTitle = "¡Inicia sesión en tu cuenta myEcoPonto!";
        if (translations.en && !translations.en.loginTitle) translations.en.loginTitle = "Sign in to your myEcoPonto account!";
        if (translations.de && !translations.de.loginTitle) translations.de.loginTitle = "Melde dich in deinem myEcoPonto-Konto an!";
        if (translations.fr && !translations.fr.loginTitle) translations.fr.loginTitle = "Connectez-vous à votre compte myEcoPonto!";
        if (translations.ja && !translations.ja.loginTitle) translations.ja.loginTitle = "myEcoPontoアカウントにログイン！";
        
        // Adicionar traduções para benefícios
        if (translations.pt && !translations.pt.benefit1) translations.pt.benefit1 = "Acompanha os níveis de enchimento em tempo real";
        if (translations.es && !translations.es.benefit1) translations.es.benefit1 = "Sigue los niveles de llenado en tiempo real";
        if (translations.en && !translations.en.benefit1) translations.en.benefit1 = "Track filling levels in real time";
        if (translations.de && !translations.de.benefit1) translations.de.benefit1 = "Verfolge die Füllstände in Echtzeit";
        if (translations.fr && !translations.fr.benefit1) translations.fr.benefit1 = "Suivez les niveaux de remplissage en temps réel";
        if (translations.ja && !translations.ja.benefit1) translations.ja.benefit1 = "リアルタイムで充填レベルを追跡";
        
        if (translations.pt && !translations.pt.benefit2) translations.pt.benefit2 = "Recebe notificações quando os ecopontos estiverem quase cheios";
        if (translations.es && !translations.es.benefit2) translations.es.benefit2 = "Recibe notificaciones cuando los ecopuntos estén casi llenos";
        if (translations.en && !translations.en.benefit2) translations.en.benefit2 = "Receive notifications when ecopoints are almost full";
        if (translations.de && !translations.de.benefit2) translations.de.benefit2 = "Erhalte Benachrichtigungen, wenn Ecopunkte fast voll sind";
        if (translations.fr && !translations.fr.benefit2) translations.fr.benefit2 = "Recevez des notifications lorsque les éco-points sont presque pleins";
        if (translations.ja && !translations.ja.benefit2) translations.ja.benefit2 = "エコポイントがほぼ満杯になると通知を受け取る";
        
        if (translations.pt && !translations.pt.benefit3) translations.pt.benefit3 = "Acede a estatísticas e histórico de recolhas";
        if (translations.es && !translations.es.benefit3) translations.es.benefit3 = "Accede a estadísticas e historial de recogidas";
        if (translations.en && !translations.en.benefit3) translations.en.benefit3 = "Access statistics and collection history";
        if (translations.de && !translations.de.benefit3) translations.de.benefit3 = "Zugriff auf Statistiken und Sammlungsverlauf";
        if (translations.fr && !translations.fr.benefit3) translations.fr.benefit3 = "Accédez aux statistiques et à l'historique des collectes";
        if (translations.ja && !translations.ja.benefit3) translations.ja.benefit3 = "統計と収集履歴にアクセス";
        
        // Adicionar traduções para "Regista-te agora"
        if (translations.pt && !translations.pt.registerTitle) translations.pt.registerTitle = "Ainda não tens conta?";
        if (translations.es && !translations.es.registerTitle) translations.es.registerTitle = "¿Aún no tienes cuenta?";
        if (translations.en && !translations.en.registerTitle) translations.en.registerTitle = "Don't have an account yet?";
        if (translations.de && !translations.de.registerTitle) translations.de.registerTitle = "Noch kein Konto?";
        if (translations.fr && !translations.fr.registerTitle) translations.fr.registerTitle = "Vous n'avez pas encore de compte?";
        if (translations.ja && !translations.ja.registerTitle) translations.ja.registerTitle = "アカウントをお持ちでないですか？";
        
        if (translations.pt && !translations.pt.registerSubtitle1) translations.pt.registerSubtitle1 = "Regista-te agora!";
        if (translations.es && !translations.es.registerSubtitle1) translations.es.registerSubtitle1 = "¡Regístrate ahora!";
        if (translations.en && !translations.en.registerSubtitle1) translations.en.registerSubtitle1 = "Register now!";
        if (translations.de && !translations.de.registerSubtitle1) translations.de.registerSubtitle1 = "Registriere dich jetzt!";
        if (translations.fr && !translations.fr.registerSubtitle1) translations.fr.registerSubtitle1 = "Inscrivez-vous maintenant!";
        if (translations.ja && !translations.ja.registerSubtitle1) translations.ja.registerSubtitle1 = "今すぐ登録！";
        
        if (translations.pt && !translations.pt.registerSubtitle2) translations.pt.registerSubtitle2 = "Fácil e Rápido!";
        if (translations.es && !translations.es.registerSubtitle2) translations.es.registerSubtitle2 = "¡Fácil y Rápido!";
        if (translations.en && !translations.en.registerSubtitle2) translations.en.registerSubtitle2 = "Easy and Fast!";
        if (translations.de && !translations.de.registerSubtitle2) translations.de.registerSubtitle2 = "Einfach und Schnell!";
        if (translations.fr && !translations.fr.registerSubtitle2) translations.fr.registerSubtitle2 = "Facile et Rapide!";
        if (translations.ja && !translations.ja.registerSubtitle2) translations.ja.registerSubtitle2 = "簡単・迅速！";
        
        // Adicionar traduções para botão de login do Google
        if (translations.pt && !translations.pt.googleLogin) translations.pt.googleLogin = "Entrar com o Google";
        if (translations.es && !translations.es.googleLogin) translations.es.googleLogin = "Iniciar sesión con Google";
        if (translations.en && !translations.en.googleLogin) translations.en.googleLogin = "Sign in with Google";
        if (translations.de && !translations.de.googleLogin) translations.de.googleLogin = "Mit Google anmelden";
        if (translations.fr && !translations.fr.googleLogin) translations.fr.googleLogin = "Se connecter avec Google";
        if (translations.ja && !translations.ja.googleLogin) translations.ja.googleLogin = "Googleでログイン";
        
        // Adicionar traduções para o botão de login
        if (translations.pt && !translations.pt.loginButton) translations.pt.loginButton = "INICIAR SESSÃO";
        if (translations.es && !translations.es.loginButton) translations.es.loginButton = "INICIAR SESIÓN";
        if (translations.en && !translations.en.loginButton) translations.en.loginButton = "SIGN IN";
        if (translations.de && !translations.de.loginButton) translations.de.loginButton = "ANMELDEN";
        if (translations.fr && !translations.fr.loginButton) translations.fr.loginButton = "SE CONNECTER";
        if (translations.ja && !translations.ja.loginButton) translations.ja.loginButton = "ログイン";
        
        // Adicionar traduções para o botão de criar conta
        if (translations.pt && !translations.pt.createAccount) translations.pt.createAccount = "CRIAR CONTA";
        if (translations.es && !translations.es.createAccount) translations.es.createAccount = "CREAR CUENTA";
        if (translations.en && !translations.en.createAccount) translations.en.createAccount = "CREATE ACCOUNT";
        if (translations.de && !translations.de.createAccount) translations.de.createAccount = "KONTO ERSTELLEN";
        if (translations.fr && !translations.fr.createAccount) translations.fr.createAccount = "CRÉER UN COMPTE";
        if (translations.ja && !translations.ja.createAccount) translations.ja.createAccount = "アカウント作成";
        
        // Garantir que "email" e "password" se mantêm em inglês para português
        if (translations.pt) {
            translations.pt.email = "Email";
            translations.pt.password = "Password";
            // Garantir que esses termos permaneçam em português de Portugal
            translations.pt.rememberMe = "Guardar sessão";
            translations.pt.forgotPassword = "Esqueceste-te da palavra-passe?";
        }
        
        console.log("Traduções complementares adicionadas com sucesso");
    }
}

// Adicionar traduções complementares quando o módulo for carregado
setTimeout(addMissingTranslations, 300);

// Exportar funções para uso externo
export {
    changeLanguage,
    getLanguageFromUrl,
    updateInterfaceTexts
};
