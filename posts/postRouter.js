const express = require("express");
const db = require("./postDb");
const router = express.Router();

router.get("/", (req, res) => {
  db.get().then(resources => {
    res.status(200).json(resources);
  });
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.user);
});

router.delete("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(resource => {
      res.status(202).json(resource);
    })
    .catch(err => {
      res.status(500).json({ err: "Server Error" });
    });
});

router.put("/:id", validatePostId, validatePost, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  db.update(id, body)
    .then(result => {
      if (result) {
        res.status(200).json({ message: "Post updated successfully" });
      } else {
        res.status(400).json({ message: "Post not updated" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Server Error" });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  db.getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "Post with that ID is was not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Server Error" });
    });
}

function validatePost(req, res, next) {
  const body = Object.keys(req.body);
  const text = req.body.text;
  if (body.length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
