// imported modules
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Pool } = require("pg");

const app = express();
//port number 
const PORT = 3000;

//PostgreSQL connection
const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "BlogDb",
    password: "112721Carina!",
    port: 5432,
});

//test connection
pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Database connection error:", err.stack));

//set engine to ejs 
app.set("view engine", "ejs");

//middleware using body-parser 
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

//setup for authentication
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false
}));

// made logged in user available to all
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

//home page route 
app.get("/", async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM blogs ORDER BY date_created DESC");
        res.render("index", {posts: result.rows });
    } catch (err) {
        console.error(err);
        res.send("Error loading posts");
    }
});

//signup page route
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const { user_id, password, name } = req.body;
    try {
        //checks if user already exists
        const existing = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        if (existing.rows.length > 0) {
            return res.send("User ID already exists. Please choose another.");
        }

        await pool.query(
            "INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)",
            [user_id, password, name]
        );
        res.redirect("/signin");
    } catch (err) {
        console.error(err);
        res.send("Error signing up");
    }
});

//route to signin page
app.get("/signin", (req, res) => {
    res.render("signin");
});

app.post("/signin", async (req, res) => {
    const { user_id, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        if (result.rows.length == 0) {
            return res.send("Invalid user ID or password");
        }

        const user = result.rows[0];
        if (user.password !== password) {
            return res.send("Invalid user ID or password");
        }

        req.session.user = user; 
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error signing in");
    }
});

//logout route
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/signin");
    });
});

// route to add new post 
app.post("/add", async (req, res) => {
    const { title, content } = req.body;
    //check if the correct user is logging in 
    const user = req.session.user;
    //if not user send to signin page
    if (!user) return res.redirect("/signin");
    
    try {
        await pool.query(
            "INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES ($1, $2, $3, $4, NOW())",
            [user.name, user.user_id, title, content]
        );
        //redirect back to home page 
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error adding post");
    }
});

//route to show edit form for post 
app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query("SELECT * FROM blogs WHERE blog_id = $1", [id]);
        const post = result.rows[0];
        //sending post data to edit 
        res.render("edit", { post });
    } catch (err) {
        console.error(err);
        res.send("Error loading post for edit");
    }

});

//route to handle editing 
app.post("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    const user = req.session.user;

    try {
        const post = await pool.query("SELECT * FROM blogs WHERE blog_id = $1", [id]);
        if (post.rows.length == 0) return res.send("Post not found");
        if (post.rows[0].creator_user_id !== user.user_id) {
            return res.send("Unauthorized edit");
        }

        await pool.query("UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3", [title, content, id]);
        //route back to home page
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error editing post");
    }
});

//route to delete post
app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const user = req.session.user;

    try {
        const post = await pool.query("SELECT * FROM blogs WHERE blog_id = $1", [id]);
        if (post.rows.length == 0) return res.send("Post not found");
        if (post.rows[0].creator_user_id !== user.user_id) {
            return res.send("Unauthorized delete");
        }
        await pool.query("DELETE FROM blogs WHERE blog_id = $1", [id]);
        // go back to homepage 
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error deleting post");
    }
});

//start server listen for port 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});