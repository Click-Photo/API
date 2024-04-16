const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Rotas do clientes
const clienteController = require('./controllers/Cliente');

//Rotas de crud padrão:
router.post('/cadastro', clienteController.createClientes);
router.post('/alterar',clienteController.updateClientes);
router.post('/deletar',clienteController.deleteClientes);
router.post('/visualizar',clienteController.getAllClientes);

//Metódos:
router.post('/solicitarTrocaSenha',clienteController.requisitarResetSenha);
router.post('/redefinirSenha',clienteController.resetSenha);
router.post('/autenticacao',clienteController.autenticacaoLogin);
router.post('/validaToken',clienteController.verificarToken);


module.exports = router;
