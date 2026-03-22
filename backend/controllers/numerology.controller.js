const Report = require('../models/Report');

function getLifePathNumber(dob) {
    const digits = dob.replace(/\D/g, '');
    let sum = digits.split('').reduce((s, d) => s + parseInt(d), 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((s, d) => s + parseInt(d), 0);
    }
    return sum;
}

function getNameNumber(name) {
    const pythagorean = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
    const sum = name.toLowerCase().replace(/[^a-z]/g, '').split('').reduce((s, c) => s + (pythagorean[c] || 0), 0);
    let n = sum;
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
        n = n.toString().split('').reduce((s, d) => s + parseInt(d), 0);
    }
    return n;
}

function getPersonalityNumber(name) {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const pythagorean = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 };
    const sum = name.toLowerCase().split('').filter(c => consonants.includes(c)).reduce((s, c) => s + (pythagorean[c] || 0), 0);
    let n = sum || 1;
    while (n > 9) n = n.toString().split('').reduce((s, d) => s + parseInt(d), 0);
    return n;
}

const LUCKY_MAP = {
    1: { color: 'Gold', stone: 'Ruby', day: 'Sunday', planet: 'Sun' },
    2: { color: 'Silver', stone: 'Moonstone', day: 'Monday', planet: 'Moon' },
    3: { color: 'Yellow', stone: 'Topaz', day: 'Thursday', planet: 'Jupiter' },
    4: { color: 'Blue', stone: 'Blue Sapphire', day: 'Saturday', planet: 'Uranus' },
    5: { color: 'Green', stone: 'Emerald', day: 'Wednesday', planet: 'Mercury' },
    6: { color: 'Pink', stone: 'Diamond', day: 'Friday', planet: 'Venus' },
    7: { color: 'Violet', stone: 'Amethyst', day: 'Monday', planet: 'Neptune' },
    8: { color: 'Dark Blue', stone: 'Sapphire', day: 'Saturday', planet: 'Saturn' },
    9: { color: 'Red', stone: 'Coral', day: 'Tuesday', planet: 'Mars' },
    11: { color: 'White', stone: 'Opal', day: 'Monday', planet: 'Moon/Neptune' },
    22: { color: 'Gold', stone: 'Diamond', day: 'Sunday', planet: 'Uranus' },
    33: { color: 'Violet', stone: 'Amethyst', day: 'Friday', planet: 'Venus' }
};

const LIFE_PATH_MEANINGS = {
    1: 'The Leader — Independent, ambitious, and driven. You were born to lead and innovate.',
    2: 'The Peacemaker — Cooperative, sensitive, and diplomatic. Harmony is your superpower.',
    3: 'The Creator — Expressive, optimistic, and charming. Your creativity inspires the world.',
    4: 'The Builder — Practical, disciplined, and dependable. You create lasting foundations.',
    5: 'The Explorer — Adventurous, versatile, and free-spirited. Change fuels your soul.',
    6: 'The Nurturer — Responsible, loving, and healing. You are a pillar for others.',
    7: 'The Seeker — Analytical, spiritual, and intuitive. Wisdom is your deepest pursuit.',
    8: 'The Powerhouse — Ambitious, authoritative, and successful. Material mastery is your path.',
    9: 'The Humanitarian — Compassionate, wise, and giving. You inspire transformation in others.',
    11: 'The Visionary — Intuitive master, inspired, and psychically attuned. A spiritual teacher.',
    22: 'The Master Builder — Pragmatic visionary who turns dreams into reality on a grand scale.',
    33: 'The Master Teacher — Compassionate healer and teacher, here to uplift humanity.'
};

exports.calculate = async (req, res) => {
    try {
        const { fullName, dateOfBirth } = req.body;
        if (!fullName || !dateOfBirth) return res.status(400).json({ error: 'Full name and date of birth are required' });

        const lifePath = getLifePathNumber(dateOfBirth);
        const destiny = getNameNumber(fullName);
        const personality = getPersonalityNumber(fullName);
        const luckyNumber = (lifePath + destiny) > 9 ? (lifePath + destiny).toString().split('').reduce((s, d) => s + parseInt(d), 0) : lifePath + destiny;
        const luckyInfo = LUCKY_MAP[luckyNumber] || LUCKY_MAP[1];

        const summary = {
            lifePathNumber: lifePath,
            destinyNumber: destiny,
            personalityNumber: personality,
            luckyNumber,
            luckyColor: luckyInfo.color,
            lifePathMeaning: LIFE_PATH_MEANINGS[lifePath] || LIFE_PATH_MEANINGS[1],
            freeSummary: `${fullName}, your Life Path is ${lifePath} — ${LIFE_PATH_MEANINGS[lifePath]?.split('—')[0] || 'A powerful number'}. Your destiny number is ${destiny}.`
        };

        const isPremium = req.user && req.user.subscription.plan !== 'free';
        if (isPremium) {
            summary.fullReport = {
                luckyStone: luckyInfo.stone,
                luckyDay: luckyInfo.day,
                rulingPlanet: luckyInfo.planet,
                careerInsights: `With Life Path ${lifePath}, you thrive in ${lifePath <= 3 ? 'creative, leadership' : lifePath <= 6 ? 'service, healing' : 'spiritual, research'} careers.`,
                loveCompatibility: `Most compatible with Life Path ${(lifePath % 9) + 1} and ${((lifePath + 2) % 9) + 1}.`,
                yearPrediction: `In 2026, your personal year is ${getLifePathNumber('2026' + dateOfBirth.slice(4))}. Expect major shifts in ${lifePath % 2 === 0 ? 'relationships and home' : 'career and identity'}.`,
                remedies: [`Meditate on the number ${lifePath}`, `Wear ${luckyInfo.color} on ${luckyInfo.day}`, `Carry a ${luckyInfo.stone} stone`]
            };
        } else {
            summary.premiumPrompt = 'Unlock your complete numerology report including lucky stone, ruling planet, love compatibility, and 2026 predictions.';
        }

        if (req.user) {
            const report = await Report.create({
                user: req.user._id,
                type: 'numerology',
                tier: isPremium ? 'full' : 'free',
                inputData: { fullName, dateOfBirth },
                result: summary,
                isPaid: false,
            });
            summary.reportId = report._id;
        }

        res.json({ result: summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
