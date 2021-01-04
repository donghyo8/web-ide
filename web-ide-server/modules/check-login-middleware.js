
var pool = require('../modules/db-connection-pool');

async function injectUser(req, res, next) {
	req.user = { id: Number(req.headers.id), isAdmin: true };
	next();
	/*const conn = await pool.getConnection(async conn => conn);
	const [rows] = await conn.query();
	if(rows.length === 1) req.user = rows[0];
	next();*/
}

function checkLogin(req, res, next) {
	if(!req.user) throw {}; // TODO: error exception
	next();
}

module.exports = { injectUser, checkLogin };