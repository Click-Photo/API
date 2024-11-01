const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });

//Rotas
const clienteController = require('./controllers/Cliente');
const fotografoController = require('./controllers/Fotografo');
const confirmaClienteController = require ('./controllers/ConfirmaCliente');
const confirmaFotografoController = require ('./controllers/ConfirmaFotografo');
const jobsController = require ('./controllers/Jobs')
const propostaController = require ('./controllers/Proposta');
const avaliacoesController = require('./controllers/Avaliacoes');
const portfolioController = require('./controllers/Portfolio');
const interesseController = require('./controllers/Interesses');
const userController = require('./controllers/User');
const confirmaUserController = require('./controllers/ConfirmaUser');
const adminController = require('./controllers/Admin');

// Rotas do Controller Admin
router.get('/visualizarAdmins', adminController.getAllAdmins);
router.post('/criarAdmin', adminController.createAdmin);
router.post('/loginAdmin', adminController.loginAdmin);

// Rotas de gestão de Clientes e Fotógrafos pelo Admin
router.get('/visualizarFotografos', adminController.getAllFotografos);
router.get('/visualizarClientes', adminController.getAllClientes);
router.post('/adicionarCliente', adminController.addCliente);
router.delete('/deletarCliente/:id', adminController.deleteCliente);
router.post('/adicionarFotografo', adminController.addFotografo);
router.delete('/deletarFotografo/:id', adminController.deleteFotografo);

// Rotas de exclusão de Jobs e Portfólios pelo Admin
router.delete('/deletarJob/:jobId', adminController.deleteJob);
router.delete('/deletarImagemPortfolio/:imageId', adminController.deletePortfolioImage);

// Rota para adicionar outro Administrador
router.post('/adicionarAdmin', adminController.addAdmin);

// Rota para obter contagem de usuários (Clientes e Fotógrafos)
router.get('/contagemUsuarios', adminController.getUserCounts);

//Rotas do Controller Confirma User
router.post('/cadastroConfirmaUser',confirmaUserController.createUser)
router.post('/verificarTokenConfirmaUser',confirmaUserController.verifyTicketConfirmUser)

//Rotas Pagamento
router.post('/confirmarPagamento/:jobId', jobsController.confirmarPagamento);
router.post('/create-checkout-session', jobsController.createCheckoutSessionController);

// Rota para renderizar a página HTML de simulação do pagamento
router.get('/simular-pagamento/:clientSecret/:jobId', (req, res) => {
    const { clientSecret, jobId } = req.params;
    res.render('pagamento', { clientSecret, jobId });
});

//Rotas do Controller User
router.post('/criarUsuario',userController.createUser);
router.get('/visualizarUsuarios',userController.getAllUsers);
router.put('/editarUsuario/:id',userController.updateUser);
router.delete('/deletarUsuario/:id',userController.deleteUser);
router.post('/esqueciMinhaSenha',userController.reqResetPass);
router.post('/verificarTicket',userController.verifyPasswordResetTicket);
router.put('/trocarSenha', userController.resetPassword);
router.post('/loginUsuario', userController.authUser);

//Rotas do Controller Proposta
router.post('/criarProposta/:idJobs',propostaController.createProposta);
router.post('/visualizarProposta',propostaController.getAllPropostas);
router.post('/visualizarPropostaCliente/:idCliente',propostaController.getAllPropostaCliente);
router.post('/visualizarPropostaFotografo/:idFotografo',propostaController.getAllPropostaFotografo);
router.post('/visulizarPropostaJob/:idJobs',propostaController.getAllPropostaJob);
router.post('/aceitarProposta/:id', propostaController.aceitarProposta);
router.post('/recusarProposta/:id', propostaController.recusarProposta);
router.get('/getPropostaJob/:idJob', propostaController.getPropostaJob);

//Rotas do Controller Jobs
router.post('/criarJob',jobsController.createJob);
router.post('/editarJob/:id',jobsController.updateJob);
router.post('/deleteJob/:id',jobsController.deleteJob);
router.post('/visualizarJobs',jobsController.getAllJobs);
router.get('/getAllJobsCliente/:id', jobsController.getAllJobsCliente);
router.post('/finalizarJob/:id',jobsController.finalizarJob);
router.get('/getJobsFotografo/:id', jobsController.getJobsFotografo);

//Rotas de Controller cliente:
router.post('/alterarCliente/:id',clienteController.updateClientes);
router.post('/visualizarCliente',clienteController.getAllClientes);
router.get('/getEspecifCliente/:id', clienteController.getEspecifCliente);

//Rotas do Controller ConfirmaCliente:
router.post('/cadastroConfirmaCliente',confirmaClienteController.createConfirmaCliente);
router.post('/verificarTokenConfirmaCliente',confirmaClienteController.verificarTokenConfirmaCliente);

//Rotas do Controller confirmaFotografo
router.post('/cadastroConfirmaFotografo',confirmaFotografoController.createConfirmaFotografo);
router.post('/verificarTokenConfirmaFotografo',confirmaFotografoController.verificarTokenConfirmaFotografo)


//Rotas de Controller  fotografo:
router.post('/createAccountLink',fotografoController.createAccountLink);
router.post('/alterarFotografo/:id',fotografoController.updateFotografo);
router.post('/visualizarFotografo',fotografoController.getAllFotografos);
router.get('/getEspecifFotografo/:id', fotografoController.getEspecifFotografo);

//Rotas do Controller Avaliacoes
router.get('/avaliacoesPendentesCliente/:clienteId', avaliacoesController.getAvaliacoesPendentesCliente);
router.get('/avaliacoesPendentesFotografo/:fotografoId', avaliacoesController.getAvaliacoesPendentesFotografo);
router.get('/mediaAvaliacoesCliente/:clienteId', avaliacoesController.mediaAvaliacoesCliente);
router.get('/mediaAvaliacoesFotografo/:fotografoId', avaliacoesController.mediaAvaliacoesFotografo);
router.post('/avaliarFotografo/:jobId', avaliacoesController.avaliarFotografo);
router.post('/avaliarCliente/:jobId', avaliacoesController.avaliarCliente);

//Rotas do Controller Portfolio
router.get('/listarTodasFotos', portfolioController.listarFotosGeral);
router.get('/listarFotosFotografo/:fotografoId', portfolioController.listarFotosFotografo);
router.post('/adicionarFoto', upload.single('foto'), portfolioController.adicionarFoto);
router.put('/editarInfoFoto/:idFoto', portfolioController.editarInfoFoto);
router.delete('/deleteFoto/:fotoId', portfolioController.deleteFoto);

//Rotas do Controller Interesse
router.post('/marcarInteresse/:idJob', interesseController.marcarInteresse);
router.get('/getInteressesFotografo/:idFotografo', interesseController.getInteressesFotografo);

module.exports = router;
