const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.routes");
const cors = require("cors");
const { blogRouter } = require("./routes/blogs.routes");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", userRouter);
app.use("/api", blogRouter);

app.listen(process.env.PORT, async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("Database is connected.");
		console.log("server is running", process.env.PORT);
	} catch (err) {
		console.log({ err: err.message });
	}
});
