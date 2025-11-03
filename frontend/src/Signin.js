import React, { useState } from "react";

//handles user login talks with backend
function Signin({ setUser }) {
    //saves password and ID
    const [user_id, setUserID] = useState("");
    const [password, setPassword] = useState("");

    //runs when the sign in form is submitted
    const handleSignin = async (e) => {
        e.preventDefault();
        //sends login credentials to backend using a POST
        const res = await fetch("http://localhost:5000/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ user_id, password}),
        });
        const data = await res.json();

        if (res.ok) {
            setUser(data.user);
        } else {
            alert(data.error);
        }
    };
    //sign in form UI
    return (
        <form onSubmit={handleSignin}>
            <h3>Sign In</h3>
            <input 
              type="text"
              placeholder="User ID"
              value={user_id}
              onChange={(e) => setUserID(e.target.value)}
            />
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
        </form>
    );
}
export default Signin;