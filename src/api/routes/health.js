import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

export default router;
