function errorHandler(err, req, res, next) {
	console.log(err);
	res.status(err.status).send(error);
}

module.exports = errorHandler;