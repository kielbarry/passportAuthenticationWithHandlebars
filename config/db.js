require("dotenv").config();

URL = process.env.MONGOURL;

module.exports = {
	url: URL
}