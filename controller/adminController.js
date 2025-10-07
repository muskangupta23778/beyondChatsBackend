const UserActivity = require('../model/userActivity');

// GET /api/admin/activities
async function getAllUserActivities(req, res) {
  try {
    const activities = await UserActivity.find({}).sort({ createdAt: -1 });
    return res.json({ activities });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch activities', error: err.message });
  }
}

module.exports = { getAllUserActivities };


