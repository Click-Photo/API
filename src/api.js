const express = require('express');
const jwt = require('jsonwebtoken');
const clickRoutes = require('./router');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Middleware para JSON
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.use(cookieParser());

// CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

app.use('/click', clickRoutes);

const port = process.env.PORT || 3636;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
