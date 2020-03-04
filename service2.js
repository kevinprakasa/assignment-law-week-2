const express = require("express");
const app = express();
const port = 3000;
const fileupload = require("express-fileupload");
const auth = require("./auth.js");

app.use(fileupload());

app.use("/upload", express.static("upload"));

app.post("/store", (req, res) => {
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
            const staticFilesUrl =
              req.protocol + "://" + req.get("host") + "/upload/" + name;
            res.send({ url_data: staticFilesUrl });
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

app.listen(port, () => console.log(`Service 2 app listening on port ${port}!`));
