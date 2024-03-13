const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModal');

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandotory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exist");
    }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    console.log(`user created ${user}`);

    if (user) {
        res.status(201).json({ id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandotory");
    }
    const user = await User.findOne({ email });

    //compare password with hash password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });

        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or Password is not valid");
    }

});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
    // res.status(200).json({ message: 'Current user information' });
});

module.exports = { registerUser, loginUser, currentUser };