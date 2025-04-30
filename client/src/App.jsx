import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Board from "./Components/Board";
import Authentication from "./Components/Authentication";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ Track loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/status", { withCredentials: true });
		console.log("Bhalu", response.data.user)
        setUser(response.data.user); // ✅ Set user
      } catch (error) {
        setUser(null); // ❌ Not authenticated
      } finally {
        setLoading(false); // ✅ Done loading
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // ⏳ Show something while checking

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication onAuth={setUser} />} />
        <Route
          path="/board"
          element={user ? <Board user={user} setUser={setUser} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
