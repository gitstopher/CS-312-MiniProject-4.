import React, {useState } from "react";

function Signup() {
    //variables for form input
    const [user_id, setUserID] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        // send post request to backend signup route
        const res = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, password, name }),
        });
        const data = await res.json();

        if (res.ok) {
            alert("Signup successful! You can now sign in.");
            setUserID("");
            setPassword("");
            setName("");
        } else {
            alert(data.error);
        }
        };

        return (
            <form onSubmit={handleSignup}>
                <h3>Sign Up</h3>
                <input 
                  type="text"
                  placeholder="User ID"
                  value={user_id}
                  onChange={(e) => setUserID(e.target.value)}
                />
                <input 
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>

        );
    }
export default Signup;