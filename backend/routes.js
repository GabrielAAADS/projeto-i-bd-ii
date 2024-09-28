const express = require('express');
const pool = require('./db');
const router = express.Router();

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão ao banco de dados bem-sucedida:', res.rows);
  }
});


router.get('/pontos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, descricao, ST_AsGeoJSON(geometria) as geometria FROM ponto_de_interesse');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar pontos de interesse:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.post('/pontos', async (req, res) => {
  try {
    const {descricao, geometria} = req.body;
    const result = await pool.query(
      'INSERT INTO ponto_de_interesse (descricao, geometria) VALUES ($1, ST_GeomFromGeoJSON($2)) RETURNING *',
      [descricao, geometria]
    )

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.put('/pontos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, geometria } = req.body;
    const result = await pool.query(
      'UPDATE ponto_de_interesse SET descricao = $1, geometria = ST_GeomFromGeoJSON($2) WHERE id = $3 RETURNING *',
      [descricao, geometria, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.delete('/pontos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ponto_de_interesse WHERE id = $1', [id]);
    res.send('Ponto de interesse deletado com sucesso');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
