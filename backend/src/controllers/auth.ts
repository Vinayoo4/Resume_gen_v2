import { Request, Response } from 'express';
import { JsonStorage } from '../storage/index.js';
import { User } from '../../../shared/types/user.js';
import { generateSalt, hashPassword, verifyPassword } from '../auth/hash.js';
import jwt from 'jsonwebtoken';

const userStorage = new JsonStorage<User>('users/db');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only_123';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await userStorage.findOne(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const newUser: User = {
      id: Date.now().toString(),
      email,
      passwordHash,
      salt,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await userStorage.insert(newUser);

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _hash, salt: _salt, ...publicUser } = newUser;
    res.status(201).json({ user: publicUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await userStorage.findOne(u => u.email === email);
    if (!user || !verifyPassword(password, user.passwordHash, user.salt)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _hash, salt: _salt, ...publicUser } = user;
    res.status(200).json({ user: publicUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
