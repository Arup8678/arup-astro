const Report = require('../models/Report');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzePalmReading = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Please upload a palm image' });

        const imagePath = req.file.path; // Cloudinary URL
        const isPremium = req.user && req.user.subscription.plan !== 'free';

        // Fetch image and convert to base64
        const imgResponse = await axios.get(imagePath, { responseType: 'arraybuffer' });
        const mimeType = imgResponse.headers['content-type'];
        const imagePart = {
            inlineData: {
                data: Buffer.from(imgResponse.data).toString("base64"),
                mimeType
            }
        };

        const prompt = `You are an expert palm reader (Palmist). Analyze this image of a palm. Return the analysis STRICTLY as a JSON object with this exact structure: {"palmType": "String", "lifeLine": "String", "heartLine": "String", "headLine": "String", "fateLine": "String", "overallScore": Number (0-100)}. Do not include markdown code block syntax formatting or any other text, just the raw JSON.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiResponse = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const analysis = JSON.parse(aiResponse.response.text());

        const result = {
            imagePath: imagePath,
            freeSummary: `Your palm reveals a ${analysis.palmType || 'Mixed'} hand type. ${analysis.lifeLine}`,
            overallScore: analysis.overallScore || 85,
            lifeLine: analysis.lifeLine,
        };

        if (isPremium) {
            result.fullAnalysis = {
                heartLine: analysis.heartLine,
                headLine: analysis.headLine,
                fateLine: analysis.fateLine,
                personalityInsights: `Your hand reveals a ${analysis.palmType} personality — creative, emotionally aware, and driven by instinct.`,
                careerInsights: 'Your head line indicates natural aptitude for analytical or creative fields. The fate line suggests entrepreneurial success.',
                relationshipInsights: `Your heart line shows a deep capacity for emotion.`,
                remedies: ['Wear a copper bracelet on Tuesday', 'Meditate while holding a crystal', 'Write your goals every new moon'],
            };
        } else {
            result.premiumPrompt = 'Unlock your full palm reading: heart line, head line, fate line, career & relationship insights.';
        }

        if (req.user) {
            const report = await Report.create({
                user: req.user._id,
                type: 'palm',
                tier: isPremium ? 'full' : 'free',
                imageUrl: imagePath,
                result,
                isPaid: isPremium,
            });
            result.reportId = report._id;
        }

        res.json({ result });
    } catch (err) {
        console.error('OpenAI Palm Error:', err);
        res.status(500).json({ error: err.message || 'Error analyzing palm' });
    }
};

exports.analyzeFaceReading = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Please upload a face image' });

        const imagePath = req.file.path; // Cloudinary URL
        const isPremium = req.user && req.user.subscription.plan !== 'free';

        // Fetch image and convert to base64
        const imgResponse = await axios.get(imagePath, { responseType: 'arraybuffer' });
        const mimeType = imgResponse.headers['content-type'];
        const imagePart = {
            inlineData: {
                data: Buffer.from(imgResponse.data).toString("base64"),
                mimeType
            }
        };

        const prompt = `You are an expert face reader (Physiognomy). Analyze this face. Return the analysis STRICTLY as a JSON object with this exact structure: {"faceShape": "String (e.g. Oval, Round...)", "eyes": "String", "nose": "String", "forehead": "String", "smile": "String", "wealthIndicator": "String (e.g. High, Moderate...)", "personalityTraits": "String summary", "leadershipScore": Number (0-100), "spiritualityScore": Number (0-100)}. Do not include markdown code block syntax formatting or any other text, just the raw JSON.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiResponse = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const analysis = JSON.parse(aiResponse.response.text());

        const result = {
            imagePath: imagePath,
            faceShape: analysis.faceShape,
            freeSummary: `Your ${analysis.faceShape} face shape indicates ${analysis.personalityTraits}.`,
            leadershipScore: analysis.leadershipScore || 75,
        };

        if (isPremium) {
            result.fullAnalysis = {
                eyes: `Your ${analysis.eyes} eyes reveal deep intuition and emotional depth.`,
                nose: `Your nose structure (${analysis.nose}) indicates a strong business acumen and material awareness.`,
                forehead: `A prominent forehead (${analysis.forehead}) signals intellectual capacity and natural analytical skills.`,
                smile: `Your smile pattern (${analysis.smile}) reveals openness, trustworthiness, and social magnetism.`,
                personalityInsights: analysis.personalityTraits,
                wealthIndicator: analysis.wealthIndicator,
                spiritualityScore: analysis.spiritualityScore || 60,
                careerSuggestions: ['Technology & Innovation', 'Creative Arts', 'Leadership & Management'],
                remedies: ['Meditate facing east at sunrise', 'Keep a moonstone near your workspace', 'Practice gratitude daily'],
            };
        } else {
            result.premiumPrompt = 'Unlock your complete face reading: eyes, nose, forehead, wealth indicators, and leadership analysis.';
        }

        if (req.user) {
            const report = await Report.create({
                user: req.user._id,
                type: 'face',
                tier: isPremium ? 'full' : 'free',
                imageUrl: imagePath,
                result,
                isPaid: isPremium,
            });
            result.reportId = report._id;
        }

        res.json({ result });
    } catch (err) {
        console.error('OpenAI Face Error:', err);
        res.status(500).json({ error: err.message || 'Error analyzing face' });
    }
};
