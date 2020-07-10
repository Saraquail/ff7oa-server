const express = require("express");
const path = require("path");
const GuidesService = require("./guides-service");
const { requireAuth } = require("../middleware/jwt-auth");
const guidesRouter = express.Router();
const parser = express.json();

guidesRouter
  .route("/")
  .all(requireAuth)
  .get(async (req, res, next) => {
    const user_id = { user_id: req.user.id };
    const db = req.app.get("db");
    try {
      const guides = await GuidesService.getItemsWhere(db, user_id);

      res.json(guides.map(GuidesService.serializeGuides));
    } catch (e) {
      next(e);
    }
  })

  .post(parser, async (req, res, next) => {
    const user_id = req.user.id;
    const newGuide = req.body;

    for (const [key, value] of Object.entries(newGuide)) {
      if (!value) {
        return res.status(400).json({
          e: `Missing '${key}'`,
        });
      }
    }
    newGuide.user_id = user_id;
    try {
      const guide = await GuidesService.insertItem(
        req.app.get("db"),
        newGuide
      );
      res
        .status(201)
        .location(path.posix.join(req.originalUrl))
        .json(GuidesService.serializeGuides(guide));
    } catch (e) {
      next(e);
    }
  });

guidesRouter.route("/:guide_id").delete(async (req, res, next) => {
  try {
    await GuidesService.deleteItem(req.app.get("db"), req.params.guide_id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = guidesRouter;
