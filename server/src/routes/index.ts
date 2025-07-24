import { Router } from 'express';
import { getPresignedUrl } from '../controllers/s3.controller';
import { askAI, getFileStatus } from '../controllers/files.controller';

const router = Router();

router.post('/presigned-url', getPresignedUrl);

router.get('/files/:key/status', getFileStatus);

router.post('/files/:key/ask-ai', askAI);

export default router;
