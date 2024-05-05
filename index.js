import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";

mongoose
    .connect(
        "mongodb+srv://msc:boss555@cluster0.07mhw54.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        console.log("DB OK");
    })
    .catch((err) => {
        console.log("DB ERROR", err);
    });

const app = express();
app.use(express.json());

app.post("/auth/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(404)
                .json({ message: "Неверный email или пароль" });
        }

        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );
        if (!isValidPassword) {
            return res
                .status(400)
                .json({ message: "Неверный email или пароль" });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        res.status(500).json({
            message: "Не удалось авторизовать пользователя",
            error: err.message,
        });
    }
});

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });
        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        res.status(500).json({
            message: "Что-то пошло не так",
            error: err.message,
        });
    }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("start");
});
