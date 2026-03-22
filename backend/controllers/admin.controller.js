const User = require('../models/User');
const Report = require('../models/Report');
const Transaction = require('../models/Transaction');

exports.getDashboard = async (req, res) => {
    try {
        const [totalUsers, totalReports, totalTransactions, recentUsers] = await Promise.all([
            User.countDocuments(),
            Report.countDocuments(),
            Transaction.countDocuments({ status: 'success' }),
            User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
        ]);

        const revenue = await Transaction.aggregate([
            { $match: { status: 'success', type: 'purchase' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            stats: {
                totalUsers,
                totalReports,
                totalTransactions,
                totalRevenue: revenue[0]?.total || 0,
            },
            recentUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password');
        const total = await User.countDocuments();
        res.json({ users, total, pages: Math.ceil(total / limit), page });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.isActive = !user.isActive;
        await user.save();
        res.json({ message: `User ${user.isActive ? 'activated' : 'disabled'}`, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 }).limit(50).populate('user', 'name email');
        res.json({ reports });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(100).populate('user', 'name email');
        res.json({ transactions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
