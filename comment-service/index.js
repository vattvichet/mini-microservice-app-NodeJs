const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { randomBytes } = require("crypto");
const app = express();
app.use(bodyParser.json());

const commentsByPostID = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostID[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentID = randomBytes(4).toString("hex");
  const { comment } = req.body;
  const comments = commentsByPostID[req.params.id] || [];
  const body = { id: commentID, comment };
  comments.push(body);
  commentsByPostID[req.params.id] = comments;

  const result = await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentID,
      comment,
      postID: req.params.id,
    },
  });
  console.log(result);
  res.status(201).send(body);
});

app.post("/events", (req, res) => {
  console.log("Received Event: Post Created");
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening in port 4001");
});
