const express = require("express");
const path = require("path");
const WeaponsService = require("./weapons-service");
const { requireAuth } = require("../middleware/jwt-auth");
const weaponsRouter = express.Router();
const parser = express.json();

weaponsRouter.route("/").get(async (req, res, next) => {
  try {
    const weapons = await WeaponsService.getAllItems(req.app.get("db"));

    res.json(weapons.map(WeaponsService.serializeWeapon));
  } catch (error) {
    next(error);
  }
});

module.exports = weaponsRouter;
