import User from './user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, identifier, department, level, className, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      identifier: identifier || 'ID-' + Math.floor(Math.random() * 9000 + 1000),
      department: department || 'Computer Science',
      level: level || 'HND 1',
      className: className || 'BA1A',
      phone: phone || '',
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        identifier: newUser.identifier,
        department: newUser.department,
        level: newUser.level,
        className: newUser.className,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = String(email).trim();
    const queryLower = query.toLowerCase();

    // Normalize variations: with 0 or without 0 before @ (e.g. ADESIMON@GMAIL.COM, adesimon0@gmail.com, adesimon@gmail.com)
    const without0 = queryLower.replace(/0(?=@)/, '');
    const with0 = queryLower.includes('@') && !queryLower.includes('0@')
      ? queryLower.replace('@', '0@')
      : queryLower;

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: query },
          { email: queryLower },
          { email: with0 },
          { email: without0 },
          { identifier: query },
          { identifier: query.toUpperCase() },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Your account has been suspended or deactivated.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        identifier: user.identifier,
        department: user.department,
        level: user.level,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive or suspended' });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    const user = await User.findByPk(userId || req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is not correct. Password was not changed.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, avatar, phone, hideInfo, name } = req.body;
    const targetId = userId || req.user?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    let user = null;
    if (typeof targetId === 'number' || !isNaN(Number(targetId))) {
      user = await User.findByPk(Number(targetId));
    }
    if (!user) {
      user = await User.findOne({
        where: {
          [Op.or]: [
            { email: String(req.body.email || '') },
            { identifier: String(req.body.identifier || targetId) },
          ],
        },
      });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found in system' });
    }

    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (hideInfo !== undefined) user.hideInfo = hideInfo;
    if (name && user.role !== 'admin') user.name = name;

    await user.save();

    // If student, also update students table
    try {
      const { Student } = await import('../models.js');
      if (Student) {
        await Student.update(
          {
            ...(avatar !== undefined ? { avatar } : {}),
            ...(phone !== undefined ? { phone } : {}),
          },
          {
            where: {
              [Op.or]: [
                { userId: user.id },
                { matricNumber: user.identifier },
                { email: user.email },
              ],
            },
          }
        );
      }
    } catch (e) {
      console.warn('Could not sync to students table:', e.message);
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        identifier: user.identifier,
        avatar: user.avatar,
        phone: user.phone,
        hideInfo: user.hideInfo,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
};