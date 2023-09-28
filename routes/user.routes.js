const express = require("express");
const bcrypt = require("bcrypt");
// const {check,validationResult} =require("express-")
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const userRouter = express.Router();

//register routes
userRouter.post("/register", async (req, res) => {
	const { username, avtar, email, password } = req.body;
	//hash password

	bcrypt.hash(password, 10, (err, hashedPassword) => {
		if (err) {
			return res.status(200).send({ message: "Error hashing password." });
		}

		const user = new User({
			username,
			avtar,
			email,
			password: hashedPassword,
		});
		user
			.save()
			.then(() => {
				res
					.status(200)
					.send({ msg: "user registerd successfully", User: user });
			})
			.catch((err) => {
				res.status(500).send({ msg: err.message });
			});
	});
});

///login routes

userRouter.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(201).send({ message: "Invalid credentials." });
		}

		//verify
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(201).send({ message: "Invalid credentials." });
		}

		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
			},
			process.env.SECRET_KEY,
			{
				expiresIn: "1h",
			},
		);

		res.status(201).send({ message: "Login successfull.", token });
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: err.message });
	}
});

module.exports = userRouter;
