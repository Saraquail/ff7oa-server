const express = require("express");
const path = require("path");
const MonstersService = require("./monsters-service");
const { requireAuth } = require("../middleware/jwt-auth");
const monstersRouter = express.Router();
const parser = express.json();

monstersRouter
  .route("/")

  .get((req, res, next) => {
    const db = req.app.get("db");
    MonstersService.getAllItems(db)
      .then((monsters) => {
        res.json(monsters.map(MonstersService.serializeMonster));
      })
      .catch(next);
  })

  .post(requireAuth, parser, async (req, res, next) => {
    const db = req.app.get("db");
    let newMonster = req.body;

    for (const [key, value] of Object.entries(newMonster)) {
      if (!value) {
        return res.status(400).json({
          error: `Missing '${key}'`,
        });
      }
    }
    try {
      const doesMonsterExist = await MonstersService.doesMonsterExist(
        db,
        newMonster.name
      );

      if (doesMonsterExist) {
        return res.status(400).json({
          error: "Monster already exists",
        });
      }

      newMonster = await MonstersService.serializeMonster(newMonster);

      const monster = await MonstersService.insertItem(db, newMonster)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${monster.id}`))
          .json({ monster });
      } catch (error) {
      next(error);
    }
  });

monstersRouter
  .route("/:monster_id")
  .all((req, res, next) => {
    const db = req.app.get("db");
    MonstersService.getItemById(db, req.params.monster_id)
      .then((monster) => {
        if (!monster) {
          return res.status(404).json({
            error: { message: "Monster does not exist" },
          });
        }
        res.monster = monster;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(MonstersService.serializeMonster(res.monster));
  });

module.exports = monstersRouter;
