import { Router } from 'express';
import { getPresignedUrl } from '../controllers/s3.controller';
import { askAI, getFileStatus } from '../controllers/files.controller';

const router = Router();

router.post('/presigned-url', getPresignedUrl);

router.get('/file-status', getFileStatus);

router.post('/ask-ai', askAI);

export default router;
