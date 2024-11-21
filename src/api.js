const express = require('express');
const jwt = require('jsonwebtoken');
const clickRoutes = require('./router');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');

// Middleware para JSON
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.use(cookieParser());

// CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  next();
});

app.use('/click', clickRoutes);

const port = process.env.PORT || 3636;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
