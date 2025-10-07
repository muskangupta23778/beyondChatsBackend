const User = require('../model/User');

function normalizeEmail(email) {
  return typeof email === 'string' ? email.toLowerCase().trim() : '';
}

function validateRegisterInput(body) {
  const errors = [];
  const name = (body && body.name ? String(body.name) : '').trim();
  const email = normalizeEmail(body && body.email);
  const password = body && body.password ? String(body.password) : '';
  const role = body && body.role ? String(body.role) : undefined;

  if (!name) errors.push('name is required');
  if (!email) errors.push('email is required');
  if (!password) errors.push('password is required');

  return { isValid: errors.length === 0, errors, name, email, password, role };
}

function validateLoginInput(body) {
  const errors = [];
  const email = normalizeEmail(body && body.email);
  const password = body && body.password ? String(body.password) : '';

  if (!email) errors.push('email is required');
  if (!password) errors.push('password is required');

  return { isValid: errors.length === 0, errors, email, password };
}

async function findUserByEmail(email) {
  return User.findOne({ email });
}

async function createUser({ name, email, password, role }) {
  const payload = {
    name: name.trim(),
    email,
    password,
  };
  if (role && ['user', 'admin'].includes(role)) payload.role = role;
  return User.create(payload);
}

function passwordsMatch(plain, stored) {
  return plain === stored;
}

module.exports = {
  normalizeEmail,
  validateRegisterInput,
  validateLoginInput,
  findUserByEmail,
  createUser,
  passwordsMatch,
};


