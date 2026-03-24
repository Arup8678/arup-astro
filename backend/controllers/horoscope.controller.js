const Report = require('../models/Report');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

const HOROSCOPE_DATA = {
    aries: {
        daily: { general: "Mars energizes your spirit today. Bold moves open new doors.", love: "Venus aligns favorably—express your feelings openly.", career: "A creative spark brings recognition from superiors.", health: "High energy; channel it into physical activity.", lucky: { number: 7, color: 'Red', time: 'Morning' } },
        weekly: { general: "Power week for Aries! Planetary alignment favors initiative and leadership.", love: "Relationships deepen with honest communication.", career: "New projects bring exciting challenges. Step up!", health: "Watch your stress levels midweek." },
        monthly: { general: "March brings transformation. Mars in your sign amplifies ambition.", love: "Mid-month brings romantic opportunities. Stay open.", career: "Career advancement likely around the 15th—be ready.", health: "Focus on diet and rest in the last week." }
    },
    taurus: {
        daily: { general: "Venus blesses your day with beauty and material comfort.", love: "Stability in relationships; steady affection wins hearts.", career: "Methodical work pays off—your patience will be rewarded.", health: "Soothing activities benefit your wellbeing.", lucky: { number: 6, color: 'Green', time: 'Afternoon' } },
        weekly: { general: "A grounding week for Taurus. Focus on home and finances.", love: "Long-term bonds strengthen. Singles may meet someone reliable.", career: "Financial gains possible through careful investment.", health: "Indulge in mindful practices." },
        monthly: { general: "Venus highlights beauty, love, and abundance throughout March.", love: "A meaningful relationship deepens. Trust your heart.", career: "Steady gains—avoid hasty financial decisions.", health: "Consistent routine brings lasting wellness." }
    },
    gemini: {
        daily: { general: "Mercury sharpens your mind for exceptional communication today.", love: "Witty banter sparks connection. Share your ideas freely.", career: "Multitasking is your superpower now. Tackle complex tasks.", health: "Mental rest is as important as physical rest.", lucky: { number: 5, color: 'Yellow', time: 'Evening' } },
        weekly: { general: "Social energy is high for Gemini. Connections open unexpected doors.", love: "Flirtation turns into something meaningful. Enjoy the journey.", career: "Collaborative projects yield excellent results.", health: "Keep a balanced schedule to avoid burnout." },
        monthly: { general: "Mercury retrograde early in the month—double-check all communications.", love: "Old flames might resurface. Choose wisely.", career: "Clarity returns mid-month; decision-making improves.", health: "Mind-body wellness practices are especially beneficial." }
    },
    cancer: { daily: { general: "The Moon heightens your intuition. Trust your inner voice.", love: "Emotional bonds deepen naturally. Nurture those you love.", career: "Creativity flows; use it to solve workplace challenges.", health: "Rest and comfort support your emotional balance.", lucky: { number: 2, color: 'Silver', time: 'Night' } }, weekly: { general: "Home and family take center stage this week.", love: "Deep emotional conversations bring you closer to loved ones.", career: "Your intuitive approach earns respect from colleagues.", health: "Nurture your emotional wellbeing." }, monthly: { general: "Lunar cycles bring powerful emotional insights this month.", love: "Deep connections thrive. Let your guard down.", career: "Recognition for past efforts arrives around the 20th.", health: "Focus on gut health and emotional wellness." } },
    leo: { daily: { general: "The Sun illuminates your path. This is your moment to shine!", love: "Generosity and warmth attract love into your life.", career: "Leadership qualities are on full display. Take charge.", health: "Vitality is high—enjoy being active and outdoors.", lucky: { number: 1, color: 'Gold', time: 'Noon' } }, weekly: { general: "Leo's radiance attracts positive attention all week.", love: "Romance blossoms when you show your authentic self.", career: "Creative ventures and leadership roles bring success.", health: "Maintain your energy with balanced nutrition." }, monthly: { general: "March spotlights your talents and natural charisma.", love: "Passionate connections ignite. Be bold in love.", career: "A major career milestone may materialize.", health: "Heart health deserves attention. Stay active." } },
    virgo: { daily: { general: "Mercury guides you toward precision and helpful service today.", love: "Small thoughtful gestures have a huge impact on your partner.", career: "Detail-oriented work leads to impressive results.", health: "Organize your wellness routine for better results.", lucky: { number: 5, color: 'Navy', time: 'Morning' } }, weekly: { general: "A productive week for Virgo. Systems and organization are key.", love: "Show love through acts of service—it resonates deeply.", career: "Analysis and planning produce superior outcomes.", health: "Digestive health needs attention—eat mindfully." }, monthly: { general: "Mercury enhances analytical power throughout March.", love: "Practical expressions of love strengthen bonds.", career: "Efficiency improvements lead to significant recognition.", health: "Consistent healthy routines yield visible improvements." } },
    libra: { daily: { general: "Venus graces you with harmony and elegant solutions today.", love: "Partnership energies are high. Balance giving and receiving.", career: "Diplomatic skills resolve workplace tensions beautifully.", health: "Balance work and rest for optimal wellness.", lucky: { number: 6, color: 'Pink', time: 'Afternoon' } }, weekly: { general: "Relationships of all kinds flourish this week.", love: "Romance is favored; couples' harmony deepens.", career: "Collaborative efforts produce better results than solo work.", health: "Keep activities balanced—don't overextend." }, monthly: { general: "Venus emphasizes beauty, balance, and partnership in March.", love: "A romantic breakthrough may occur mid-month.", career: "Partnerships and deals proceed favorably.", health: "Balance is the theme—work, rest, and play in equal measure." } },
    scorpio: { daily: { general: "Pluto intensifies your perception. Hidden truths come to light.", love: "Intensity in romance; deep connections are transformative.", career: "Research and investigation yield powerful insights.", health: "Release emotional tension through movement or meditation.", lucky: { number: 8, color: 'Maroon', time: 'Midnight' } }, weekly: { general: "Powerful transformation energy surrounds Scorpio this week.", love: "Passionate connections intensify. Trust your intuition.", career: "Strategic moves behind the scenes pay off powerfully.", health: "Detox and cleanse both body and mind." }, monthly: { general: "Pluto drives deep transformation and rebirth in March.", love: "Old relationship patterns transform. Choose depth over drama.", career: "Investigative skills uncover career-shifting opportunities.", health: "Focus on mental and emotional healing this month." } },
    sagittarius: { daily: { general: "Jupiter expands your horizons. Adventure calls to your spirit.", love: "Philosophical conversations bring romantic sparks.", career: "Big-picture thinking impresses decision-makers.", health: "Outdoor activities and travel boost your wellbeing.", lucky: { number: 3, color: 'Purple', time: 'Dawn' } }, weekly: { general: "Expansion and optimism fuel an exciting week for Sagittarius.", love: "New romantic possibilities appear through travel or learning.", career: "International or academic connections prove valuable.", health: "Adventurous activities energize body and mind." }, monthly: { general: "Jupiter's expansive energy brings opportunity and growth in March.", love: "Love through shared adventures—explore together.", career: "Higher education or global opportunities arise.", health: "Stay active; sedentary habits drain your vitality." } },
    capricorn: { daily: { general: "Saturn rewards your discipline with tangible progress today.", love: "Reliability and commitment deepen your romantic bonds.", career: "Structured effort yields significant professional gains.", health: "Bone and joint health deserves attention today.", lucky: { number: 8, color: 'Brown', time: 'Early Morning' } }, weekly: { general: "Hard work and discipline define a successful week for Capricorn.", love: "Serious commitment conversations may arise—embrace them.", career: "Steady progress toward long-term goals is highlighted.", health: "Structure your wellness routine for lasting results." }, monthly: { general: "Saturn emphasizes responsibility, ambition, and achievement in March.", love: "Commitment and long-term planning strengthen bonds.", career: "Career milestones within reach through consistent effort.", health: "Focus on skeletal health, posture, and rest." } },
    aquarius: { daily: { general: "Uranus sparks innovation and humanitarian impulses today.", love: "Unconventional approaches to romance create exciting connections.", career: "Innovative ideas impress and set you apart from peers.", health: "Mental stimulation is vital—feed your curiosity.", lucky: { number: 4, color: 'Electric Blue', time: 'Evening' } }, weekly: { general: "Aquarius channels future-forward energy all week.", love: "Friendship evolving into romance is possible this week.", career: "Technology and innovation bring career advantages.", health: "Social connections significantly boost your wellbeing." }, monthly: { general: "Uranus accelerates innovation and social consciousness in March.", love: "Unique bonds form through shared vision and ideals.", career: "Tech-forward ideas attract exciting opportunities.", health: "Group activities and social wellness practices energize you." } },
    pisces: { daily: { general: "Neptune heightens your spiritual sensitivity and creativity today.", love: "Romantic dreams may manifest. Open your heart to magic.", career: "Creative and artistic work flows effortlessly.", health: "Water-based activities and meditation nourish your spirit.", lucky: { number: 7, color: 'Sea Green', time: 'Dusk' } }, weekly: { general: "Spiritual and creative energy flows beautifully for Pisces.", love: "Soulmate connections are highlighted. Trust the universe.", career: "Creative projects attract recognition and opportunities.", health: "Water therapy and spiritual practices restore your energy." }, monthly: { general: "Neptune deepens spiritual awareness and creative expression in March.", love: "Soulful connections and romantic dreams become reality.", career: "Artistic or spiritual work reaches a widening audience.", health: "Emotional and spiritual cleansing brings profound renewal." } }
};

function getSign(sign) {
    return ZODIAC_SIGNS.includes(sign.toLowerCase()) ? sign.toLowerCase() : null;
}

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getHoroscope = async (req, res) => {
    try {
        const { sign, period = 'daily' } = req.params;
        const { language = 'en' } = req.query;
        const cleanSign = getSign(sign);
        if (!cleanSign) return res.status(400).json({ error: 'Invalid zodiac sign' });
        if (!['daily', 'weekly', 'monthly'].includes(period)) return res.status(400).json({ error: 'Period must be daily, weekly, or monthly' });

        const isPremium = req.user ? (req.user.subscription.plan !== 'free' || (req.user.walletBalance > 0)) : false;

        // Fetch dynamic horoscope from OpenAI
        const targetLanguage = language === 'bn' ? 'Bengali' : 'English';
        const prompt = `You are an expert astrologer. Write a beautifully written, engaging ${period} horoscope for ${cleanSign}. 
        The text values MUST be written in the ${targetLanguage} language, BUT the JSON keys MUST remain strictly in English exactly as shown below.
        Return strictly a JSON object with this shape: 
        { "general": "String", "love": "String", "career": "String", "health": "String", "lucky": { "number": Number, "color": "String", "time": "String" } }`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let data;
        try {
            const aiResponse = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
            });
            data = JSON.parse(aiResponse.response.text());
        } catch (error) {
            console.error('AI Quota or Fetch Error, using fallback:', error);
            // Fallback to static data if AI fails
            data = HOROSCOPE_DATA[cleanSign][period];
        }

        const response = {
            sign: cleanSign.charAt(0).toUpperCase() + cleanSign.slice(1),
            period,
            general: data.general,
            date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            isPremium
        };

        if (isPremium || period === 'daily') {
            response.love = data.love;
            response.career = data.career;
        }
        if (isPremium) {
            response.health = data.health;
            if (data.lucky) response.lucky = data.lucky;
        } else {
            response.premiumTease = "Unlock love, career, health insights and lucky charms with a premium plan.";
        }

        res.json(response);
    } catch (err) {
        console.error('OpenAI Horoscope Error:', err);
        res.status(500).json({ error: err.message || 'Error generating horoscope' });
    }
};

exports.getAllSigns = (req, res) => {
    const signs = ZODIAC_SIGNS.map(s => ({ name: s.charAt(0).toUpperCase() + s.slice(1), id: s }));
    res.json({ signs });
};
