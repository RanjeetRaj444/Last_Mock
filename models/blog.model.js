const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
	username: { type: String, required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
	category: {
		type: String,
		required: true,
		enum: ["Business", "Tech", "LifeStyle", "Entertainment"],
	},
	date: { type: String, default: Date.now },
	likes: { type: Number, default: 0 },
	comments: [
		{
			username: { type: String, required: true },
			content: { type: String, required: true },
		},
	],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Blog };
