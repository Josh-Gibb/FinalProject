const { format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "MM-dd-yyyy \t hh:mm:ss")}`;
  const logItem = `${dateTime} \t ${uuidv4()} \t ${message} \n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fs.promises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fs.promises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) =>{
    logEvents(`${req.method} \t ${req.headers.origin} \t ${req.url}`, "reqLog.txt");
    console.log(`${req.method} \t ${req.path}`);
    next();
};

module.exports = {logEvents, logger};
