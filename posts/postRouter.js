const express = "express";
const db = require("./postDb");
const router = express.Router();

router.get("/", (req, res) => {
  db.get().then(resources => {
    res.status(200).json(resources);
  });
});

router.get("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {}

module.exports = router;
