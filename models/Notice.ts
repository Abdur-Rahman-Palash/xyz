import mongoose, { Document, Schema } from 'mongoose'

export interface INotice extends Document {
  title: string
  content: string
  category: 'general' | 'academic' | 'administrative' | 'emergency'
  priority: 'low' | 'medium' | 'high'
  author: mongoose.Types.ObjectId
  attachments?: string[]
  publishedAt: Date
  expiresAt?: Date
  isActive: boolean
}

const NoticeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'administrative', 'emergency'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    type: String
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

NoticeSchema.index({ publishedAt: -1 })
NoticeSchema.index({ category: 1 })
NoticeSchema.index({ priority: 1 })

export default mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema)
