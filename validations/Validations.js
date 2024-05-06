import { body } from "express-validator";

export const loginValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен быть минимум 6 символов").isLength({
        min: 6,
    }),
];

export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен быть минимум 6 символов").isLength({
        min: 6,
    }),
    body("fullName", "Имя должно быть минимум 5 символов").isLength({ min: 5 }),
    body("avatarUrl", "Неверная ссылка").optional().isURL(),
];

export const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
    body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
    body("tags", "Неверный формат тэга").optional().isString(),
    body("imageUrl", "Неверный формат изображения").optional().isString(),
];
