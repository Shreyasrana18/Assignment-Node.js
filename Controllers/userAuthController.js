const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).send({ message: 'Please provide all the fields' });
    }

    if (password.length < 2) {
        res.status(400).send({ message: 'Password must be atleast 6 characters long' });

    }

    if (username.length < 3) {
        res.status(400).send({ message: 'Username must be atleast 3 characters long' });
    }
    if (!email.includes('@')) {
        res.status(400).send({ message: 'Please provide a valid email' });
    }

    const userValid = await User.findOne({ email });
    const userName = await User.findOne({ username });
    if (userValid) {
        res.status(400).send({ message: 'User already exists with the same email' });
    }
    if (userName) {
        res.status(400).send({ message: 'User already exists with the same username' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });


    res.status(201).json({ message: 'User created successfully', user: { username: user.username, email: user.email } });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send({ message: 'Please provide all the fields' });
    }
    if (!email.includes('@')) {
        res.status(400).send({ message: 'Please provide a valid email' });
    }
    const user = await User.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    res.status(200).json({
        user: {
            username: user.username,
            email: user.email,
            notes: user.notes.count,
        }, token
    });
    res.status(200).json({ message: 'Login route' });
});

const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ user });
});

module.exports = { signup, login,me };