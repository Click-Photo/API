const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Rotas do clientes
const clienteController = require('./controllers/Cliente');

router.post('/cadastro', clienteController.createClientes);

module.exports = router;
