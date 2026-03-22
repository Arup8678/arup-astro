const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.register = async (req, res) => {
    try {
        const { name, email, password, referralCode } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Please provide name, email and password' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: 'Email already registered' });

        let referrer = null;
        if (referralCode) {
            referrer = await User.findOne({ referralCode });
        }

        const user = await User.create({
            name, email, password,
            referredBy: referrer ? referrer._id : undefined
        });

        // Reward referrer
        if (referrer) {
            referrer.walletBalance += 20;
            referrer.referralBonus += 20;
            await referrer.save();
        }

        const token = signToken(user._id);
        res.status(201).json({
            message: 'Registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, walletBalance: user.walletBalance, referralCode: user.referralCode }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (!user.isActive) return res.status(403).json({ error: 'Account disabled' });

        const token = signToken(user._id);
        res.json({
            message: 'Logged in successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, walletBalance: user.walletBalance, subscription: user.subscription, referralCode: user.referralCode }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -emailVerificationToken -passwordResetToken');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'No user found with that email' });

        const token = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save({ validateBeforeSave: false });

        // In production, send email here
        res.json({ message: 'Password reset token generated', token }); // Return token for dev
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        const jwtToken = signToken(user._id);
        res.json({ message: 'Password reset successful', token: jwtToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
