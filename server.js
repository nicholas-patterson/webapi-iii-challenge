const express = require("express");
const server = express();
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");
// global middleware
server.use(express.json());
server.use(logger);
server.use("/posts", postRouter);
server.use("/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `${new Date().toISOString()} there was a ${req.method} request to ${
      req.url
    }`
  );
  next();
}

module.exports = server;
