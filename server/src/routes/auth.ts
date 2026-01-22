import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import { database } from '../db/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Sign up with email/password
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await database.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create user
    const result = await database.run(
      'INSERT INTO users (email, name, password_hash, verification_token) VALUES (?, ?, ?, ?)',
      [email, name, passwordHash, verificationToken]
    );

    // Create default tenant for user
    const tenantResult = await database.run(
      'INSERT INTO tenants (name, subdomain) VALUES (?, ?)',
      [`${name}'s Workspace`, `tenant-${result.lastID}`]
    );

    // Link user to tenant
    await database.run(
      'INSERT INTO user_tenants (user_id, tenant_id, role) VALUES (?, ?, ?)',
      [result.lastID, tenantResult.lastID, 'owner']
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.lastID, tenantId: tenantResult.lastID },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Get user data
    const user = await database.get(
      'SELECT id, email, name, avatar, created_at FROM users WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user,
      tenant: { id: tenantResult.lastID, name: `${name}'s Workspace` }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in with email/password
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user
    const user = await database.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user's tenant
    const userTenant = await database.get(
      `SELECT t.id, t.name, t.subdomain, t.plan 
       FROM tenants t 
       JOIN user_tenants ut ON t.id = ut.tenant_id 
       WHERE ut.user_id = ? AND ut.role = 'owner'`,
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, tenantId: userTenant?.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Remove sensitive data
    const { password_hash, verification_token, ...safeUser } = user;

    res.json({
      message: 'Signed in successfully',
      token,
      user: safeUser,
      tenant: userTenant
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await database.get('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email]);

    if (user) {
      // Update Google ID if needed
      if (!user.google_id) {
        await database.run('UPDATE users SET google_id = ?, avatar = ? WHERE id = ?', [googleId, picture, user.id]);
        user.google_id = googleId;
        user.avatar = picture;
      }
    } else {
      // Create new user
      const result = await database.run(
        'INSERT INTO users (email, name, google_id, avatar, email_verified) VALUES (?, ?, ?, ?, ?)',
        [email, name, googleId, picture, true]
      );

      // Create default tenant
      const tenantResult = await database.run(
        'INSERT INTO tenants (name, subdomain) VALUES (?, ?)',
        [`${name}'s Workspace`, `tenant-${result.lastID}`]
      );

      // Link user to tenant
      await database.run(
        'INSERT INTO user_tenants (user_id, tenant_id, role) VALUES (?, ?, ?)',
        [result.lastID, tenantResult.lastID, 'owner']
      );

      user = {
        id: result.lastID,
        email,
        name,
        google_id: googleId,
        avatar: picture,
        email_verified: true
      };
    }

    // Get user's tenant
    const userTenant = await database.get(
      `SELECT t.id, t.name, t.subdomain, t.plan 
       FROM tenants t 
       JOIN user_tenants ut ON t.id = ut.tenant_id 
       WHERE ut.user_id = ? AND ut.role = 'owner'`,
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, tenantId: userTenant?.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Remove sensitive data
    const { password_hash, verification_token, ...safeUser } = user;

    res.json({
      message: 'Google authentication successful',
      token,
      user: safeUser,
      tenant: userTenant
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { userId, tenantId } = (req as any).user;

    // Get user data
    const user = await database.get(
      'SELECT id, email, name, avatar, email_verified, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get tenant data
    const tenant = await database.get(
      'SELECT id, name, subdomain, plan, settings FROM tenants WHERE id = ?',
      [tenantId]
    );

    res.json({
      user,
      tenant
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = (req as any).user;
    const { name, avatar } = req.body;

    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }

    if (avatar) {
      updates.push('avatar = ?');
      params.push(avatar);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(userId);

    await database.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Get updated user
    const user = await database.get(
      'SELECT id, email, name, avatar, email_verified, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (client-side token removal, but we can blacklist if needed)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router; 