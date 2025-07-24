import { Request, Response } from 'express';
import { generateUploadURL } from '../services/s3.service';

export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ error: 'key is required' });
    }
    const contentType = 'application/pdf';
    const url = await generateUploadURL(key, contentType);
    res.json({ url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
};
