import mongoose, { Document, Schema } from 'mongoose'

export interface IEvent extends Document {
  title: string
  description: string
  type: 'workshop' | 'seminar' | 'conference' | 'social' | 'sports' | 'cultural' | 'other'
  startDate: Date
  endDate: Date
  location: string
  organizer: mongoose.Types.ObjectId
  maxParticipants?: number
  currentParticipants: number
  registrationDeadline?: Date
  isRegistrationRequired: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  attachments?: string[]
  tags?: string[]
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['workshop', 'seminar', 'conference', 'social', 'sports', 'cultural', 'other'],
    default: 'other'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxParticipants: {
    type: Number,
    min: 1
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationDeadline: {
    type: Date
  },
  isRegistrationRequired: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  attachments: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

EventSchema.index({ startDate: 1 })
EventSchema.index({ type: 1 })
EventSchema.index({ status: 1 })
EventSchema.index({ tags: 1 })

EventSchema.pre('save', function(this: IEvent, next: any) {
  if (this.endDate < this.startDate) {
    next(new Error('End date must be after start date'))
  } else {
    next()
  }
})

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)
