const express = require('express');
const bcrypt = require('bcryptjs');
const { SignJWT } = require('jose');

if(process.env.NODE_ENV !== 'production'){
  const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const router = express.Router();
const User = require('../models/user');
const connectToDatabase = require('../lib/mongo');

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

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
  //return res.status(403).json({message: "This route is locked - for now..."});
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 // millis * secs * mins * hours
    });

    res.status(200).json({ message: 'Login successful' });
  } catch(error){
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error: Failed to login' });
  }

});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

//checks if the user session is still valid
router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });

  try {
    const { payload } = await jwtVerify(token, jwtSecret);
    res.status(200).json({ loggedIn: true, userId: payload.userId });
  } catch (err) {
    res.status(401).json({ loggedIn: false });
  }
});

module.exports = router;