import { Request, Response } from 'express';
import { generateUploadURL } from '../services/s3.service';

export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { key, contentType } = req.body;
    if (!key || !contentType) {
      return res
        .status(400)
        .json({ error: 'key and contentType are required' });
    }
    if (contentType !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    const url = await generateUploadURL(key, contentType);
    res.json({ url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
};
