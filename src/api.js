const express = require('express')

const app = express();

const clickRoutes = require('./router');


app.use(express.json());

app.use((req, res, next) => {

  const allowedOrigins = [
    'http://localhost:3000',
  ];

  const origin = req.headers.origin;

  if(allowedOrigins.includes(origin)){
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