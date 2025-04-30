import prisma from "../prisma_client.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const authRouter = express.Router();

passport.use(new LocalStrategy(
  {
    usernameField: 'email',    // 👈 Tell Passport to use 'email' instead of 'username'
    passwordField: 'password'
  },
  async function verify(email, password, cb) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }

      const passwordCompare= await bcrypt.compare(password,user.password)
      console.log(passwordCompare)
      if (!passwordCompare){
        return cb(null, false, {message:'Incorrect email or password'})
        
      }
      return cb(null,user);
    } catch (err) {
      return cb(err);
    }
  }
));

// POST /auth/login
authRouter.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.login(user, function(err) {
      if (err) return next(err);
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});


passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username }); // Store the user ID and username in the session
  });
});
  
passport.deserializeUser(async function(user, cb) {
  try {
    // Retrieve the full user from the database
    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    cb(null, fullUser); // This will store the user object in req.user
  } catch (err) {
    cb(err);
  }
});

  // logout
  authRouter.post('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Failed to log out");
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.send('Logged out');
    });
  });
  
  

  authRouter.get('/status', function(req, res) {
    if (req.isAuthenticated()) {
      return res.json({ user: req.user }); // Send user data if logged in
    } else {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  });
  
export default authRouter;
