const express = require("express");
const db = require("./userDb");
const router = express.Router();

router.post("/", validatePost, (req, res) => {
  const userInfo = req.body;
  db.insert(userInfo).then(resource => {
    res.status(201).json(resource);
  });
});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {
  db.get()
    .then(resources => {
      res.status(200).json(resources);
    })
    .catch(err => {
      res.status(500).json({ message: "Server Error" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  db.getById(id).then(resource => {
    res.status(200).json(resource);
  });
});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  db.getById(id)
    .then(resource => {
      console.log("Single User is", resource);
      if (resource) {
        req.user = resource;
        next();
      } else {
        res.status(400).json({ message: "user id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Server Error" });
    });
}

function validateUser(req, res, next) {
  const body = req.body;
  const name = req.body.name;
  if (!body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const body = req.body;
  const text = req.body.text;
  if (!body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!text) {
    res.status(400).json({ message: "missing required text field" });
  }
  next();
}

module.exports = router;
