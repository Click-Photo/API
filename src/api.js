const express = require ('express')

const app = express ();

app.use(express.json());

app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3000'
    ]
});

const port = process.env.PORT || 3636;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});