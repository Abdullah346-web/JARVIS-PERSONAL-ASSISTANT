import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    voiceSpeed: {
      type: Number,
      min: 0.5,
      max: 2,
      default: 1,
    },
    voiceGender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    assistantNameChanged: {
      type: Boolean,
      default: false,
    },
    assistantAvatarChanged: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
