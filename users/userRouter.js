const express = require("express");
const db = require("./userDb");
const postDb = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const userInfo = req.body;
  db.insert(userInfo).then(resource => {
    res.status(201).json(resource);
  });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  let post = req.body;
  post.user_id = req.params.id;
  postDb
    .insert(post)
    .then(resource => {
      res.status(201).json(resource);
    })
    .catch(err => {
      res.status(500).json({ message: "Server Error" });
    });
});

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

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  db.getUserPosts(id)
    .then(resource => {
      res.status(200).json(resource);
    })
    .catch(err => {
      res.status(500).json({ error: "Server Error" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(resource => {
      res.status(202).json(resource);
    })
    .catch(err => {
      res.status(500).json({ error: "Server Error" });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  db.update(id, changes)
    .then(update => {
      res.status(200).json(update);
    })
    .catch(err => {
      res.status(500).json({ error: "Server Error" });
    });
});

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
  const bodyData = Object.keys(req.body);
  const text = req.body.text;
  // empty request body is empty object, check for valid properties
  if (bodyData.length === 0) {
    console.log("VALIDATE POST", bodyData);
    return res.status(400).json({ message: "missing post data" });
  } else if (!text) {
    return res.status(400).json({ message: "missing required text field" });
  }
  next();
}

module.exports = router;
