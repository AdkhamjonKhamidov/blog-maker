import render from "ejs";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/assets/');
    },
    filename: (req, file, cb) => {
        let des = Date.now() + path.extname(file.originalname);
        data.imageLocation = "/assets/" + des;
        cb(null, des);
    },
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});
const upload = multer({ storage: storage });

const app = express();
const port = 3000;
const currDir = import.meta.dirname;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let data = {
    title: "Title",
    opening: "NONE",
    imageLocation: "/assets/Placeholder.svg",
    subHeaderOne: "Sub-header",
    contentOne: "NONE",
    subHeaderTwo: "Sub-header",
    contentTwo: "NONE",
    closing: "Call to action"
}

const prevImgs = ["/assets/Placeholder.svg"];

app.get("/", (req, res) => {
    res.render("index.ejs");
})
app.get("/post", (req, res) => {
    res.render("final.ejs", data);
})

app.post("/submit-title", (req, res) => {
    data.title = req.body.userInput;
    res.locals.title = req.body.userInput;
    res.render("index.ejs", data);
})
app.post("/submit-opening", (req, res) => {
    data.opening = req.body.userInput;
    res.locals.opening = req.body.userInput;
    res.render("index.ejs", data);
})

const deleteImage = (req, res, next) => {
    let temp = data.imageLocation;
    let placeholderLocation = currDir + "/public/assets/Placeholder.svg";
    for (let i = prevImgs.length - 1; i >= 0; i--) {
        let filePath = currDir + "/public" + prevImgs[i];
        if (filePath !== data.imageLocation && filePath !== placeholderLocation) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("Error deleting the file:", err);
                    return;
                } else {
                    console.log("Success deleting: " + filePath);
                }
            })
        }
        prevImgs.splice(i, 1);
    }
    prevImgs.push(temp);
    next();
} 
app.post("/upload-photo", upload.single('photo'), deleteImage, (req, res) => {
    if (!req.file) {
        console.log("image upload failed!");
    } else {
        res.render("index.ejs", data); 
    }
});
app.post("/submit-subheader1", (req, res) => {
    data.subHeaderOne = req.body.userInput;
    res.locals.subHeaderOne = req.body.userInput;
    res.render("index.ejs", data);
})
app.post("/submit-content1", (req, res) => {
    data.contentOne = req.body.userInput;
    res.locals.contentOne = req.body.userInput;
    res.render("index.ejs", data);
})

app.post("/submit-subheader2", (req, res) => {
    data.subHeaderTwo = req.body.userInput;
    res.locals.subHeaderTwo = req.body.userInput;
    res.render("index.ejs", data);
})
app.post("/submit-content2", (req, res) => {
    data.contentTwo = req.body.userInput;
    res.locals.contentTwo = req.body.userInput;
    res.render("index.ejs", data);
})
app.post("/submit-closing", (req, res) => {
    data.closing = req.body.userInput;
    res.locals.closing= req.body.userInput;
    res.render("index.ejs", data);
})


app.listen(port, () => {
    console.log("server running on port: " + port);
})