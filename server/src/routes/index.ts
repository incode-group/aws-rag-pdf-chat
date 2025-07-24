import { Router } from 'express';

const router = Router();

router.get('/presigned-url', () =>
  console.log('trying to get a presigned url'),
);

export default router;
