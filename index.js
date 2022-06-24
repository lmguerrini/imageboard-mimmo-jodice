const express = require("express");
const app = express();
//const bodyParser = require("body-parser");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
        //callback(null, "/uploads");
    },
    filename: function (req, file, callback) {
        // unique id (24) generated
        uidSafe(24)
            .then(function (uid) {
                callback(null, uid + path.extname(file.originalname));
                //callback(null, `${uid} ${path.extname(file.originalname)}`);
            })
            .catch((err) => {
                callback("err (index.js) catch diskStorage/filename: ", err);
            });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        // limit to prevent DOS attack
        fileSize: 2097152 //2MB
    }
});

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

//app.use(express.static("uploads"));
//app.use(uploader.single("image"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error in db.getImages catch: ", err);
            res.json({ success: false });
        });
});

app.get("/selected-image/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getSelectedImageDetails(imageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error in db.getSelectedImageDetails catch: ", err);
            res.json({ success: false });
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    // If nothing went wrong, file already in the uploads directory
    const { title, description, username } = req.body;
    // URL needed to be able to see the image
    const url = `${s3Url}${req.file.filename}`;
    if (req.file) {
        db.storeUploadedImageDB(url, username, title, description)
            .then(() => {
                res.json({ url, username, title, description });
            })
            .catch((err) => {
                console.error("error in post/upload db.storeUploadedImageDB catch: ", err);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});

app.get("/show-more/:lastImageId", (req, res) => {
    const { lastImageId } = req.params;
    db.getMoreImages(lastImageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error in db.getMoreImages catch: ", err);
            res.json({ success: false });
        });
});

app.get("/comments/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getComments(imageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error in db.getComments catch: ", err);
            res.json({ success: false });
        });
});

app.post("/add-comment", (req, res) => {
    const { comment, username, imageId } = req.body;
    const addComment = {
        comment: comment,
        username: username,
        created_at: ""
    };
    if (addComment.comment === "") {
        res.json({ success: false });
    } else {
        db.insertNewComment(comment, username, imageId)
            .then(({ rows }) => {
                addComment.created_at = rows[0].created_at;
                res.json(addComment);
            })
            .catch((err) => {
                console.error("error in db.insertNewComment catch: ", err);
                res.json({ success: false });
            });
    }
});

app.post("/delete-comment/:commentId", (req, res) => {
    const commentId = req.params.commentId;
    db.deleteComment(commentId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.error("error in db.deleteComment catch: ", err);
            res.json({ success: false });
        });
});

app.get("/delete-image/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.deleteImage(imageId)
        .then(({ rows }) => {
            s3.delete(rows[0].url);
            res.json({ success: true });
        })
        .catch((err) => {
            console.error("error in db.deleteImage catch: ", err);
            res.json({ success: false });
        });
});

app.use(express.static("public")); // better on the bottom, to exlude possible conflict

app.listen(8080, () => console.log("Imageboard up and running on 8080.."));
