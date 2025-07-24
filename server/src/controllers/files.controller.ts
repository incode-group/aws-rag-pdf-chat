import { Request, Response } from 'express';
import { getFileInfo, getAIResponse } from '../services/files.service';

export const getFileStatus = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
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

export const askAI = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { query } = req.body;
    if (!key || !query) {
      return res
        .status(400)
        .json({ error: 'key and query are required in the request body' });
    }
    const aiResponse = await getAIResponse(query, key);

    if (!aiResponse) {
      return res.status(400).json({
        error: "Couldn't generate an AI response",
      });
    }

    res.json({ response: aiResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed generate an AI response' });
  }
};
