const express = require('express');
const cors = require('cors');
const app = express();
const pontoDeInteresseRoutes = require('./routes/PontoDeInteresseRoute');
const sequelize = require('./database/sequelize'); 

app.use(cors());
app.use(express.json());

app.use('/api', pontoDeInteresseRoutes);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao PostgreSQL com sucesso.');

    sequelize.sync({ force: false })
      .then(() => {
        console.log('Modelos sincronizados com o banco de dados.');
        app.listen(PORT, () => {
          console.log(`Servidor rodando na porta ${PORT}`);
        });
      })
      .catch((error) => {
        console.error('Erro ao sincronizar os modelos com o banco de dados:', error);
      });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });
