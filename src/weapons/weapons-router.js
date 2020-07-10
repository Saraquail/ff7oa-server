const express = require("express");
const path = require("path");
const WeaponsService = require("./weapons-service");
const { requireAuth } = require("../middleware/jwt-auth");
const weaponsRouter = express.Router();
const parser = express.json();

weaponsRouter.route("/").get(async (req, res, next) => {
  const db = req.app.get("db")
  try {
    const weapons = await WeaponsService.getAllItems(db);

    res.json(weapons.map(WeaponsService.serializeWeapon));
  } catch (error) {
    next(error);
  }
});

module.exports = weaponsRouter;
