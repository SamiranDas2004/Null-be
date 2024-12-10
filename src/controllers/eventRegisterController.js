import EventRegistration from "../models/eventRegister.js";
import Event from "../models/eventsModel.js";
import sendVerificationEmail from "../helper/sendEmail.js";

export const createRegistration = async (req, res) => {
  try {
    const { name, contactNumber, email, id } = req.body;

    if (!name || !contactNumber || !email || !id) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const findEvent = await Event.findById(id);

    if (!findEvent) {
      return res.status(404).json({ msg: "Event doesn't exist" });
    }

    const existingRegistration = await EventRegistration.findOne({ email, eventId: id });
    if (existingRegistration) {
      return res.status(409).json({ msg: 'You are already registered for this event' });
    }
    
    const newRegistration = new EventRegistration({
      name,
      contactNumber,
      email,
      eventId:id 
    });


    await newRegistration.save();

    // Update the total registrations for the event
    findEvent.total += 1;
    await findEvent.save();
    
    // await sendVerificationEmail(email)
    res.status(201).json({ msg: 'Registration successful', registration: newRegistration, findEvent });
  } catch (error) {
    console.error('Error creating registration:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
