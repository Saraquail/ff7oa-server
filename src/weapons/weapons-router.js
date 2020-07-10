const express = require("express");
const path = require("path");
const WeaponsService = require("./weapons-service");
const { requireAuth } = require("../middleware/jwt-auth");
const weaponsRouter = express.Router();
const parser = express.json();

weaponsRouter
  .route("/")