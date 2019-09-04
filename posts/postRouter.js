const express = require("express");
const db = require("./postDb");
const router = express.Router();

router.get("/", (req, res) => {
  db.get().then(resources => {
    res.status(200).json(resources);
  });
});

router.get("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  db.getById(id).then(resource => {
    res.status(200).json(resource);
  });
});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  if (id) {
    console.log(id);
    req.user = id;
  } else {
    res.status(400).json({ message: "Invalid User ID" });
  }
  next();
}

module.exports = router;
