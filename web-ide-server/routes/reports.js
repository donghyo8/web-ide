var express = require('express');
var router = express.Router();
var db = require('../modules/db-connection-pool');

const sql = require('../sql');

router.get("/", async function(req, res) {
    let rows;
	try {
		[ rows ] = await db.query(sql.selectReportsByUserId, [req.user.id]);
	} catch(e) {
		res.status(500).send({});
		return;
    }
    res.send({reports: rows})
});

router.put("/", async function(req, res) {
	const { id, projectId } = req.body;
	try {
		await db.query(sql.updateReportsWithProjectId, [Number(projectId), Number(id)]);
	} catch (e) {
		res.status(500).send({});
		return;
	}
	res.send({});
})

module.exports = router