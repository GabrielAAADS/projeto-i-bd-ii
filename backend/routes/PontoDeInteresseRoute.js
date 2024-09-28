const express = require('express');
const pontoDeInteresseRouter = express.Router();
const { listarPontosDeInteresse, criarPontoDeInteresse, atualizarPontoDeInteresse, deletarPontoDeInteresse } = require('../controller/PontoDeInteresseController');

pontoDeInteresseRouter.use(express.json());

pontoDeInteresseRouter.get('/', listarPontosDeInteresse);
pontoDeInteresseRouter.post('/', criarPontoDeInteresse);
pontoDeInteresseRouter.put('/:id', atualizarPontoDeInteresse);
pontoDeInteresseRouter.delete('/:id', deletarPontoDeInteresse);

module.exports = pontoDeInteresseRouter;
