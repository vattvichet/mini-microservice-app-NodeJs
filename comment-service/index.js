const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const app = express();
app.use(bodyParser.json());

const commentsByPostID = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostID[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentID = randomBytes(4).toString("hex");
  // console.log(req.body);
  const { commentText } = req.body;
  const comments = commentsByPostID[req.params.id] || [];
  const body = { id: commentID, commentText };
  comments.push(body);
  commentsByPostID[req.params.id] = comments;
  res.status(201).send(body);
});

app.listen(4001, () => {
  console.log("Listening in port 4001");
});
