// imported modules
const express = require("express");
const bodyParser = require("body-parser");


const app = express();
//port number 
const PORT = 3000;

//set engine to ejs 
app.set("view engine", "ejs");

//middleware using body-parser 
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

//in-memory storage for blogs 
let posts = [];

//home page route 
app.get("/", (req, res) => {
    res.render("index", {posts: posts });
});

// route to add new post 
app.post("/add", (req, res) => {
    const newPost = {
        //post with data stored 
        id: Date.now(),
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date().toLocaleString()
    };
    //put the post into the memory array 
    posts.push(newPost);
    console.log("Current posts:", posts);
    //redirect back to home page 
    res.redirect("/");
});

//route to show edit form for post 
app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    //sending post data to edit 
    res.render("edit", { post });
});

//route to handle editing 
app.post("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    post.title = req.body.title;
    post.content = req.body.content;
    //route back to home page
    res.redirect("/");
});

//route to delete post
app.post("/delete/:id", (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    // go back to homepage 
    res.redirect("/");
});

//start server listen for port 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});