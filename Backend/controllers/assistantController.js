import Assistant from '../models/Assistant.js';
import Settings from '../models/Settings.js';
import User from '../models/User.js';

const assistantTemplates = {
  JARVIS: {
    description: 'Voice controlled AI assistant',
    glowColor: '#00D4FF',
    avatar: '/src/assets/jarvis.webp',
  },
  ECHO: {
    description: 'Responsive and adaptive AI assistant',
    glowColor: '#FF006E',
    avatar: '/src/assets/echo.png',
  },
  TITAN: {
    description: 'Powerful and intelligent assistant',
    glowColor: '#8000FF',
    avatar: '/src/assets/titan.webp',
  },
  AURA: {
    description: 'Mystical and intuitive AI companion',
    glowColor: '#00FF88',
    avatar: '/src/assets/aura.jpeg',
  },
  ZENITH: {
    description: 'Peak performance AI assistant',
    glowColor: '#FFB900',
    avatar: '/src/assets/zenith.jpeg',
  },
  ALPHA: {
    description: 'First and finest AI experience',
    glowColor: '#FF0080',
    avatar: '/src/assets/alpha.jpeg',
  },
};

export const ensureActiveAssistant = async (req) => {
  const existingAssistant = await Assistant.findOne({ userId: req.userId, isActive: true });

  if (existingAssistant) {
    return existingAssistant;
  }

  const inactiveAssistant = await Assistant.findOne({ userId: req.userId }).sort({ createdAt: -1 });

  if (inactiveAssistant) {
    inactiveAssistant.isActive = true;
    if (!inactiveAssistant.assistantType) {
      inactiveAssistant.assistantType = 'JARVIS';
    }
    if (!inactiveAssistant.customName) {
      inactiveAssistant.customName = 'Jarvis';
    }
    if (!inactiveAssistant.description) {
      inactiveAssistant.description = assistantTemplates.JARVIS.description;
    }
    if (!inactiveAssistant.glowColor) {
      inactiveAssistant.glowColor = assistantTemplates.JARVIS.glowColor;
    }
    if (!inactiveAssistant.avatar) {
      inactiveAssistant.avatar = assistantTemplates.JARVIS.avatar;
    }

    await inactiveAssistant.save();

    await Settings.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        theme: 'dark',
        voiceSpeed: 1,
        voiceGender: 'male',
        notificationsEnabled: true,
      },
      { upsert: true }
    );

    return inactiveAssistant;
  }

  const template = assistantTemplates.JARVIS;

  const assistant = await Assistant.create({
    userId: req.userId,
    assistantType: 'JARVIS',
    customName: 'Jarvis',
    ...template,
  });

  await Settings.findOneAndUpdate(
    { userId: req.userId },
    {
      userId: req.userId,
      theme: 'dark',
      voiceSpeed: 1,
      voiceGender: 'male',
      notificationsEnabled: true,
    },
    { upsert: true }
  );

  return assistant;
};

// Get all assistant templates
export const getAssistants = async (req, res, next) => {
  try {
    const assistants = Object.entries(assistantTemplates).map(([type, template]) => ({
      type,
      ...template,
    }));

    res.status(200).json({
      success: true,
      assistants,
    });
  } catch (error) {
    next(error);
  }
};

// Select and create user's assistant
export const selectAssistant = async (req, res, next) => {
  try {
    const { assistantType, customName } = req.body;

    if (!assistantType || !customName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide assistant type and custom name',
      });
    }

    if (!assistantTemplates[assistantType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assistant type',
      });
    }

    // Create assistant
    const assistant = await Assistant.create({
      userId: req.userId,
      assistantType,
      customName,
      ...assistantTemplates[assistantType],
    });

    // Create default settings for user
    await Settings.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        theme: 'dark',
        voiceSpeed: 1,
        voiceGender: 'male',
        notificationsEnabled: true,
      },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Assistant selected successfully',
      assistant: {
        id: assistant._id,
        customName: assistant.customName,
        assistantType: assistant.assistantType,
        avatar: assistant.avatar,
        glowColor: assistant.glowColor,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's assistant
export const getUserAssistant = async (req, res, next) => {
  try {
    const assistant = await ensureActiveAssistant(req);

    res.status(200).json({
      success: true,
      assistant: {
        id: assistant._id,
        customName: assistant.customName,
        assistantType: assistant.assistantType,
        avatar: assistant.avatar,
        glowColor: assistant.glowColor,
        description: assistant.description,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update assistant
export const updateAssistant = async (req, res, next) => {
  try {
    const { customName, assistantType } = req.body;

    const assistant = await Assistant.findOneAndUpdate(
      { _id: req.body.assistantId, userId: req.userId },
      {
        ...(customName && { customName }),
        ...(assistantType && { assistantType }),
      },
      { new: true }
    );

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assistant updated successfully',
      assistant,
    });
  } catch (error) {
    next(error);
  }
};
