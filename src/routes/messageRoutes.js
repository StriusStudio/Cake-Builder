import express from 'express';
import {
  createMessage,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createMessage);

// Admin only routes
router.use(protect, authorize('admin'));
router.get('/', getMessages);
router.get('/:id', getMessage);
router.patch('/:id/status', updateMessageStatus);
router.delete('/:id', deleteMessage);

export default router;
