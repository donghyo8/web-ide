
var pool = require('../modules/db-connection-pool');
var jwt = require('jsonwebtoken');

async function injectUser(req, res, next) {
	//Token 체크함 
	const token = req.header('auth_token');
	if(!token) return res.status(401).send('Access Denied');
	try { 
		const verified = jwt.verify(JSON.parse(token),process.env.TOKEN_SECRET);
		req.user = verified;
		next();
	} catch (e) {
		console.log(e);
		res.status(401).send('Invailid Token');
	}
}
function checkLogin(req, res, next) {
	if(!req.user) throw {}; // TODO: error exception
	next();
}
module.exports = { injectUser, checkLogin };