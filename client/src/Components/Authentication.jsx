import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Authentication({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // track if the user is authenticated
  const [userData, setUserData] = useState(null); // store user data like username
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isSignup) {
        // Sign up request
        res = await axios.post("http://localhost:3000/users/", { email: form.email, password: form.password, username: form.username }, { withCredentials: true });
      } else {
        // Login request
        res = await axios.post("http://localhost:3000/auth/login", {
          email: form.email,
          password: form.password
        }, { withCredentials: true });
      }

      // If user data exists after signup/login, update user state
      if (res.data.user) {
        setUserData(res.data.user);
        setIsAuthenticated(true);
        onAuth(res.data.user); // Call the onAuth function passed as prop to update global state
        navigate("/board"); // Redirect to the board after successful login/signup
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Whiteboard App</h1>
      <h3>{isSignup ? "Sign Up" : "Login"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {isSignup && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        )}
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? "Login" : "Sign Up"}
      </button>

      {/* Display welcome message after successful sign-up/login */}
      {isAuthenticated && userData && (
        <div>
          <h2>Welcome, {userData.username}!</h2>
        </div>
      )}
    </div>
  );
}
