const express = require('express');
const router = express.Router();

const { createUserActivity, getUserActivityByEmail } = require('../controller/userActivityController');
const { checkUser } = require('../middleware/auth');

router.post('/activity', checkUser, createUserActivity);
router.get('/activity', checkUser, getUserActivityByEmail);

module.exports = router;


