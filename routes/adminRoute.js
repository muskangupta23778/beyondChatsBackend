const express = require('express');
const router = express.Router();

const { getAllUserActivities } = require('../controller/adminController');
const { checkAdmin } = require('../middleware/auth');

router.get('/admin/activities',checkAdmin, getAllUserActivities);

module.exports = router;


