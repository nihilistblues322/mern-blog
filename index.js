import express from "express"
import multer from "multer"
import mongoose from "mongoose"
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from "./validations/Validations.js"
import checkAuth from "./utils/checkAuth.js"
import * as UserController from "./controllers/UserController.js"
import * as PostController from "./controllers/PostController.js"
import handleValidationErrors from "./utils/handleValidationErrors.js"

mongoose
    .connect(
        "mongodb+srv://msc:boss555@cluster0.07mhw54.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        console.log("DB OK")
    })
    .catch((err) => {
        console.log("DB ERROR", err)
    })

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads")
    },
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
})
const upload = multer({ storage })

app.use(express.json())
app.use("/uploads", express.static("uploads"))

app.post(
    "/auth/login",
    loginValidation,
    handleValidationErrors,
    UserController.login
)
app.post(
    "/auth/register",
    registerValidation,
    handleValidationErrors,
    handleValidationErrors,
    UserController.register
)
app.get("/auth/me", checkAuth, UserController.getMe)

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get("/posts", PostController.getAll)
app.get("/posts/:id", PostController.getOne)
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create
)
app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update
)
app.delete("/posts/:id", checkAuth, PostController.remove)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log("start")
})
