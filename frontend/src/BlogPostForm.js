import React, {useState} from "react";

//allows logged in users to create blog posts
function BlogPostForm({ fetchPosts }) {
    //variables storing input values
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    //submit form function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/blogs", {
           //send post request to backend 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title,content }),
        });

        //if post was successfully created
        if (res.ok) {
            setTitle("");
            setContent("");
            fetchPosts();
        } else {
            alert("Error adding post");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="post-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post..."
              required
            ></textarea>
            <button type="submit">Add Post</button>
        </form>
    );
}

export default BlogPostForm;