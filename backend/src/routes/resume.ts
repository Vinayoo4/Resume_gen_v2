import { Router } from 'express';
import { getMyResume, updateResume, getPublicResume } from '../controllers/resume.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, getMyResume);
router.put('/me', requireAuth, updateResume);
router.get('/public/:slug', getPublicResume);

export default router;
