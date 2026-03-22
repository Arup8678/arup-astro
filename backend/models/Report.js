const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['horoscope', 'kundali', 'numerology', 'palm', 'face'],
        required: true
    },
    tier: { type: String, enum: ['free', 'mini', 'full', 'premium'], default: 'free' },
    inputData: { type: mongoose.Schema.Types.Mixed },
    result: { type: mongoose.Schema.Types.Mixed },
    pdfUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isPaid: { type: Boolean, default: false },
    paymentId: { type: String },
    isDownloaded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
