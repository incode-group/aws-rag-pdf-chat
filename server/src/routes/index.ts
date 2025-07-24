import { Router } from 'express';
import { getPresignedUrl } from '../controllers/s3.controller';

const router = Router();

router.post('/presigned-url', getPresignedUrl);

export default router;
