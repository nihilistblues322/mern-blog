import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
    .connect(
        "mongodb+srv://msc:boss555@cluster0.07mhw54.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        console.log("DB OK");
    })
    .catch((err) => {
        console.log("DB ERROR", err);
    });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/auth/login", (req, res) => {
    const token = jwt.sign(
        {
            email: req.body.email,
            fullName: "Vasya",
        },
        "secret123"
    );

    res.json({
        success: true,
        token,
    });
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("start");
});
