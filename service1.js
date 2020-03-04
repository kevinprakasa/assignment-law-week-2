const express = require("express");
const app = express();
const port = 3000;
var rp = require("request-promise");
const fileupload = require("express-fileupload");
const compressing = require("compressing");
const auth = require("./auth.js");

app.use(fileupload());

app.post("/compress", (req, res) => {
  auth(req.headers.authorization)
    .then(() => {
      if (req.files) {
        const { file } = req.files;
        const { name } = file;
        const uploadedPath = "./upload/" + name;
        file.mv(uploadedPath, err => {
          if (err) {
            res.status(500).send("error uploading files");
          } else {
            const compressedPath = "./compressed/" + name + ".zip";
            compressing.zip
              .compressFile(uploadedPath, compressedPath)
              .then(() => {
                res.sendFile(__dirname + "/compressed/" + name + ".zip");
              })
              .catch(err => {
                console.log(err);
                res.status(500).send(err);
              });
          }
        });
      } else {
        res.status(400).send({ error_description: "No files were provided" });
      }
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

app.listen(port, () => console.log(`Service 1 app listening on port ${port}!`));
