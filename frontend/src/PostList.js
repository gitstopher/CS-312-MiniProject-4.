import React from "react";

//shows all posts in a list
function PostList({ posts, user, fetchPosts, setEditingPost }) {
    //function to delete post
    const handleDelete = async (id) => {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        //if not successful show error
        if (res.ok) fetchPosts();
        else alert("Error deleting post");
    };

    //show theres no posts
    if (!posts.length) {
        return <p>No posts yet.</p>;
    }

    return (
        <div className="posts">
            {posts.map((post) => ( 
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <small>
                        By {post.creator_name} on {" "}
                        {new Date(post.date_created).toLocaleString()}
                    </small>
                    <br />
                    {user && user.user_id === post.creator_user_id && (
                        <>
                          <button onClick={() => setEditingPost(post)}>Edit</button>
                          <button onClick={() => handleDelete(post.id)}>Delete</button>
                        </>
                    )}
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default PostList;