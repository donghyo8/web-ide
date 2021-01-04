var express = require('express');
var router = express.Router();
var tokenUser = require('../modules/check-login-middleware');
const helper = require('../modules/helper');
const sql = require('../sql');
const db = require('../modules/db-connection-pool');

//Token 체크하여 사용자의 권한을 구분함 
router.use(tokenUser.injectUser);

/**
 * get
 * 모든 강좌의 제출된 모든 과제 조회
 * @param hw_id : 해당 과제의 id
 * @param report_id : 학생이 제출한 과제의 id 
 */
router.get('/:hw_id/reports', async function(req, res) {
    const { hw_id } = req.params;
    try {
        const [rows] = await db.query(sql.selectAllReports, [hw_id]);
        if (rows.length == 0) {
            res.status(400).send({
                message: '제출된 과제가 없습니다.'
            })
        } else {
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '조회에 성공했습니다.'
            })
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})
router.get('/listwork', async function(req, res) {
        try {
            const { id } = req.user._user[0];
            const origin = req.headers.origin;

            let rows;
            if (origin.includes("3001")) { //from admin
                [rows] = await db.query(sql.selectAllHomeworkByAdminId, [id]);
            } else {
                [rows] = await db.query(sql.selectAllHomeworkByUserId, [id]);
            }
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '조회에 성곡했습니다'
            })
        } catch (error) {
            helper.failedConnectionServer(res, error);
        }
    })
//해당하는 과제 평가 테이블 출력함
router.get('/:hw_id/reports/submit', async function(req, res) {
    const { hw_id } = req.params;
    try {
        const [homework] = await db.query(sql.selectHomeworkByID, [hw_id]);
        if (homework.length == 0) {
            res.status(400).send({
                message: "존재하지 않는 과제입니다."
            })
        } else {
            const { id } = req.user._user[0];
            const [auth] = await db.query(sql.checkAdminForLecture, [id, homework[0].lecture_id]);
            if (auth.length == 0) {
                res.status(401).send({
                    message: "접근 권한이 없습니다."
                })
            } else {
                const [registered] = await db.query(sql.selectRegisteredLectutreUser, [homework[0].lecture_id]);
                const [submitted] = await db.query(sql.selectAllReports, [hw_id]);
                for (let i = 0; i < registered.length; i++) {
                    for (let j = 0; j < submitted.length; j++) {
                        delete registered[i].id;
                        delete registered[i].lecture_id;
                        delete registered[i].enabled;
                        registered[i].submit = 0;
                        registered[i].score = 0;
                        if (submitted[j].user_id == registered[i].user_id) {
                            registered[i].submit = submitted[j].enabled;
                            registered[i].score = submitted[j].score;
                            registered[i].project_id = submitted[j].project_id;
                            break;
                        }
                    }
                }
                const [user] = await db.query(sql.selectusers);
                for (let i = 0; i < registered.length; i++) {
                    for (let j = 0; j < user.length; j++) {
                        if (registered[i].user_id == user[j].id) {
                            registered[i].userid = user[j].userid;
                            registered[i].name = user[j].name;
                            registered[i].major = user[j].major;
                        }
                    }
                }
                res.status(200).send({
                    result: "true",
                    data: registered,
                    message: "조회에 성공했습니다."
                })
            }
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})

router.get('/:hw_id/reports/:report_id', async function(req, res) {
    const { hw_id, report_id } = req.params;
    try {
        const [report] = await db.query(sql.selectReportByReportID, [hw_id, report_id]);
        if (report.length == 0) {
            res.status(400).send({
                message: '해당 과제가 존재하지 않습니다.'
            })
        } else {
            res.status(200).send({
                result: 'true',
                data: report,
                message: '조회에 성공했습니다.'
            })
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})

router.put('/:hw_id/reports/', async function(req, res) {
    const { hw_id } = req.params;
    try {
        const [report] = await db.query(sql.selectHomeworkByID, [hw_id]);
        if (report.length == 0) {
            res.status(400).send({
                message: '해당 과제가 존재하지 않습니다.'
            })
        } else {
            const [auth] = await db.query(sql.checkAdminForLecture, [req.user._user[0].id, report[0].lecture_id]);
            if (auth.length == 0) {
                res.status(401).send({
                    message: '채점 권한이 없습니다.'
                })
            } else {
                for (let i = 0; i < req.body.data.length; i++) {
                    await db.query(sql.updateReportScore, [req.body.data[i].score, req.body.data[i].user_id, hw_id]);
                }
                res.status(200).send({
                    message: '저장되었습니다.'
                })
            }
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})

module.exports = router;