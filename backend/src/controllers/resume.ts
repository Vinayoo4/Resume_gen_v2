import { Request, Response } from 'express';
import { JsonStorage } from '../storage/index.js';
import { Resume } from '../../../shared/types/resume.js';
import { AuthRequest } from '../middleware/auth.js';

const resumeStorage = new JsonStorage<Resume>('product/resume');

export const getMyResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    let resume = await resumeStorage.findOne(r => r.userId === userId);

    if (!resume) {
      resume = {
        userId,
        slug: `user-${userId}`,
        theme: 'light',
        name: '',
        bio: '',
        links: [],
        sections: [],
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await resumeStorage.insert(resume);
    }

    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const updates = req.body;

    const resume = await resumeStorage.findOne(r => r.userId === userId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const updated = await resumeStorage.update(userId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPublicResume = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const resume = await resumeStorage.findOne(r => r.slug === slug);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Increment view count
    await resumeStorage.update(resume.userId, { views: resume.views + 1 });

    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
