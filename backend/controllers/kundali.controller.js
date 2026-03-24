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

function calculateMoonSign(dob, language = 'en') {
    const signsEn = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signsBn = ['মেষ (Aries)', 'বৃষ (Taurus)', 'মিথুন (Gemini)', 'কর্কট (Cancer)', 'সিংহ (Leo)', 'কন্যা (Virgo)', 'তুলা (Libra)', 'বৃশ্চিক (Scorpio)', 'ধনু (Sagittarius)', 'মকর (Capricorn)', 'কুম্ভ (Aquarius)', 'মীন (Pisces)'];
    
    const birthDate = new Date(dob);
    const j2000 = new Date('2000-01-01T12:00:00Z');
    const diffDays = (birthDate - j2000) / (1000 * 60 * 60 * 24);
    
    let moonLong = (218.316 + diffDays * 13.17639) % 360;
    if (moonLong < 0) moonLong += 360;
    
    const rashiIdx = Math.floor(moonLong / 30);
    const nakshatraIdx = Math.floor(moonLong / (360/27));
    
    const nakshatras = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
        "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];

    return {
        rashi: language === 'bn' ? signsBn[rashiIdx] : signsEn[rashiIdx],
        nakshatra: nakshatras[nakshatraIdx % 27]
    };
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

        const isPremium = req.user && (req.user.subscription.plan !== 'free' || req.user.walletBalance >= 21);

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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let interpretation;
        try {
            const aiResponse = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
            });
            interpretation = JSON.parse(aiResponse.response.text());
        } catch (error) {
            console.error('AI Quota or Fetch Error, using fallback:', error);
            interpretation = {
                lagnaDescription: `Your lagna (ascendant) is ${lagna}. This placement suggests a natural leadership quality and a strong personality focused on ${lagna.toLowerCase()} traits.`,
                freeSummary: `Your chart shows significant planetary alignments in ${lagna}. This is a time of personal growth and discovery.`,
                fullReport: {
                    strengths: ["Persistence", "Intuition"],
                    weaknesses: ["Overthinking", "Impulsiveness"],
                    career: "Opportunities involve leadership and creative problem solving.",
                    love: "Relationships thrive on mutual respect and shared interests.",
                    remedies: ["Wear a crystal pendant", "Practice morning meditation"],
                    auspiciousDates: ["Every Monday", "15th of each month"]
                }
            };
        }

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

exports.calculateRashi = async (req, res) => {
    try {
        const { name, dateOfBirth, timeOfBirth, placeOfBirth, language = 'en' } = req.body;
        if (!dateOfBirth || !timeOfBirth || !placeOfBirth) {
            return res.status(400).json({ error: 'Date, time, and place of birth are required' });
        }

        const targetLanguage = language === 'bn' ? 'Bengali' : 'English';
        const prompt = `You are an expert Vedic Astrologer. Calculate the exact Vedic Moon Sign (Rashi) and Nakshatra (Birth Star) for a person born on:
        Date: ${dateOfBirth}
        Time: ${timeOfBirth}
        Place: ${placeOfBirth}
        
        Provide the response strictly as a JSON object, with text in the ${targetLanguage} language (but keys in English), formatted exactly like this:
        {
          "rashi": "String (The Moon Sign/Rashi name)",
          "nakshatra": "String (The Nakshatra name)",
          "description": "String (A 2-3 sentence positive description of their personality based on this Rashi and Nakshatra)"
        }`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let rashiData;
        try {
            const aiResponse = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
            });
            rashiData = JSON.parse(aiResponse.response.text());
        } catch (error) {
            console.error('AI Rashi Quota Error, using mathematical fallback:', error);
            const fallback = calculateMoonSign(dateOfBirth, language);
            rashiData = {
                rashi: fallback.rashi,
                nakshatra: fallback.nakshatra,
                description: language === 'bn' 
                    ? `আপনার রাশি হল ${fallback.rashi} এবং নক্ষত্র হল ${fallback.nakshatra}। এটি একটি খুব শুভ সংকেত যা আপনার জীবনের উন্নতি নির্দেশ করে।`
                    : `Your Moon Sign is ${fallback.rashi} and birth star is ${fallback.nakshatra}. This placement suggests a natural depth of character and success through persistent effort.`
            };
        }
        res.json(rashiData);
    } catch (err) {
        console.error('AI Rashi Calculation Error:', err);
        res.status(500).json({ error: 'Failed to calculate Rashi and Nakshatra.' });
    }
};
