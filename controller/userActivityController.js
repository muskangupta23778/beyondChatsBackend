const UserActivity = require('../model/userActivity');

// POST /api/activity
async function createUserActivity(req, res) {
  try {
    const { email, result, attempt, name, strengths, weaknesses } = req.body || {};

    if (!email || !result) {
      return res.status(400).json({ message: 'email and result are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const latest = await UserActivity.findOne({ email: normalizedEmail })
      .sort({ attempt: -1 })
      .select('attempt');

    let nextAttempt;
    if (latest && typeof latest.attempt === 'number') {
      nextAttempt = latest.attempt + 1;
    } else if (attempt !== undefined && attempt !== null && !Number.isNaN(Number(attempt))) {
      nextAttempt = Number(attempt);
    } else {
      nextAttempt = 1;
    }
    console.log("name", name);
    console.log("strengths", strengths);
    console.log("weaknesses", weaknesses);
    const normalizedStrengths = Array.isArray(strengths)
      ? strengths.map((s) => String(s).trim()).filter(Boolean).join(', ')
      : strengths
        ? String(strengths).trim()
        : '';

    const normalizedWeaknesses = Array.isArray(weaknesses)
      ? weaknesses.map((w) => String(w).trim()).filter(Boolean).join(', ')
      : weaknesses
        ? String(weaknesses).trim()
        : '';

    const doc = await UserActivity.create({
      name: name ? String(name).trim() : '',
      email: normalizedEmail,
      result: String(result).trim(),
      attempt: nextAttempt,
      strengths: normalizedStrengths,
      weaknesses: normalizedWeaknesses,
    });

    return res.status(201).json({ activity: doc });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create activity', error: err.message });
  }
}

module.exports = { createUserActivity };

// GET /api/activity?email=someone@example.com
async function getUserActivityByEmail(req, res) {
  try {
    console.log("req.query", req.query);
    const email = req.query && req.query.email ? String(req.query.email).toLowerCase().trim() : '';
    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }
    console.log("email", email);
    const docs = await UserActivity.find({ email }).sort({ attempt: 1 });
    console.log(docs);
    return res.json({ activities: docs });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch activities', error: err.message });
  }
}

module.exports.getUserActivityByEmail = getUserActivityByEmail;


