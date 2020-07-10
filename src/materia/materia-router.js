const express = require("express");
const path = require("path");
const MateriaService = require("./materia-service");
const { requireAuth } = require("../middleware/jwt-auth");
const materiaRouter = express.Router();
const parser = express.json();

materiaRouter
  .route("/")