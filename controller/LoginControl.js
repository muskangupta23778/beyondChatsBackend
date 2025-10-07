const jwt = require('jsonwebtoken');
const {
  validateRegisterInput,
  validateLoginInput,
  findUserByEmail,
  createUser,
  passwordsMatch,
} = require('../functions/LoginFunction');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// POST /api/auth/register
async function register(req, res) {
  try {
    const parsed = req.validated || validateRegisterInput(req.body);
    if (!parsed.isValid) return res.status(400).json({ message: parsed.errors.join(', ') });

    const existing = await findUserByEmail(parsed.email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await createUser({
      name: parsed.name,
      email: parsed.email,
      password: parsed.password,
      role: parsed.role,
    });
    const { password: _pw, ...safe } = user.toObject();
    return res.status(201).json({ user: safe });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const parsed = req.validated || validateLoginInput(req.body);
    if (!parsed.isValid) return res.status(400).json({ message: parsed.errors.join(', ') });

    const user = await findUserByEmail(parsed.email);
    if (!user) return res.status(401).json({ message: 'User doesnt exist' });

    if (!passwordsMatch(parsed.password, user.password)) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password= _pw, ...safe } = user.toObject();
    return res.json({ token, user: safe });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

module.exports = { register, login };


