import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate({ path: "user", select: ["fullName", "avatarUrl"] })
            .exec()
        res.json(posts)
    } catch (error) {
        res.status(500).json({
            message: "Не удалось получить посты",
            error: err.message,
        })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: "After" }
        )

            .then((doc) => res.json(doc))

            .catch((err) =>
                res.status(500).json({ message: "Статья не найдена" })
            )
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось получить посты",
        })
    }
}
export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete({ _id: postId })

            .then((doc) => res.json(doc))

            .catch((err) =>
                res.status(500).json({ message: "Статья не удалена" })
            )
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось удалить пост",
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save()
        res.json(post)
    } catch (err) {
        res.status(500).json({
            message: "Не удалось создать пост",
            error: err.message,
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }
        )
        res.json({ message: "Пост обновлен" })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось обновить пост",
        })
    }
}
