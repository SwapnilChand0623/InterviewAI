/**
 * Transcription endpoint (stub for Whisper integration)
 */

import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * POST /api/transcribe
 * 
 * Accepts audio file and returns transcript
 * 
 * This is a STUB implementation. To enable real transcription:
 * 1. Install OpenAI SDK: npm install openai
 * 2. Set OPENAI_API_KEY in .env
 * 3. Uncomment the implementation below
 */
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // STUB: Return mock transcript
    const mockTranscript = 'This is a mock transcript. To enable real transcription, integrate OpenAI Whisper API.';

    res.json({
      transcript: mockTranscript,
      duration: 0,
      language: 'en',
    });

    // TODO: Real implementation with Whisper
    /*
    import { OpenAI } from 'openai';
    import fs from 'fs';

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const audioFile = fs.createReadStream(req.file.path);

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      transcript: transcription.text,
      duration: 0,
      language: 'en',
    });
    */
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: 'Transcription failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
