const Report = require('../models/Report');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Vedic astrology calculation helpers
function getAscendant(hour, minute, lat, lon) {
    // Simplified placeholder for lagna calculation
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const timeDecimal = hour + minute / 60;
    const idx = Math.floor(((timeDecimal + lon / 15) % 24) / 2) % 12;
    return signs[idx];
}

function getPlanetPositions(dob) {
    const date = new Date(dob);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    // Approximate simplified positions
    return {
        Sun: signs[Math.floor(((month - 1) + (day > 20 ? 1 : 0)) % 12)],
        Moon: signs[(month + day) % 12],
        Mars: signs[(month + 3) % 12],
        Mercury: signs[(month + 1) % 12],
        Jupiter: signs[Math.floor(year / 12) % 12],
        Venus: signs[(month + 2) % 12],
        Saturn: signs[Math.floor(year / 30) % 12],
        Rahu: signs[(month * 2) % 12],
        Ketu: signs[(month * 2 + 6) % 12],
    };
}

function getDasha(dob) {
    const planets = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
    const durations = [6, 10, 7, 18, 16, 19, 17, 7, 20];
    const birthYear = new Date(dob).getFullYear();
    const startIdx = birthYear % planets.length;
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    let accumulated = 0;
    for (let i = 0; i < planets.length; i++) {
        const idx = (startIdx + i) % planets.length;
        accumulated += durations[idx];
        if (accumulated > age % 120) {
            return {
                current: planets[idx],
                duration: `${durations[idx]} years`,
                subDasha: planets[(idx + 1) % planets.length],
            };
        }
    }
    return { current: planets[0], duration: '6 years', subDasha: planets[1] };
}

function getCompatibility(lagna) {
    const scores = { Aries: 78, Taurus: 82, Gemini: 75, Cancer: 88, Leo: 85, Virgo: 79, Libra: 83, Scorpio: 91, Sagittarius: 77, Capricorn: 80, Aquarius: 73, Pisces: 87 };
    return scores[lagna] || 80;
}

exports.generateKundali = async (req, res) => {
    try {
        const { name, dateOfBirth, timeOfBirth, placeOfBirth, language = 'en' } = req.body;
        if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
            return res.status(400).json({ error: 'Name, date of birth, time of birth, and place of birth are required' });
        }

        const [hour, minute] = timeOfBirth.split(':').map(Number);
        const lagna = getAscendant(hour, minute, 22.5, 88.3); // Default to Kolkata coords
        const planets = getPlanetPositions(dateOfBirth);
        const dasha = getDasha(dateOfBirth);
        const compatibility = getCompatibility(lagna);

        const isPremium = req.user && (req.user.subscription.plan !== 'free' || req.user.walletBalance >= 49);

        // Fetch dynamic interpretation from OpenAI
        const targetLanguage = language === 'bn' ? 'Bengali' : 'English';
        const prompt = `You are a Vedic Astrologer. A user named ${name} was born with Lagna(Ascendant) in ${lagna}. 
        Planets: Sun in ${planets.Sun}, Moon in ${planets.Moon}, Jupiter in ${planets.Jupiter}.
        Current Mahadasha is ${dasha.current}.

        Write a summary of their Kundali. The text values MUST be written entirely in the ${targetLanguage} language, BUT the JSON keys MUST remain strictly in English exactly as shown below.
        Return strictly a JSON object formatted exactly like this:
        {
          "lagnaDescription": "String",
          "freeSummary": "String (Short 2 sentence overview)",
          "fullReport": {
            "strengths": ["String", "String"],
            "weaknesses": ["String", "String"],
            "career": "String",
            "love": "String",
            "remedies": ["String", "String"],
            "auspiciousDates": ["String", "String"]
          }
        }`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiResponse = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
        });

        const interpretation = JSON.parse(aiResponse.response.text());

        const kundali = {
            name,
            dateOfBirth,
            timeOfBirth,
            placeOfBirth,
            lagnaChart: {
                ascendant: lagna,
                description: interpretation.lagnaDescription || `Your lagna (ascendant) is ${lagna}.`
            },
            planetPositions: planets,
            dasha: { ...dasha, description: `You are currently in ${dasha.current} mahadasha with ${dasha.subDasha} antardasha.` },
            compatibilityScore: compatibility,
            freeSummary: interpretation.freeSummary,
        };

        if (isPremium) {
            kundali.fullReport = interpretation.fullReport;
        } else {
            kundali.premiumPrompt = 'Unlock your complete Kundali analysis including career, love, remedies, and auspicious dates.';
        }

        // Save to DB if user is logged in
        if (req.user) {
            const report = await Report.create({
                user: req.user._id,
                type: 'kundali',
                tier: isPremium ? 'mini' : 'free',
                inputData: { name, dateOfBirth, timeOfBirth, placeOfBirth },
                result: kundali,
                isPaid: false,
            });
            kundali.reportId = report._id;
        }

        res.json({ kundali });
    } catch (err) {
        console.error('OpenAI Kundali Error:', err);
        res.status(500).json({ error: err.message || 'Error generating Kundali' });
    }
};
