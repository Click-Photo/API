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
const authenticateJWT = require('./controllers/JwtAuthController.js');
const blackListController = require('./controllers/Blacklist.js');
const reportController = require('./controllers/Report.js');

// Rotas do Controller Report
router.get('/getReports', authenticateJWT(['admin']), reportController.getReports);
router.post('/createReport', authenticateJWT(['admin', 'fotografo', 'cliente']), reportController.createReport);
router.delete('/resolveReport', authenticateJWT(['admin']), reportController.resolveReport);

// Rotas do Controller BlackList
router.get('/visualizarBloqueados', authenticateJWT(['admin']), blackListController.getAllBlackListed);
router.post('/bloquearUsuario', authenticateJWT(['admin']), blackListController.createBlacklistedUser);
router.delete('/desbloquearUsuario/:id', authenticateJWT(['admin']), blackListController.deleteBlacklistedUser);

// Rotas do Controller Admin
router.get('/visualizarAdmins', authenticateJWT(['admin']), adminController.getAllAdmins);
router.post('/criarAdmin', authenticateJWT(['admin']), adminController.createAdmin);

// Rotas de gestão de Clientes e Fotógrafos pelo Admin
router.get('/visualizarFotografos', authenticateJWT(['admin']), adminController.getAllFotografos);
router.get('/visualizarClientes', authenticateJWT(['admin']), adminController.getAllClientes);
router.post('/adicionarCliente', authenticateJWT(['admin']), adminController.addCliente);
router.delete('/deletarCliente/:id', authenticateJWT(['admin']), adminController.deleteCliente);
router.post('/adicionarFotografo', authenticateJWT(['admin']), adminController.addFotografo);
router.delete('/deletarFotografo/:id', authenticateJWT(['admin']), adminController.deleteFotografo);

// Rotas de exclusão de Jobs e Portfólios pelo Admin
router.delete('/deletarJob/:jobId', authenticateJWT(['admin']), adminController.deleteJob);
router.delete('/deletarImagemPortfolio/:imageId', authenticateJWT(['admin']), adminController.deletePortfolioImage);

// Rota para adicionar outro Administrador
router.post('/adicionarAdmin', authenticateJWT(['admin']), adminController.addAdmin);

// Rota para obter contagem de usuários (Clientes e Fotógrafos)
router.get('/contagemUsuarios', authenticateJWT(['admin']), adminController.getUserCounts);

//Rotas do Controller Confirma User
router.post('/cadastroConfirmaUser',confirmaUserController.createUser)
router.post('/verificarTokenConfirmaUser',confirmaUserController.verifyTicketConfirmUser)

//Rotas Pagamento
router.post('/confirmarPagamento/:jobId', jobsController.confirmarPagamento);

// Rota para renderizar a página HTML de simulação do pagamento
router.get('/simular-pagamento/:clientSecret/:jobId', (req, res) => {
    const { clientSecret, jobId } = req.params;
    res.render('pagamento.html', { clientSecret, jobId });
});

//Rotas do Controller User
router.post('/criarUsuario',userController.createUser);
router.get('/visualizarUsuarios', authenticateJWT(['admin']), userController.getAllUsers);
router.put('/editarUsuario/:id', authenticateJWT(['admin', 'fotografo', 'cliente']),userController.updateUser);
router.delete('/deletarUsuario/:id', authenticateJWT(['admin', 'fotografo', 'cliente']),userController.deleteUser);
router.post('/esqueciMinhaSenha',userController.reqResetPass);
router.post('/verificarTicket',userController.verifyPasswordResetTicket);
router.put('/trocarSenha', userController.resetPassword);
router.post('/loginUsuario', userController.authUser);

//Rotas do Controller Proposta
router.post('/criarProposta/:idJobs', authenticateJWT(['admin', 'fotografo']),propostaController.createProposta);
router.post('/visualizarProposta', authenticateJWT(['admin', 'fotografo', 'cliente']),propostaController.getAllPropostas);
router.post('/visualizarPropostaCliente/:idCliente', authenticateJWT(['admin', 'cliente']),propostaController.getAllPropostaCliente);
router.post('/visualizarPropostaFotografo/:idFotografo', authenticateJWT(['admin', 'fotografo']),propostaController.getAllPropostaFotografo);
router.post('/visulizarPropostaJob/:idJobs', authenticateJWT(['admin', 'fotografo', 'cliente']),propostaController.getAllPropostaJob);
router.post('/aceitarProposta/:id', authenticateJWT(['admin', 'cliente']), propostaController.aceitarProposta);
router.post('/recusarProposta/:id', authenticateJWT(['admin', 'cliente']), propostaController.recusarProposta);
router.get('/getPropostaJob/:idJob', authenticateJWT(['admin', 'cliente']), propostaController.getPropostaJob);

//Rotas do Controller Jobs
router.post('/criarJob', authenticateJWT(['admin', 'cliente']),jobsController.createJob);
router.post('/editarJob/:id', authenticateJWT(['admin', 'cliente']),jobsController.updateJob);
router.post('/deleteJob/:id', authenticateJWT(['admin', 'cliente']),jobsController.deleteJob);
router.post('/visualizarJobs', authenticateJWT(['admin', 'cliente']),jobsController.getAllJobs);
router.get('/getAllJobsCliente/:id',  authenticateJWT(['admin', 'cliente']), jobsController.getAllJobsCliente);
router.post('/finalizarJob/:id', authenticateJWT(['admin', 'fotografo', 'cliente']), jobsController.finalizarJob);
router.get('/getJobsFotografo/:id', authenticateJWT(['admin', 'fotografo']),jobsController.getJobsFotografo);

//Rotas de Controller cliente:
router.post('/alterarCliente/:id', authenticateJWT(['admin', 'cliente']),clienteController.updateClientes);
router.post('/visualizarCliente', authenticateJWT(['admin']),clienteController.getAllClientes);
router.get('/getEspecifCliente/:id', authenticateJWT(['admin', 'cliente']), clienteController.getEspecifCliente);

//Rotas do Controller ConfirmaCliente:
router.post('/cadastroConfirmaCliente',confirmaClienteController.createConfirmaCliente);
router.post('/verificarTokenConfirmaCliente',confirmaClienteController.verificarTokenConfirmaCliente);

//Rotas do Controller confirmaFotografo
router.post('/cadastroConfirmaFotografo',confirmaFotografoController.createConfirmaFotografo);
router.post('/verificarTokenConfirmaFotografo',confirmaFotografoController.verificarTokenConfirmaFotografo)


//Rotas de Controller  fotografo:
router.post('/createAccountLink', authenticateJWT(['admin', 'fotografo']),fotografoController.createAccountLink);
router.post('/alterarFotografo/:id', authenticateJWT(['admin', 'fotografo']),fotografoController.updateFotografo);
router.post('/visualizarFotografo', authenticateJWT(['admin', 'fotografo']),fotografoController.getAllFotografos);
router.get('/getEspecifFotografo/:id', authenticateJWT(['admin', 'fotografo']),fotografoController.getEspecifFotografo);

//Rotas do Controller Avaliacoes
router.get('/avaliacoesPendentesCliente/:clienteId', authenticateJWT(['admin', 'cliente']), avaliacoesController.getAvaliacoesPendentesCliente);
router.get('/avaliacoesPendentesFotografo/:fotografoId', authenticateJWT(['admin', 'fotografo']), avaliacoesController.getAvaliacoesPendentesFotografo);
router.get('/mediaAvaliacoesCliente/:clienteId',  authenticateJWT(['admin', 'cliente']),avaliacoesController.mediaAvaliacoesCliente);
router.get('/mediaAvaliacoesFotografo/:fotografoId', authenticateJWT(['admin', 'fotografo']), avaliacoesController.mediaAvaliacoesFotografo);
router.post('/avaliarFotografo/:jobId', authenticateJWT(['admin', 'cliente']), avaliacoesController.avaliarFotografo);
router.post('/avaliarCliente/:jobId', authenticateJWT(['admin', 'fotografo']), avaliacoesController.avaliarCliente);

//Rotas do Controller Portfolio
router.get('/listarTodasFotos', authenticateJWT(['admin', 'fotografo', 'cliente']), portfolioController.listarFotosGeral);
router.get('/listarFotosFotografo/:fotografoId', authenticateJWT(['admin', 'fotografo']),portfolioController.listarFotosFotografo);
router.post('/adicionarFoto', authenticateJWT(['admin', 'fotografo']), upload.single('foto'), portfolioController.adicionarFoto);
router.put('/editarInfoFoto/:idFoto', authenticateJWT(['admin', 'fotografo']), portfolioController.editarInfoFoto);
router.delete('/deleteFoto/:fotoId', authenticateJWT(['admin', 'fotografo']), portfolioController.deleteFoto);

//Rotas do Controller Interesse
router.post('/marcarInteresse/:idJob', authenticateJWT(['admin', 'fotografo']), interesseController.marcarInteresse);
router.get('/getInteressesFotografo/:idFotografo', authenticateJWT(['admin', 'fotografo']), interesseController.getInteressesFotografo);

module.exports = router;
