import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Example: For 10-digit phone numbers
    },
    email: {
      type: String,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Basic email validation
    },
    eventId: {
      type: String,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

export default EventRegistration;

