import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Parse incoming JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form submissions if needed

// ✅ Initialize session BEFORE passport
app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
}));

// ✅ Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Your routes
app.use("/users", userRoutes);
app.use("/auth", authRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Whiteboard App API");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
