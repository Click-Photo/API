const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Rotas
const clienteController = require('./controllers/Cliente');
const fotografoController = require('./controllers/Fotografo');
const confirmaClienteController = require ('./controllers/ConfirmaCliente');
const confirmaFotografoController = require ('./controllers/ConfirmaFotografo');
const jobsController = require ('./controllers/Jobs')

//Rotas do Controller Jobs
router.post('/criarJob',jobsController.createJob);
router.post('/editarJob/:id',jobsController.updateJob);
router.post('/deleteJob/:id',jobsController.deleteJob);
router.post('/visualizarJobs',jobsController.getAllJobs);

//Rotas de Controller cliente:
router.post('/alterarCliente/:id',clienteController.updateClientes);
router.post('/deletarCliente/:id',clienteController.deleteClientes);
router.post('/visualizarCliente',clienteController.getAllClientes);

//Metódos:
router.post('/solicitarTrocaSenha',clienteController.requisitarResetSenha);
router.post('/redefinirSenha/:email',clienteController.resetSenha);
router.post('/autenticacaoCliente',clienteController.autenticacaoLogin);
router.post('/validaTokenCliente',clienteController.verificarToken);

//Rotas do Controller ConfirmaCliente:
router.post('/cadastroConfirmaCliente',confirmaClienteController.createConfirmaCliente);
router.post('/verificarTokenConfirmaCliente',confirmaClienteController.verificarTokenConfirmaCliente);

//Rotas do Controller confirmaFotografo
router.post('/cadastroConfirmaFotografo',confirmaFotografoController.createConfirmaFotografo);
router.post('/verificarTokenConfirmaFotografo',confirmaFotografoController.verificarTokenConfirmaFotografo)


//Rotas de Controller  fotografo:
router.post('/cadastroFotografo',fotografoController.createFotografo);
router.post('/alterarFotografo/:id',fotografoController.updateFotografo);
router.post('/deletarfotografo/:id',fotografoController.deleteFotografo);
router.post('/visualizarFotografo',fotografoController.getAllFotografos);

module.exports = router;
