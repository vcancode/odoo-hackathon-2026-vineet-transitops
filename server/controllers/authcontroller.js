import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loginUser = async (req, res) => {
    try {

        // 1. Get credentials from request body
        const { email, password } = req.body;

        // 2. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password."
            });
        }

        // 3. Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // 4. Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // 5. Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // 6. Send Success Response
        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};