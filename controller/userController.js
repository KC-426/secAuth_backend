import userSchema from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { uploadUserImageToFirebaseStorage } from "../utils/helperFunction.js";
import { count } from "firebase/firestore";

dotenv.config({ path: "config/.env" });

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password } = req.body;

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Invalid phone number. It must be 10 digits." });
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const findUser = await userSchema.findOne({ email });
    if (findUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists!" });
    }

    const hashedPwd = await bcrypt.hash(password, 12);
    const newUser = new userSchema({
      firstname,
      lastname,
      email,
      password: hashedPwd,
      phone,
    });

    const newUserData = await newUser.save();

    // Create transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_PASS, // your Gmail app-specific password
      },
    });

    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Hello ✔",
      text: `Hello ${firstname} ${lastname}`,
      html: `<b>Hello ${firstname} ${lastname}</b>, you have successfully registered !`,
    });

    console.log("Message sent: %s", info.messageId);

    return res.status(201).json({
      message: "User registered successfully!",
      result: newUserData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userSchema.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "Please sign up !!" });
    }

    const isMatchPassword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { email, userId: findUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("token", token, { httpOnly: true, secure: "production" });

    res
      .status(200)
      .json({ success: true, message: "User logged In", email, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userSchema.find();
    if (!allUsers || allUsers.length <= 0) {
      return res.status(404).json({ message: "No user found !" });
    }
    return res
      .status(200)
      .json({ message: "Users fetched successfully !", allUsers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const fetchUser = await userSchema.findById(userId);
    if (!fetchUser || fetchUser.length <= 0) {
      return res.status(404).json({ message: "No user found !" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully !", fetchUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const getAllUsersCount = async (req, res) => {
  try {
    const totalUsers = await userSchema.find().countDocuments();
    if (!totalUsers || totalUsers.length <= 0) {
      return res.status(404).json({ message: "No user found !" });
    }
    return res.status(200).json({ message: "All users fetched !", totalUsers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const removeUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const findUser = await userSchema.findById(userId);
    if (!findUser || findUser.length <= 0) {
      return res.status(404).json({ message: "User not found !" });
    }

    await userSchema.findByIdAndDelete(userId);
    return res.status(200).json({ message: "User deleted successfully !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const userProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const { email, country, dob, gender } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required !" });
    }

    const findUser = await userSchema.findById(userId);
    if (!findUser || findUser.length <= 0) {
      return res.status(404).json({ message: "User not found !" });
    }

    const findUserWithSameEmail = await userSchema.findOne({ email });
    if (findUserWithSameEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists !" });
    }

    const imageUrl = await uploadUserImageToFirebaseStorage(req, res);

    console.log(findUser.email);

    if (email) findUser.email = email;
    if (country) findUser.country = country;
    if (dob) findUser.dob = dob;
    if (gender) findUser.gender = gender;

    findUser.image = {
      name: imageFile.originalname,
      url: imageUrl,
    };

    await findUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_PASS, // your Gmail app-specific password
      },
    });

    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Hello ✔",
      text: `Hello ${findUser.firstname} ${findUser.lastname}`,
      html: `<b>Hello ${findUser.firstname} ${findUser.lastname}</b>, you have successfully updated your profile !`,
    });

    console.log("Message sent: %s", info.messageId);

    console.log(findUser);

    return res
      .status(200)
      .json({ message: "User profile updated successfully !", findUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};
