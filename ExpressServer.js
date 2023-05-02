require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const port = process.env.port || 3000;
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/dbConfig");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const { validateState } = require("./middleware/stateAuthenticator");

connectDB();

app.use(logger);

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));

app.use("/states", require("./routes/api/states"));

app.all("*", (req, res) => {
	res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
	console.log("Connected to mongoDB");
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}`);
	});
});
