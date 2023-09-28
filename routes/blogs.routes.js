const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware");
const { Blog } = require("../models/blog.model");

const blogRouter = express.Router();

//get all blogs

blogRouter.get("/blogs", verifyToken, async (req, res) => {
	// console.log(req.user)
	try {
		const blogs = await Blog.find();
		res.status(200).send({ blogs: blogs });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});

//get blogs by title

blogRouter.get("/blogs/title", async (req, res) => {
	try {
		const { title } = req.query;
		const blogs = await Blog.find({ title });
		res.status(200).send({ blogs: blogs });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});

//get blogs by category

blogRouter.get("/blogs/category", async (req, res) => {
	try {
		const { category } = req.query;
		const blogs = await Blog.find({ category });
		res.status(200).send({ blogs: blogs });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});

//sort by date

blogRouter.get("/blogs/sort", async (req, res) => {
	try {
		const { order } = req.query;
		const sortOrder = order === "asc" ? 1 : -1;
		const blogs = await Blog.find().sort({
			date: sortOrder,
		});
		res.status(200).send({ blogs: blogs });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});

//create a new blog

blogRouter.post("/blogs/create", verifyToken, async (req, res) => {
	try {
		const { username, title, content, category } = req.body;
		const blog = new Blog({
			username,
			title,
			content,
			category,
			date: new Date(),
			likes: 0,
			comments: [],
		});
		await blog.save();
		res.status(200).send({ msg: "Blog created Sucessfully.", blog: blog });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});

//update a blog

blogRouter.patch("/blogs/update/:id", verifyToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { title, content, category } = req.body;

		const updatedBlog = await Blog.findOneAndUpdate(
			{ _id: id },
			{ title, content, category },
			{ new: true },
		);
		res
			.status(200)
			.send({ msg: "Blog updated Sucessfully.", blog: updatedBlog });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});

//delete a blog
blogRouter.delete("/blogs/delete/:id", verifyToken, async (req, res) => {
	try {
		const { id } = req.params;
		const deletedBlog = await Blog.findOneAndDelete({
			_id: id,
		});
		res
			.status(200)
			.send({ msg: "Blog updated Sucessfully.", blog: deletedBlog });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});

//like a blog

blogRouter.patch("/blogs/:id/like", async (req, res) => {
	try {
		const { id } = req.params;

		const likedBlog = await Blog.findOneAndUpdate(
			{ _id: id },
			{
				$inc: { likes: 1 },
			},
		);
		res.status(200).send({ msg: "Blog liked sucessfully." });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});
//comment on a blog

blogRouter.patch("/blogs/:id/comment", async (req, res) => {
	try {
		const { id } = req.params;
		const { username, comment } = req.body;

		const commentedBlog = await Blog.findOneAndUpdate(
			{ _id: id },
			{
				$push: { comments: { username, comment } },
			},
		);
		res.status(200).send({ msg: "Blog commented sucessfully." });
	} catch (err) {
		console.log(err);
		res.status(500).send({ msg: err.message });
	}
});

module.exports = { blogRouter };
