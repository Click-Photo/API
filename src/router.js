const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Rotas
const clienteController = require('./controllers/Cliente');
const fotografoController = require('./controllers/Fotografo');

//Rotas de crud cliente:
router.post('/cadastroCliente', clienteController.createClientes);
router.post('/alterarCliente/:id',clienteController.updateClientes);
router.post('/deletarCliente/:id',clienteController.deleteClientes);
router.post('/visualizarCliente',clienteController.getAllClientes);

//Metódos:
// router.post('/solicitarTrocaSenha',clienteController.requisitarResetSenha);
// router.post('/redefinirSenha/:id',clienteController.resetSenha);
// router.post('/autenticacao',clienteController.autenticacaoLogin);
// router.post('/validaToken',clienteController.verificarToken);

//Rotas de crud  fotografo:
router.post('/cadastroFotografo',fotografoController.createFotografo);
router.post('/alterarFotografo/:id',fotografoController.updateFotografo);
router.post('/deletarfotografo/:id',fotografoController.deleteFotografo);
router.post('/visualizarFotografo',fotografoController.getAllFotografos);

module.exports = router;
