import { Router } from 'express';
import { createEvent, updateEvent,deleteEvent,getAllEvents, getEventById } from '../controllers/eventController.js';
import { upload } from '../helper/multer.js';
import { createRegistration } from '../controllers/eventRegisterController.js';
const eventRouter=Router()

eventRouter.route("/create").post(upload.single('image'), createEvent);
eventRouter.route('/edit/:id').put(updateEvent);
eventRouter.route('/delete/:id').delete(deleteEvent);
eventRouter.route('/getall').get(getAllEvents)
eventRouter.route('/getall/:id').post(getEventById)
eventRouter.route('/join').post(createRegistration)
export default eventRouter