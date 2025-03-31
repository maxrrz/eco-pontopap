# Estado dos Ecopontos - Monitorização em Tempo Real

![Captura de Ecrã](photos/Cabecalho.JPG)

Projeto desenvolvido para a PAP (Prova de Aptidão Profissional) de Maximilian Guimaro que monitoriza o estado de ecopontos em tempo real.

## Funcionalidades Principais

- 🟡 **Monitorização de Capacidade**: Visualização em tempo real dos níveis dos ecopontos Amarelo, Verde e Azul
- 🔄 **Atualização Automática**: Dados renovados a cada segundo
- 🌓 **Modo Escuro**: Alternância entre temas claro e escuro com guarda de preferências
- 📊 **Barras Interativas**: Representação visual dinâmica da capacidade disponível
- 📶 **Estado da Ligação**: Indicação visual do estado de conexão ao servidor

## Tecnologias Utilizadas

- HTML5
- CSS3 (com animações e transições)
- JavaScript ES6
- Font Awesome (ícones)
- GitHub Pages (alojamento do JSON)

## Pré-requisitos

- Browser moderno (Chrome, Firefox, Edge)
- Ligação à Internet para carregamento de ícones e dados

# EcoPontoPAP - Progressive Web App

Este projeto foi transformado em um Progressive Web App (PWA), permitindo que os usuários instalem a aplicação em seus dispositivos e acessem-na mesmo quando estiverem offline.

## Configuração do PWA

Para completar a configuração do PWA, siga estas etapas:

### 1. Criar os ícones do aplicativo

Você precisa criar dois ícones para o PWA:

- `images/icon-192x192.png` (192x192 pixels)
- `images/icon-512x512.png` (512x512 pixels)

Estes ícones são referenciados no arquivo `manifest.json` e são necessários para que o navegador exiba o ícone do aplicativo quando instalado.

### 2. Testar a instalação do PWA

Para testar se o PWA está funcionando corretamente:

1. Abra a aplicação em um navegador compatível com PWA (Chrome, Edge, Firefox, Safari)
2. No menu da aplicação, deve aparecer a opção "Instalar Aplicação"
3. Clique nesta opção para instalar o aplicativo no seu dispositivo

### 3. Verificar o funcionamento offline

Para verificar se o aplicativo funciona offline:

1. Instale o aplicativo no seu dispositivo
2. Desconecte-se da internet
3. Abra o aplicativo instalado
4. Verifique se as funcionalidades básicas continuam funcionando

## Recursos do PWA

- **Instalável**: Os usuários podem instalar o aplicativo em seus dispositivos
- **Offline**: O aplicativo continua funcionando mesmo sem conexão com a internet
- **Responsivo**: Adaptado para diferentes tamanhos de tela
- **Atualização automática**: O service worker atualiza automaticamente o cache quando há novas versões

## Tecnologias utilizadas

- HTML5, CSS3, JavaScript
- Service Worker para cache e funcionamento offline
- Web App Manifest para instalação

## Suporte a navegadores

O PWA é suportado nos seguintes navegadores:

- Google Chrome (Desktop e Mobile)
- Microsoft Edge
- Firefox
- Safari (iOS 11.3+)

## Problemas conhecidos

- Em alguns navegadores mais antigos, a funcionalidade PWA pode não estar disponível
- No iOS, algumas funcionalidades do PWA podem ser limitadas
