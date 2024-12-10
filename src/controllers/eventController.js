import Event from '../models/eventsModel.js'; // Import the Event model
import { uploadOnCloudinary } from '../helper/cloudinary.js';
import mongoose from 'mongoose';
import EventRegistration from '../models/eventRegister.js';

export const createEvent = async (req, res) => {
  try {
    const { heading, body, date, time } = req.body;

    if (!heading || !body || !date || !time) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const imagePath = req.file?.path;
  
    // Ensure `req.file` exists (Multer should populate this)
    if (!imagePath) {
      return res.status(400).json({ message: 'Image file is required and was not uploaded.' });
    }

    const uploadResult = await uploadOnCloudinary(imagePath);
    const image = uploadResult?.secure_url; // Ensure a valid secure URL is returned
    if (!image) {
      return res.status(500).json({ message: 'Failed to upload image to Cloudinary.' });
    }

    const newEvent = new Event({
      heading,
      body,
      date: new Date(date),
      time,
      image,
    });

    await newEvent.save();

    res.status(201).json({
      msg: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, body, date, time } = req.body;
    const imagePath = req.file?.path;

    if (!heading && !body && !date && !time && !imagePath) {
      return res
        .status(400)
        .json({ msg: 'At least one field (heading, body, date, time, image) is required for update' });
    }

    // Validate and cast the ID to ObjectId (if not already ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid event ID' });
    }

    let image;
    if (imagePath) {
      const uploadResult = await uploadOnCloudinary(imagePath);
      image = uploadResult?.secure_url;

      if (!image) {
        return res.status(500).json({ msg: 'Failed to upload image to Cloudinary' });
      }
    }

    const updateData = {
      ...(heading && { heading }),
      ...(body && { body }),
      ...(date && { date: new Date(date) }),
      ...(time && { time }),
      ...(image && { image }),
    };

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.status(200).json({
      msg: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.status(200).json({
      msg: 'Event deleted successfully',
      event: deletedEvent,
    });
  } catch (error) {
    console.error('Error deleting event:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getAllEvents = async (req, res) => {
  try {

    const events = await Event.find();

    if (events.length === 0) {
      return res.status(404).json({ msg: 'No events found' });
    }
    const eventsWithRegistrations = await Promise.all(
      events.map(async (event) => {
        const registrations = await EventRegistration.find({ eventId: event._id });
        return {
          ...event.toObject(),
          registrations,
        };
      })
    );

    res.status(200).json({
      msg: 'Events and registrations fetched successfully',
      events: eventsWithRegistrations,
    });
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid event ID' });
    }

    // Fetch the event by ID
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Fetch the registrations for the event
    const registrations = await EventRegistration.find({ eventId: id });

    res.status(200).json({
      msg: 'Event and registrations fetched successfully',
      event,
      registrations,
    });
  } catch (error) {
    console.error('Error fetching event by ID:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
