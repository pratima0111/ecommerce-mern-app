import User from '../models/userModel.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';

export const registerController = async (req, res) => {
  try {
    const { name, email, password, answer, phone, address } = req.body;
    //validations
    if (!name) {
      return res.send({ error: 'Name is Required' });
    }
    if (!email) {
      return res.send({ message: 'Email is Required' });
    }
    if (!password) {
      return res.send({ message: 'Password is Required' });
    }
    if (!phone) {
      return res.send({ message: 'Phone no is Required' });
    }
    if (!address) {
      return res.send({ message: 'Address is Required' });
    }
    if (!answer) {
      return res.send({ message: 'Answer is Required' });
    }

    //check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'Already Registered, Please Login!',
      });
    }

    //register a new user
    const hashedPassword = await hashPassword(password);
    //save the user info
    const user = await new User({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: 'User Registered Successfully',
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email is not registered!',
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: 'Invalid Password',
      });
    }

    //generate token
    const token = await jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d', //expires in 30 days
    });
    res.status(200).send({
      success: true,
      message: 'Login Successfully!',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in logging',
      error: err,
    });
  }
};

export const forgotPasswordContoller = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: 'Email is required' });
    }
    if (!answer) {
      res.status(400).send({ message: 'Answer is required' });
    }
    if (!newPassword) {
      res.status(400).send({ message: 'New Password is required' });
    }
    //check
    const user = await User.findOne({ email, answer });
    //validation
    if (!user) {
      res.status(404).send({
        success: false,
        message: 'Wrong Email or Answer',
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.status(200).send({
      success: true,
      message: 'Password Reset Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

export const testController = (req, res) => {
  res.send('Protected Route');
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //check for password
    if (password && password.length < 6) {
      return res.json({
        error: 'Password is required and must be greater than 6 character long',
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      success: true,
      message: 'Profile Updated Successfully',
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while updating profile',
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate('buyer', 'name');
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while getting orders',
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate('products', '-photo')
      .populate('buyer', 'name')
      .sort({ createdAt: '-1' });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error While Getting Orders',
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while updating status',
      error,
    });
  }
};
