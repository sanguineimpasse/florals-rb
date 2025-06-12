const express = require('express');
const bcrypt = require('bcryptjs');

if(process.env.NODE_ENV !== 'production'){
  const path = require('path');
  const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const router = express.Router();
const User = require('../models/user');
const connectToDatabase = require('../lib/mongo');

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

const enableDebug = false;

router.post('/create-user', async (req, res) => {
  return res.status(403).json({message: "This route is locked - for now..."});

  const { username, password } = req.body;  

  //simple input validation
  if(!username && !password && !username != undefined && !password != undefined){
    return res.status(400).json({ message: "Invalid inputs detected." });
  }

  try{
    await connectToDatabase();

    //check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //second param is the salt rounds
    await User.create({username: username, password: hashedPassword});
    res.status(200).json({message: "User created successfully.", username: username});
  } catch(error){
    console.log("Failed in creation of user: " + error);
    res.status(500).json({ message: "Internal Server Error: Failed to create a new user" });
  }
});

router.post('/login', async (req, res) => {
  const { SignJWT } = await import('jose');

  //return res.status(403).json({message: "This route is locked - for now..."});
  enableDebug && console.log("loggin user in...");
  const {username, password} = req.body;

  //simple input validation
  if(!username && !password && !username != undefined && !password != undefined){
    return res.status(400).json({ message: "Invalid inputs detected." });
  }

  try{
    await connectToDatabase();

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(jwtSecret);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only use 'secure' in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // 'none' allows cross-origin
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    enableDebug && console.log('login success');
    res.status(200).json({ message: 'Login success' });
  } catch(error){
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error: Failed to login' });
  }

});

router.post('/logout', (req, res) => {
  //console.log("logging user out")
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

//checks if the user session is still valid
router.get('/session', async (req, res) => {
  const { jwtVerify } = await import('jose'); //can't be imported using commonjs syntax
  
  enableDebug && console.log("checking user status");
  
  const token = req.cookies.token;
  if (!token){
    enableDebug && console.log("user is not logged in");
    return res.status(200).json({ isLoggedIn: false });
  }

  try {
    const { payload } = await jwtVerify(token, jwtSecret);
    enableDebug && console.log("user is logged in");
    res.status(200).json({ isLoggedIn: true, userId: payload.userId });
  } catch (error) {
    enableDebug && console.log("server error while checking user session \n" + error);
    res.status(500).json({ message: JSON.stringify(error) });
  }
});

module.exports = router;