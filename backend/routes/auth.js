const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { success, error: errorRes } = require('../utils/response');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    console.log('[Auth] Register Request:', req.body.username);
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return errorRes(res, 'Username and password are required', 400);
        }
        if (username.length < 3 || username.length > 20) {
            return errorRes(res, 'Username must be 3 to 20 characters', 400);
        }
        if (password.length < 6) {
            return errorRes(res, 'Password must be at least 6 characters', 400);
        }

        const existing = await User.findOne({ username });
        if (existing) {
            return errorRes(res, 'Username already taken', 400);
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashed });
        console.log('[Auth] Attempting to save user to DB...');
        await user.save();
        console.log('[Auth] User saved successfully:', username);

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return success(res, {
            token,
            user: { id: user._id, username: user.username }
        }, 'Account created successfully', 201);
    } catch (err) {
        console.error('Register error:', err);
        return errorRes(res, 'Server error during registration', 500, err.message);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    console.log('[Auth] Login Request:', req.body.username);
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return errorRes(res, 'Username and password are required', 400);
        }

        const user = await User.findOne({ username });
        if (!user) {
            return errorRes(res, 'Invalid username or password', 401);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return errorRes(res, 'Invalid username or password', 401);
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        return success(res, {
            token,
            user: { id: user._id, username: user.username }
        }, 'Login successful');
    } catch (err) {
        console.error('Login error:', err);
        return errorRes(res, 'Server error during login', 500, err.message);
    }
});

module.exports = router;
