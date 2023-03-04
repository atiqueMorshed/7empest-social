import expressAsyncHandler from "express-async-handler";

export const getPosts = expressAsyncHandler(async (req, res, next) => {
	const { username } = req.body;
	res.status(200).send(username);
});

export const createPost = expressAsyncHandler(async (req, res, next) => {
	const { username } = req.body;
	res.status(200).send(username);
});
