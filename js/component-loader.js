/**
 * Component Loader
 * 
 * Este script carrega componentes HTML dinamicamente.
 */

// Função para carregar um componente HTML em um elemento
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${componentPath}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        return false;
    }
}

// Função para substituir elementos com atributo data-component
async function loadAllComponents() {
    const componentElements = document.querySelectorAll('[data-component]');
    
    const promises = Array.from(componentElements).map(element => {
        const componentPath = element.getAttribute('data-component');
        const elementId = element.id;
        
        if (!elementId) {
            console.error('Element must have an ID to load a component:', element);
            return Promise.resolve(false);
        }
        
        return loadComponent(elementId, componentPath);
    });
    
    await Promise.all(promises);
    
    // Disparar evento de carregamento de componentes concluído
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
}

// Exportar funções
export { loadComponent, loadAllComponents }; 