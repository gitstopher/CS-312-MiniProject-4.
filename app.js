// imported modules
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const app = express();
//port number 
const PORT = 5000;

//in memory database
const users = [];
const posts = [];

//set engine to react 
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

//middleware using body-parser 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));

//setup for authentication
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: "lax"
    }
}));

// made logged in user available to all
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Get all posts
app.get("/api/blogs", (req, res) => {
    const sorted = posts.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
    res.json(sorted);
});

//signup page route
app.post("/signup", async (req, res) => {
    const { user_id, password, name } = req.body;
    
    if (users.find(u => u.user_id === user_id)) {
        return res.status(400).json({ error: "User ID already exists. Please choose another."});   
    }

    const newUser = { user_id, password, name };
    users.push(newUser);
    req.session.user = newUser;
    res.json({ success: true });
});

//route to signin page
app.post("/signin", async (req, res) => {
    const { user_id, password } = req.body;
    const user = users.find(u => u.user_id === user_id);

    if(!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid user ID or password"});
    }
    
    req.session.user = user;
    res.json({ success: true, user});    
});

//logout route
app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true});
    });
});

// route to add new post 
app.post("/api/blogs", async (req, res) => {
    //check if the correct user is logging in 
    const user = req.session.user;
    //if not user send to signin page
    if (!user) return res.status(401).json({ error: "Not signed in"});
    
    const { title, content } = req.body;
    const id = posts.length + 1;
    const newPost = {
        id,
        creator_user_id: user.user_id,
        creator_name: user.name,
        title,
        content,
        date_created: new Date()
    };
    posts.push(newPost);
    res.json({ success: true });
});


//route to show edit form for post 
app.put("/api/blogs/:id", async (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Not signed in" });

    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found"});
    if (post.creator_user_id !== user.user_id) return res.status(403).json({ error: "Unauthorized edit" });
        
    post.title = req.body.title;
    post.content = req.body.content;

    //sending post data to edit 
    res.json({ success: true });
});

//route to delete post
app.delete("/api/blogs/:id", async (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Not signed in" });

    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Post not found" });
    if (posts[index].creator_user_id !== user.user_id) return res.status(403).json({ error: "Unauthorized delete" });

    posts.splice(index, 1);
    res.json({ success: true });
});

//start server listen for port 
app.listen(PORT, () => {
    console.log(`API Server running at http://localhost:${PORT}`);
});