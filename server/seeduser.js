import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

connectDB();

const seedUsers = async () => {

    try {

        await User.deleteMany();

        const password = await bcrypt.hash("123456",10);

        await User.insertMany([

            {
                name:"Fleet Manager",
                email:"fleet@transitops.com",
                password,
                role:"FleetManager"
            },

            {
                name:"Dispatcher",
                email:"dispatcher@transitops.com",
                password,
                role:"Dispatcher"
            },

            {
                name:"Safety Officer",
                email:"safety@transitops.com",
                password,
                role:"SafetyOfficer"
            },

            {
                name:"Finance",
                email:"finance@transitops.com",
                password,
                role:"Finance"
            }

        ]);

        console.log("Users Seeded Successfully");

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);

    }

};

seedUsers();