import mongoose from 'mongoose';

const RateListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // Storing as YYYY-MM-DD string for easy querying
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ['kg', 'piece'],
        default: 'kg',
      },
    }
  ],
  note: {
    type: String,
    default: "",
  },
}, { timestamps: true });

// Ensure a user can only have one rate list per date
RateListSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.RateList || mongoose.model('RateList', RateListSchema);
