const PontoDeInteresse = require('../model/PontoDeInteresse');
const { Op } = require('sequelize');

const listarPontosDeInteresse = async (req, res) => {
  const { query, lat, lng, maxDistance = 5000 } = req.query;

  try {
    if (!query && !lat && !lng) {
      const pontosDeInteresse = await PontoDeInteresse.findAll();
      
      return res.json(pontosDeInteresse);
    }

    if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      return res.status(400).json({ error: "Parâmetros de localização inválidos" });
    }

    let pontosDeInteresse = await PontoDeInteresse.findAll({
      where: {
        location: {
          [Op.near]: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
            distance: parseInt(maxDistance)
          }
        }
      }
    });

    if (query) {
      pontosDeInteresse = pontosDeInteresse.filter(ponto => 
        ponto.titulo.toLowerCase().includes(query.toLowerCase())
      );
    }

    res.json(pontosDeInteresse);

  } catch (error) {
    console.error('Erro ao listar pontos de interesse:', error);
    res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
  }
};

const criarPontoDeInteresse = async (req, res) => {
  try {
    const novoPontoDeInteresse = await PontoDeInteresse.create(req.body);

    res.status(201).json(novoPontoDeInteresse);
  } catch (error) {
    console.error('Erro ao criar ponto de interesse:', error);
    res.status(400).json({ error: 'Erro ao criar ponto de interesse', details: error.message });
  }
};

const atualizarPontoDeInteresse = async (req, res) => {
  const { id } = req.params;
  const pontoDeInteresseAlterado = req.body;

  try {
    const pontoDeInteresse = await PontoDeInteresse.findByPk(id);

    if (!pontoDeInteresse) {
      return res.status(404).send('Ponto de interesse não encontrado');
    }

    const pontoAtualizado = await pontoDeInteresse.update(pontoDeInteresseAlterado);

    res.json(pontoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar ponto de interesse:', error);
    res.status(400).send(error);
  }
};

const deletarPontoDeInteresse = async (req, res) => {
  const { id } = req.params;

  try {
    const pontoDeInteresse = await PontoDeInteresse.findByPk(id);

    if (!pontoDeInteresse) {
      return res.status(404).send('Ponto de interesse não encontrado');
    }

    await pontoDeInteresse.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar ponto de interesse:', error);
    res.status(400).send(error);
  }
};

module.exports = { listarPontosDeInteresse, criarPontoDeInteresse, atualizarPontoDeInteresse, deletarPontoDeInteresse };
