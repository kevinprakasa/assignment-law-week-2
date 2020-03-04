const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const express = require("express");
const app = express();
const User = require("./model.js");
const port = 3000;
const auth = require("./auth.js");
const bodyParser = require("body-parser");
// koneksi Ke Database
mongoose
  .connect("mongodb://localhost:27017/node-mongodb")
  .then(() => {
    app.use(bodyParser.json());
    // GET all users
    app.get("/users", (req, res, next) => {
      auth(req.headers.authorization)
        .then(() => {
          User.find({}, (err, users) => {
            if (!err) {
              res.send(users);
            } else {
              next(err);
            }
          });
        })
        .catch(err => {
          var { statusCode, response } = err;
          res
            .status(statusCode)
            .send(
              typeof response.body === "string"
                ? JSON.parse(response.body)
                : response.body
            );
        });
    });

    // POST new user
    app.post("/users", (req, res, next) => {
      auth(req.headers.authorization)
        .then(() => {
          User.create(req.body)
            .then(data => {
              res.send(data);
            })
            .catch(err => next(err));
        })
        .catch(err => {
          var { statusCode, response } = err;
          res
            .status(statusCode)
            .send(
              typeof response.body === "string"
                ? JSON.parse(response.body)
                : response.body
            );
        });
    });

    // GET detail user
    app.get("/users/:id", (req, res, next) => {
      auth(req.headers.authorization)
        .then(() => {
          User.findById({ _id: req.params.id })
            .then(data => res.send(data))
            .catch(err => next(err));
        })
        .catch(err => {
          var { statusCode, response } = err;
          res
            .status(statusCode)
            .send(
              typeof response.body === "string"
                ? JSON.parse(response.body)
                : response.body
            );
        });
    });

    // PUT detail user
    app.put("/users/:id", (req, res, next) => {
      auth(req.headers.authorization)
        .then(() => {
          User.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
            .then(_ => {
              if (!_) res.status(404).send("Not found");
              User.findById({ _id: req.params.id }).then(data =>
                res.send(data)
              );
            })
            .catch(err => next(err));
        })
        .catch(err => {
          var { statusCode, response } = err;
          res
            .status(statusCode)
            .send(
              typeof response.body === "string"
                ? JSON.parse(response.body)
                : response.body
            );
        });
    });

    //DELETE
    app.delete("/users/:id", (req, res, next) => {
      auth(req.headers.authorization)
        .then(() => {
          User.findByIdAndRemove({ _id: req.params.id })
            .then(_ => {
              if (!_) res.status(404).send("Not found");
              res.send("Delete Success");
            })
            .catch(err => next(err));
        })
        .catch(err => {
          var { statusCode, response } = err;
          res
            .status(statusCode)
            .send(
              typeof response.body === "string"
                ? JSON.parse(response.body)
                : response.body
            );
        });
    });

    app.listen(port, () =>
      console.log(`Service 3 app listening on port ${port}!`)
    );
  })
  .catch(err => {
    console.log("Not connected to the database!");
    process.exit();
  });
