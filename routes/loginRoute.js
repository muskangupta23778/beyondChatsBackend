const express = require('express');
const router = express.Router();

const { register, login } = require('../controller/LoginControl');
const {
  validateRegisterInput,
  validateLoginInput,
  findUserByEmail,
} = require('../functions/LoginFunction');

async function preRegister(req, res, next) {
  try {
    const parsed = validateRegisterInput(req.body);
    if (!parsed.isValid) {
      return res.status(400).json({ message: parsed.errors.join(', ') });
    }

    const existing = await findUserByEmail(parsed.email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    req.validated = parsed;
    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Pre-register check failed', error: err.message });
  }
}

async function preLogin(req, res, next) {
  try {
    const parsed = validateLoginInput(req.body);
    if (!parsed.isValid) {
      return res.status(400).json({ message: parsed.errors.join(', ') });
    }
    req.validated = parsed;
    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Pre-login check failed', error: err.message });
  }
}

router.post('/register', preRegister, register);
router.post('/login', preLogin, login);

module.exports = router;


