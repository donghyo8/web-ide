var express = require('express');
var router = express.Router();
var login = require('../modules/check-login-middleware');


var pool = require('../modules/db-connection-pool');
var sql = require('../sql');

//router.use(login.checkLogin);

router.get("/", function(req, res) {
	res.send(req.user);
})

router.post("/", async function(req, res) {
	const { username, password } = req.body;
	const conn = await pool.getConnection(async conn => conn);
	const [rows] = await conn.query(sql.selectUserByUsernameAndPassword, [username, password]);
	if(rows !== 1){
		throw {}; // TODO: error exception
	}

	res.send(rows[0]);
})

module.exports = router;