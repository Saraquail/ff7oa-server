const express = require("express");
const path = require("path");
const LimitsService = require("./limits-service");
const { requireAuth } = require("../middleware/jwt-auth");
const limitsRouter = express.Router();
const parser = express.json();

limitsRouter.route("/").get(async (req, res, next) => {
  const db = req.app.get("db");
  try {
    const limits = await LimitsService.getAllItems(db);
    res.json(limits.map(LimitsService.serializeLimits));
  } catch (error) {
    next(error);
  }
});

module.exports = limitsRouter;
