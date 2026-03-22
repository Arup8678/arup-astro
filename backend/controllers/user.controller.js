const User = require('../models/User');
const Report = require('../models/Report');
const Transaction = require('../models/Transaction');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const reportsCount = await Report.countDocuments({ user: req.user._id });
        res.json({ user, reportsCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, dateOfBirth, gender } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, dateOfBirth, gender },
            { new: true, runValidators: true }
        ).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ reports });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReport = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json({ report });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
