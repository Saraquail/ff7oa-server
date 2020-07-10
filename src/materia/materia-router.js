const express = require("express");
const path = require("path");
const MateriaService = require("./materia-service");
const { requireAuth } = require("../middleware/jwt-auth");
const materiaRouter = express.Router();
const parser = express.json();

materiaRouter
  .route("/")
  .get(async (req, res, next) => {
    const db = req.app.get("db")
    try {
      const materia = await MateriaService.getAllItems(db)

      res.json(materia.map(MateriaService.serializeMateria))
    } catch(error) {
      next(error)
    }
  })

  module.exports = materiaRouter