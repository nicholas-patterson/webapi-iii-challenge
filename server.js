const express = require("express");
const server = express();
const postRouter = require("./posts/postRouter");
// global middleware
server.use(express.json());
server.use("/posts", postRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {}

module.exports = server;
