const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Report = require('../models/Report');
const User = require('../models/User');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.warn('⚠️ Razorpay keys are missing. Payment features will be disabled.');
}

const PLANS = {
    mini: { amount: 4900, label: '₹49 Mini Report' },
    full: { amount: 9900, label: '₹99 Full Report' },
    premium: { amount: 19900, label: '₹199 Premium Destiny Bundle' },
    wallet_100: { amount: 10000, label: 'Wallet Recharge ₹100' },
    wallet_200: { amount: 20000, label: 'Wallet Recharge ₹200' },
    wallet_500: { amount: 50000, label: 'Wallet Recharge ₹500' },
};

exports.createOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        if (!PLANS[plan]) return res.status(400).json({ error: 'Invalid plan selected' });

        const options = {
            amount: PLANS[plan].amount,
            currency: 'INR',
            notes: { userId: req.user._id.toString(), plan, label: PLANS[plan].label }
        };

        const order = await razorpay.orders.create(options);

        await Transaction.create({
            user: req.user._id,
            type: plan.startsWith('wallet') ? 'recharge' : 'purchase',
            amount: PLANS[plan].amount / 100,
            status: 'pending',
            razorpayOrderId: order.id,
            description: PLANS[plan].label,
            metadata: { plan }
        });

        res.json({ order, key: process.env.RAZORPAY_KEY_ID, plan, label: PLANS[plan].label });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, reportId } = req.body;

        const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSig !== razorpay_signature) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Update transaction
        await Transaction.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { status: 'success', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature }
        );

        const user = await User.findById(req.user._id);

        if (plan && plan.startsWith('wallet')) {
            const amounts = { wallet_100: 100, wallet_200: 200, wallet_500: 500 };
            user.walletBalance += amounts[plan] || 0;
        } else if (plan === 'premium') {
            user.subscription = { plan: 'premium', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
        } else if (plan === 'full') {
            user.subscription = { plan: 'full', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
        } else if (plan === 'mini') {
            user.subscription = { plan: 'mini', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
        }

        await user.save();

        if (reportId) {
            await Report.findByIdAndUpdate(reportId, { isPaid: true, paymentId: razorpay_payment_id, tier: plan });
        }

        res.json({ success: true, message: 'Payment verified successfully', walletBalance: user.walletBalance, subscription: user.subscription });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
        res.json({ transactions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPlans = (req, res) => {
    res.json({ plans: PLANS });
};
