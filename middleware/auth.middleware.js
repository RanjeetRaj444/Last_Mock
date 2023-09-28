const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = async (req, res, next) => {
	const token = req.header("authorization");
console.log(token)
	if (!token) {
		return res
			.status(201)
			.send({ message: "Authentication failed.Token missing" });
	}

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
		console.log(decodedToken)

		req.user = {
			userId: decodedToken.userId,
			email: decodedToken.email,
		};
		next();
	} catch (err) {
		console.log(err);
		return res.status(401).send({
			message: "Authentication failed. Invalid token.",
		});
	}
};

module.exports = { verifyToken };
