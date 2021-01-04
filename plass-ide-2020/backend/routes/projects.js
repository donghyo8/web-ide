// multipart/form-data 처리를 위한 의존성
var multer = require('multer');
var upload = multer();

var express = require('express');
var router = express.Router();

var fc = require('../modules/file-controller');
var db = require('../modules/db-connection-pool');

const sql = require('../sql');

/**
 * project 객체 생김세 
 * {
 * 		id: 0, 
 * 		name:"프로젝트 5",
 *  	language: "c",
 * 		createdAt: "2020-01-27T14:35:13.000Z",
 * 		files?: []
 * },
 */
// var login = require('../modules/check-login-middleware');
router.get("/", async function(req, res) {
	try {
		const [rows] = await db.query("select * from ide.projects where user_id = ?", [289]);
		res.send(rows);
	} catch (error) {
		console.log(error)		
	}
});

router.get("/:projectId", async function(req, res) {
	const id = parseInt(req.params.projectId);

	const [rows] = await db.query(sql.selectProjectById, [id]);
	
	if(rows.length !== 1) return; // TODO: error exception

	const result = rows[0];
	result.files = await fc.readFiles(result.path, true, false);

	res.send(result);
});

router.get("/:projectId/:path*", async function(req, res) {
	// queries 
	const { files, dirs } = req.query;
	
	// TODO: 프로젝트 가져오기
	const projectId = req.params.projectId;

	// 입력받은 path
	const path = req.params.path + req.params[0];
	
	const result = await fc.readFileInfo(path, { readSubDir: files === "true", onlyDirs: dirs === "true"});
	
	res.send(result);
});


router.post("/", function(req, res, next) {
	/*
		TODO: 프로젝트 생성
	*/
});

router.post("/:projectId/:path*", upload.single("file"), function(req, res, next) {
	// TODO: 프로젝트 가져오기
	try{
		const projectId = req.params.projectId;
		if(req.query.type == "file") { postFile(req, res, next); return; } // 파일 업로드일 시 다음 hanlder로 넘김
		if(req.query.type == "directory") { postDirectory(req, res, next); return; } // 디렉토리일 시 파일 생성
	}catch{
		console.log("Error")
	}
	// 이외의 경우 404 status 를 response 해준다.
	// TODO: error exception
});

async function postFile(req, res, next) {
	// 입력받은 path
	let dest = "";
	if(req.params.path)
		dest = req.params.path + req.params[0];
	try {
		await fc.saveFile(req.file.buffer, dest, req.file.originalname);
		res.send({
			msg: "성공적으로 저장되었습니다.",
			code: 1
		});
	} catch(e) {
		next(e); return;
	}
}
async function postDirectory(req, res, next) {
	// 입력받은 path
	let dest = "";
	if(req.params.path)
		dest = req.params.path + req.params[0];
	if(!dest) {
		// 경로가 존재하지 않을 경우 404 오류를 발송한다
		res.status(404).send({
			msg: "목적지 없음",
			code: -1
		});
		return;
	}

	try {
		await fc.createDirectory(dest);

		res.send({
			msg: "성공적으로 생성되었습니다.",
			code: 1
		});
	} catch(e) {
		next(e); return;
	}
}

/**
 * 프로젝트 변경
 */
router.put("/:projectId", async function(req, res) {
	// TODO: 프로젝트 가져오기
	const projectId = req.params.projectId;
});

/**
 * 파일 이름 변경
 */
router.put("/:projectId/:path*", async function(req, res, next) {
	// TODO: 프로젝트 가져오기
	const projectId = req.params.projectId;

	const path = req.params.path + req.params[0];

	await fc.renameFile(path, req.body.name);
	res.send({msg: "성공"});
});

/**
 * 프로젝트 삭제
 */
router.delete("/:projectId", async function(req, res, next) {
	// TODO: 프로젝트 가져오기
	const projectId = req.params.projectId;

	/**
	 * TODO: project 삭제
	 */
});

/**
 * 파일을 삭제한다.
 */
router.delete("/:projectId/:path*", async function(req, res, next) {
	// TODO: 프로젝트 가져오기
	const projectId = req.params.projectId;
	const path = req.params.path + req.params[0];

	try {
		await fc.removeFile(path, req.body.name);
	} catch(e) {
		next(e); return;
	}

	res.send({msg: "성공"});
});


module.exports = router;
