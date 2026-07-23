import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'veer_admin_default_secret_key_2026';

/**
 * Signs a JWT token with the admin payload.
 * Expires in 7 days.
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies a JWT token. Returns payload or null if invalid/expired.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
