import React, { useState, useEffect } from "react";
import BlogPostForm from "./BlogPostForm";
import PostList from "./PostList";
import Signin from "./Signin";
import Signup from "./Signup";
import EditPost from "./EditPost"; 
import "./styles.css";

function App() {
  //initializing variables
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  // Get all posts from backend
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");
      const data = await res.json();
      //update post state
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // calls fetch post when component loads
  useEffect(() => {
    fetchPosts();
  }, []);

  // call backend to end session
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout");
    setUser(null);
  };


  return (
    <div className="container">
      <h1>Kris' Mini Blog App</h1>

      {user ? (
        <>
          <p>
            Welcome, <strong>{user.name}</strong>!
          </p>
          <button onClick={handleLogout}>Logout</button>

          {editingPost ? (
            <EditPost
              post={editingPost}
              setEditingPost={setEditingPost}
              fetchPosts={fetchPosts}
            />
          ) : (
            <BlogPostForm fetchPosts={fetchPosts} />
          )}
        </>
      ) : (
        <>
          {showSignup ? (
            <>
              <Signup setUser={setUser} />
              <p>
                Already have an account?{" "}
                <button onClick={() => setShowSignup(false)}>Sign in</button>
              </p>
            </>
          ) : (
            <>
              <Signin setUser={setUser} />
              <p>
                Don’t have an account?{" "}
                <button onClick={() => setShowSignup(true)}>Sign up</button>
              </p>
            </>
          )}
        </>
      )}

      <h2>All Posts</h2>
      <PostList
        posts={posts}
        user={user}
        fetchPosts={fetchPosts}
        setEditingPost={setEditingPost}
      />
    </div>
  );
}

export default App;
