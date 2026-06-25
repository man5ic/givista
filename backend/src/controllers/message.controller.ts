/**
 * Message Controller
 * 
 * Handles messaging between users.
 */

import { Response } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../middleware/auth.middleware';
import Message from '../models/Message.model';
import User from '../models/User.model';

/**
 * POST /api/v1/messages
 * Send a message
 */
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, text } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required',
      });
    }

    if (req.user.id === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself',
      });
    }

    // Verify receiver exists
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found',
      });
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      text: text.trim(),
    });

    // Include sender and receiver info
    const messageWithUsers = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: messageWithUsers,
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
};

/**
 * GET /api/v1/messages
 * Get messages for the current user (conversations)
 */
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { userId } = req.query; // Optional: filter by specific user
    
    let where: any;
    
    if (userId) {
      const otherUserId = parseInt(userId as string);
      where = {
        [Op.or]: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id },
        ],
      };
    } else {
      where = {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id },
        ],
      };
    }

    const messages = await Message.findAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'photo_url'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'photo_url'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }
};

