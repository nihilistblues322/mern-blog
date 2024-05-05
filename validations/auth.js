import { body } from "express-validator";

export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен быть минимум 6 символов").isLength({ min: 6 }),
    body("fullName", "Имя должно быть минимум 5 символов").isLength({ min: 5 }),
    body("avatarUrl", "Неверная ссылка").optional().isURL(),
];
