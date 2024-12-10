import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  total:{
    type:Number,
    default:0,

  },
  
  image: {
    type: String, // URL to the image
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;
