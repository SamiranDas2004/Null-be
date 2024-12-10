import Admin from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();


    res.status(201).json({ msg: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Optionally, generate a JWT token for the admin (if you are using token-based authentication)
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
    'bkjkabbafbDHNBFBbajb', // Make sure you have a JWT_SECRET set in your environment
      { expiresIn: '8h' } // You can adjust the expiration time as needed
    );

    // Respond with success and send the admin details along with the token
    res.status(200).json({
      msg: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      token, // Send the token to be used for further authentication
    });
  } catch (error) {
    console.error('Error logging in admin:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};