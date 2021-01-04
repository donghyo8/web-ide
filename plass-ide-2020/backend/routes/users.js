var express = require('express');
var router = express.Router();
var db = require('../modules/db-connection-pool');
var sql = require('../sql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


router.post('/join', async function (req, res) {
	var { userid, password, name, email, major, admin } = req.body;
	var converted = String(req.body.password);
	var originCheck = req.headers.origin;
	var password = crypto.createHash('sha256').update(converted).digest('base64');
	try {
		const [rows] = await db.query(sql.selectUserbyUserId, [userid]);
		if (rows.length == 1)
		res.send({
			code: 200,
			msg: "입력한 아이디가 중복되었습니다."
		});
		else
			if(originCheck.includes("3001")){ //from admin
				admin = 1;
			}else{
				admin = 0;
			}
			await db.query(sql.insertUser, [userid, password, name, email, major, admin]).then((response) => {
				res.send({
					code: 200,
					msg: "회원가입에 성공하였습니다."
				});
			});
	} catch (e) {
		console.log(e)
	}
})
/**
 * 로그인 : 사용자부터 입력한 데이터들을 받아서 체크함
 * 이는 비빌번호도 UnHashing
 */
router.post('/login', async function (req, res) {
	const origin = req.headers.origin;
	var { userid, password } = req.body;
	var converted = String(password);
	var password = crypto.createHash('sha256').update(converted).digest('base64');
	try {
		let rows;
		console.log(userid, password)
		if(origin.includes("3001") || origin.includes("3003")){ //from admin
			[rows] = await db.query(sql.selectUserByAdmin, [userid, password]);
		}else{
			[rows] = await db.query(sql.selectUserByUsernameAndPassword, [userid, password]);
		}
		if (rows.length == 0)
			res.status(200).send("아이디 또는 비밀번호를 확인해주세요!");
		else {
			//로그인 성공인 경우에는 해당하는 사용자의 정보들 전체 다시 보냄
			req.session.username = rows.userid;
			req.session.authority = rows.admin;
			req.session.login = 'login';
			flag = true;
			req.session.save(() => {
				/**
				 * sign 만들시 다음 정보를 입력해주어야한다.
				 * 1. userid
				 * 2. moment().unix();
				 * 3. name
				 */
				const token = jwt.sign({_user: rows}, process.env.TOKEN_SECRET);
				delete rows[0].password; 
				res.header('auth-token',token).send({
					user : rows,
					jwt : token
				});
			});
		}
	} catch (e) {
		console.log(e)
	}
})
/**
 *	Logout : 세션 지움
 */
router.get('/logout', function (req, res) {
	res.status(200);
	req.session.destroy((err) => {
		if (err) {
			console.log("Session destroy Error");
		} else {
			res.redirect('/');
		}
	})
});
module.exports = router;