// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta raiz
app.use(express.static(path.join(__dirname, './')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rotas limpas sem extensão .html
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `${page}.html`);
    
    // Verifica se o arquivo existe e o envia
    res.sendFile(filePath, (err) => {
        if (err) {
            // Se o arquivo não existir, passa para o próximo middleware
            next();
        }
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Para acessar no seu telefone, use o IP do seu computador: http://188.250.181.176:${PORT}`);
});