import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css"


export default function Authentication({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isSignup) {
        res = await axios.post("http://localhost:3000/users/", form, { withCredentials: true });
      } else {
        res = await axios.post("http://localhost:3000/auth/login", form, { withCredentials: true });
      }

      if (res.data.user) {
        setUserData(res.data.user);
        setIsAuthenticated(true);
        onAuth(res.data.user);
        navigate("/board");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Whiteboard App</h1>
        <h2 className="text-xl font-semibold mb-6 text-center">{isSignup ? "Sign Up" : "Login"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSignup && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-2 text-sm text-center">{error}</p>}

        <button
          className="mt-4 text-blue-500 hover:underline w-full"
          onClick={() => setIsSignup(!isSignup)}
        >
          Switch to {isSignup ? "Login" : "Sign Up"}
        </button>

        {isAuthenticated && userData && (
          <div className="mt-4 text-center text-green-600">
            <h2 className="font-semibold">Welcome, {userData.username}!</h2>
          </div>
        )}
      </div>
    </div>
  );
}

