const express = require('express');
const router = express.Router();

const { createUserActivity, getUserActivityByEmail } = require('../controller/userActivityController');
const { checkUserOrAdmin, checkUser } = require('../middleware/auth');

router.post('/activity', checkUser, createUserActivity);
router.get('/activity', checkUserOrAdmin, getUserActivityByEmail);

module.exports = router;


