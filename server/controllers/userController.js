import User from "../models/userModel.js";
import { hashPassword, comparePasswords } from "../utils/hashPassword.js";
import { generateAuthToken } from "../utils/generateAuthToken.js";

export const getUsers = async (req, res, next) => {
  try {
    let searchQuery = req.query.search || "";
    let query = {};
    if (searchQuery) {
      query = {
        $or: [
          { firstName: { $regex: new RegExp(searchQuery, "i") } },
          { lastName: { $regex: new RegExp(searchQuery, "i") } },
          { email: { $regex: new RegExp(searchQuery, "i") } },
        ],
      };
    }
    const users = await User.find(query).select("-password").orFail();
    return res.json({ users: users });
  } catch (err) {
    next(err);
  }
};

export const makeAdmin = async (req, res, next) => {
  try {
    let id = req.params.id;

    const user = await User.findOneAndUpdate(
      { _id: id },
      { isAdmin: true }
    ).orFail();
    return res.status(201).json({ successful: true });
  } catch (err) {
    next(err);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber)
      return res.status(400).send("All input fields are required");
    const hashedPassword = hashPassword(password);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format!" });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(400).json({ error: "User already exists!" });
    } else {
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phoneNumber,
      });
      res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.firstName,
            user.lastName,
            user.email,
            user.isAdmin,
            user.isSuperAdmin
          ),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        )
        .status(201)
        .json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          isSuperAdmin:user.isSuperAdmin
        });
    }
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password} = req.body;
    if (!email || !password)
      res.status(400).json({ error: "All input fields are required" });

    const user = await User.findOne({ email: email }).orFail();

    if (user && comparePasswords(password, user.password)) {
      let cookieParams = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      return res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.firstName,
            user.lastName,
            user.email,
            user.isAdmin,
            user.isSuperAdmin,
          ),
          cookieParams
        )
        .status(200)
        .json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          isSuperAdmin:user.isSuperAdmin,
        });
    } else {
      res.status(401).json({ error: "Wrong Credentials" });
    }
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      res.status(400).json({ error: "Account does not exist, please sign up" });
    } else {
      next(err);
    }
  }
};