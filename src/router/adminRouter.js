import { Router } from 'express';
import { createAdmin, loginAdmin } from '../controllers/adminControllers.js';


const adminRouter=Router()

adminRouter.route("/signup").post(createAdmin);
adminRouter.route("/login").post(loginAdmin)

export default adminRouter