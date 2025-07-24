import { Request, Response } from 'express';
import { getFileInfo } from '../services/files.service';

export const getFileStatus = async (req: Request, res: Response) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res
        .status(400)
        .json({ error: 'key is required in the query params' });
    }
    const fileInfo = await getFileInfo(String(key));

    if (!fileInfo) {
      return res.status(404).json({
        error: 'File info not found',
      });
    }

    res.json({ status: fileInfo.status });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch file info' });
  }
};
