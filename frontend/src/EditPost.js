import React, { useState } from "react";

//edit post allows users to update an existing post
function EditPost({ post, setEditingPost, fetchPosts }) {
    //initialize local state with current state
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:5000/api/blogs/${post.id}`, {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            credentials: "include",
            body: JSON.stringify({ title, content }),
        });

        if (res.ok) {
            //notify that post was updated
            alert("Post updated successfully!");
            setEditingPost(null);
            fetchPosts();
        } else {
            alert("Error updating post");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Edit Post</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Edit title"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit Content"
              required
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingPost(null)}>
                Cancel
            </button>
        </form>
    );
}

export default EditPost; 