var multer =  require('multer');
var util = require('util')
const pify = require('pify');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var tokenUser = require('../modules/check-login-middleware');
const helper = require('../modules/helper');
const sql = require('../sql');
const db = require('../modules/db-connection-pool');
const mime = require('mime-types');
var path = require('path');

var multer = require('multer'); 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'update/') 
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, makeid(10) + "." + extension);
    }
})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// var upload = multer({storage});
var upload = multer({ storage: storage });
// var uploadFilesMiddleware = util.promisify(upload);
//Token 체크하여 사용자의 권한을 구분함 
router.use(tokenUser.injectUser);

/** 
* 전체 강좌 출력
* Admin 강좌 등록
*/

/**
 * get
 * 해당 년도, 학기에 맞는 모든 강좌를 조회
 * @param userid : 사용자 아이디
 * @param season_year : 현재 년도 
 * @param season_quarter : 현재 학기
 */
router.get('/', async function (req, res) {
    let { season_year, season_quarter } = req.body;
    season_year = 2020;
    season_quarter = 1;
    try {
        const [rows] = await db.query(sql.selectLecturesByYearQuarter, [season_year, season_quarter]);
        if (rows.length == 0) {
            res.status(200).send({
                result: 'true',
                data: [],
                message: `해당 학기의 강좌가 존재하지 않습니다.`
            });
        } else {
            res.status(200).send({
                result: 'true',
                data: rows,
                message: `강좌 리스트 조회에 성공했습니다.`
            });
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})

/**
 * 관리자 전용 (생성)
 * req.user 봐서 user가 관리자인지 확인 후
 * lecture를 생성한다.
 * 권한이 없을 경우 401번 error
 * body에 과목 정보를 추가해야함.
 * lecture_name과 lecture_number가 같은 강좌가 존재하면 같은 강좌가 존재한다를 반환 400 에러
 * amin 권한이 없는 사용자가 시도시 401 권한 오류 발생
 */
router.post('/', async function (req, res) {
    try {
        if (helper.isAdmin(req)) {
            const { title, description, season_year, season_quarter,
                lecture_type, major, lecture_number, lecture_name, score, professor } = req.body;
            const {id} = req.user._user[0];
            const [rows] = await db.query(sql.selectSameLecture, [lecture_number, lecture_name]);
            if (rows.length != 0) {
                res.status(200).send({
                    result: 'false',
                    data: [],
                    message: '같은 강좌가 이미 존재합니다.'
                });
            }
            else {
                const newLecture = await db.query(sql.insertLecturesAdmin, [title, description, season_year, season_quarter,
                    lecture_type, major, lecture_number, lecture_name, score, professor])
                const lectureId = newLecture[0].insertId;

                await db.query(sql.insertLectureByAdmin,[id, lectureId]);
                
                res.status(200).send({
                    result: 'true',
                    data: [],
                    message: '강좌 생성에 성공했습니다.'
                });
            }
        } else {
            res.status(200).send({
                result: 'true',
                data: [],
                message: '강좌개설 권한이 없습니다.'
            });
        }
    } catch (error) {
        console.log(error)
        helper.failedConnectionServer(res, error);
    }
})
/**
 * get
 * 관리자의 개설된 강좌 리스트
 * @param user_id : 관리자 id로 검색
 */
router.get('/admin', async function (req, res) {
    const { id } = req.user._user[0];
    try {
        if (helper.isAdmin(req)) {
            const [rows] = await db.query(sql.selectAdminLectures, [id])
            if (rows.length != 0) {
                res.status(200).send({
                    result: 'true',
                    data: rows,
                    message: '개설강좌 목록 조회에 성공했습니다.'
                })
            } else {
                res.status(200).send({
                    result: 'false',
                    data: [],
                    message: '개설되어 있는 강좌가 없습니다. 원하는 강좌를 개설해보세요'
                })
            }
        } else {
            res.status(403).send({
                result: 'false',
                data: [],
                message: '관리자 권한이 없습니다'
            })
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})

//Admin 페이지
router.get('/register', async function (req, res) {
    const { id } = req.user._user[0];
    try {
        const [rows] = await db.query(sql.selectRegisterdLecturesByAdmin, [id]);
        if (rows.length == 0) {
            res.status(200).send({
                result: 'false',
                data: [],
                message: '수강하고 있는 강좌가 없습니다.'
            });
        }
        else {
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '수강강좌 리스트 조회에 성공했습니다.'
            });
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})
//User
router.get('/register/user', async function (req, res) {
    const { id } = req.user._user[0];
    try {
        const [rows] = await db.query(sql.selectEnabledLectureByUserId, [id]);
        if (rows.length == 0) {
            res.status(200).send({
                result: 'false',
                data: [],
                message: '수강하고 있는 강좌가 없습니다.'
            });
        }
        else {
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '수강강좌 리스트 조회에 성공했습니다.'
            });
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})
//!!frontend 확인
router.get('/listregister/:lecture_id/user', async function (req, res) {
    const { id } = req.user._user[0];
    const {lecture_id} = req.params;
    try {
        const [rows] = await db.query(sql.checkRegisteredByUserId, [lecture_id , id]);
        if (rows.length == 0) {
            res.status(200).send({
                result: 'false',
                data: [],
                message: '조회 권한이 없습니다'
            });
        }
        else {
            const [rows] = await db.query(sql.selectAllRegisteredUserByLectureId, [lecture_id]);
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '수강강좌 리스트 조회에 성공했습니다.'
            });
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})
/**
 * get
 * 특정 강좌를 조회
 * lecture_id 값에 해당하는 강좌가 없을경우 400 에러
 * @param lecture_id : 조회할 강좌 이름
 */
router.get('/view/:lecture_id', async function (req, res) {
    var { lecture_id } = req.params;
    try {
        const [rows] = await db.query(sql.selectLectureByLectureId, [lecture_id]);
        if (rows.length == 0) {
            res.status(200).send({
                result: 'true',
                data: [],
                message: '강좌가 존재하지 않습니다.'
            });
        } else {
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '강좌 조회에 성공했습니다.'
            });
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})
/**
 * 관리자 전용 (수정)
 * lecutures가 없을 경우 400error
 * 본인의 강좌가 아닐경우 401error
 * lecture 정보에 빈 값이 존재할 경우 400error
 * lecture의 값을 body를 토대로 수정한다.
 * {id, title, description, season_year ... }
 */
router.put('/modify/:lecture_id', async function (req, res) {
    const { lecture_id } = req.params;
    const [rows] = await db.query(sql.selectLectureByLectureId, [lecture_id]);
    //const [row] = await db.query(sql)
    try {
        if (rows.length != 0) {
            const {id} = req.user._user[0];
            let [rows] = await db.query(sql.checkAdminForLecture, [id, lecture_id]);
            if (rows.length != 0) {
                const { title, description, season_year, season_quarter, lecture_type, major, lecture_number, lecture_name, score, professor } = req.body;
                if (title && description && season_year && season_quarter && lecture_type && major && lecture_number && lecture_name && score && professor) {
                    await db.query(sql.modifyLectureForAdmin, [title, description, season_year, season_quarter, lecture_type, major, lecture_number, lecture_name, score, professor, lecture_id]);
                    const [row] = await db.query(sql.selectLectureByLectureId, [lecture_id]);
                    res.status(200).send({
                        result: 'true',
                        data: [row],
                        message: '강좌 정보를 수정하였습니다.'
                    });
                }
                else {
                    res.status(200).send({
                        result: 'false',
                        data: [],
                        message: '강좌 정보에 빈 값이 존재합니다.'
                    });
                }
            }
            else {
                res.status(400).send({
                    result: 'false',
                    data: [],
                    message: '강좌 정보 수정 권한이 없습니다.'
                });
            }
        } else {
            res.status(400).send({
                result: 'false',
                data: [],
                message: '강좌가 존재하지 않습니다.'
            });
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);

    }

})
router.get('/register/:lecture_id', async function (req, res) {
    const { lecture_id } = req.params;
    try {
        const [lecture] = await db.query(sql.selectLectureByLectureId, [lecture_id])
        if (lecture.length == 0) {
            res.status(400).send({
                message: '존재하지 않는 강좌입니다.'
            })
        } else {
            const [user_lec] = await db.query(sql.selectRegisterdLectureByUserId, [req.user._user[0].userid, lecture_id]);
            if(user_lec.length == 0){
                res.status(400).send({
                    message: '신청하지 않은 강좌입니다.'
                })
            } else {
                res.status(200).send({
                    result: 'true',
                    data: user_lec,
                    message: '조회에 성공했습니다.'
                })
            }
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})
/**
* User 승인여부에 관계 없이 User가 신청한 강좌 출력함
*/
router.get("/register/user", async function (req, res) {
    const { userid } = req.user._user[0];
    try {
        let [rows] = await db.query(sql.selectUsersLecturesByUserId, [userid]);
        if (rows.length == 0) {
            res.status(200).send({
                result: 'true',
                data: [],
                message: '신청한 강좌가 없습니다.'
            })
        }
        else {
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '신청강좌 조회에 성공했습니다.'
            })
        }
    } catch (e) {
        helper.failedConnectionServer(res, e);
    }
})
/**
 * User가 원하는 강좌를 신청
 */
router.post("/register/:lecture_id/user", async function (req, res) {
    const { id } = req.user._user[0];
    const { lecture_id } = req.params;
    try {
        let [rows] = await db.query(sql.selectLecturesById, [lecture_id]);
        if (rows.length == 0) {
            res.status(400).send('존재하지 않는 강좌입니다.');
        }
        else {
            [rows] = await db.query(sql.selectRegisterdLectureByUserId, [id, lecture_id]);
            if (rows.length != 0) {
                res.status(200).send({ message :'이미 신청한 강좌입니다.'});
            }
            else {
                await db.query(sql.insertUserLecture, [id, lecture_id]);
                res.status(200).send({
                    message: '신청 되었습니다.'
                });
            }
        }
    } catch (e) {
        helper.failedConnectionServer(res, e);
    }
})
// User의 승인 대기 중인 강좌 리스트 출력
router.get("/waiting/user", async function (req, res) {
    const { id } = req.user._user[0];
    try {
        let [rows] = await db.query(sql.selectWatingLectures, [id]);
        if (rows.length == 0) {
            res.status(200).send({
                result: 'true',
                data: [],
                message: '대기 중인 강좌가 없습니다.'
            })
        }
        else {
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '대기 강좌 리스트 조회에 성공했습니다.'
            })
        }
    } catch (e) {
        helper.failedConnectionServer(res, e);
    }
})
// 대기 상태인 lecture 삭제
router.delete("/register/:lecture_id/waiting/user", async function (req, res) {
    const { lecture_id } = req.params;
    const { id } = req.user._user[0];
    try {
        const [auth] = await db.query(sql.selectRegisterdLectureByUserId, [id, lecture_id]);
        if (auth.length == 0) {
            res.status(201).send({
                result: 'false',
                data: [],
                message: '취소 권한이 없습니다.'
            })
        }
        else {
            const [lecture] = await db.query(sql.selectNotAbleLectures, [id, lecture_id]);
            if(lecture.length == 0){
                res.status(200).send({
                    result: 'true',
                    data: [],
                    message: '이미 승인된 강좌입니다.'
                })
            }else{
                await db.query(sql.deleteRegisteredLecture, [id, lecture_id]);
                res.status(200).send({
                    result: 'true',
                    data: [],
                    message: '강좌 신청 취소 되었습니다.'
                })
            }
        }
    } catch (e) {
        helper.failedConnectionServer(res, e);
    }
})
/**
 * GET 관리자는 해당하는 강좌에서 등록한 학생 리스트 출력함
 * @return 학생 리스트 
 * PUT 관리자가 신청한 학생을 수락할 수 있음.
 */
router.get("/register/:lecture_id/admin", async function (req, res) {
    const { lecture_id } = req.params;
    const { id } = req.user._user[0];
    try {
        let [rows] = await db.query(sql.checkAdminForLecture, [id, lecture_id])
        if (helper.isAdmin(req) && rows) {
            let [enabledList] = await db.query(sql.selectListEnabledRegisteredByLectureId, [lecture_id, id])
            let [disabledList] = await db.query(sql.selectListUnenabledRegisteredByLectureId, [lecture_id, id])
            res.status(200).send({
                result: 'true',
                data: { enabledList, disabledList },
                message: '해당하는 강좌의 신청하고 있는 학생 리스트'
            })
        } else {
            res.status(200).send({
                result: 'true',
                data: [],
                message: '조회할 권한이 없습니다.'
            })
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})
//Admin User 허락하거나 취소 클릭시
router.put("/register/:lecture_id/admin", async function (req, res) {
    const { id } = req.user._user[0];
    const {lecture_id } = req.params;
    const {studentId } = req.body;
    const [result] = await db.query(sql.checkAdminForLecture, [id, lecture_id]);
    if (result.length == 0) {
        res.status(200).send('승인 권한이 없습니다.')
    }
    else {
        const [row] = await db.query(sql.selectRegisterdLectureByUserId, [studentId, lecture_id]);
        //신청한 학생인지 확인
        if (row.length == 0) {
            res.status(200).send({
                result: 'true',
                data: [],
                message: '신청하지 않은 강좌 혹은 신청하지 않은 사용자입니다.'
            });
        }
        else {
            if (row[0].enabled == 1) {
                await db.query(sql.updateDisabled, [studentId, lecture_id]);
                res.status(200).send({
                    result: 'true',
                    data: [],
                    message: '취소 되었습니다.'
                });
            }
            else {
                //해당하는 과목에서 이미 모든 신청한 과제에서 해당하는 학생들이 Report 만들어줌
                let [rows] = await db.query(sql.selectReportByLectureId,[lecture_id])
                for(let i = 0; i < rows.length; i++){
                    await db.query(sql.insertUserReport,[studentId,rows[i].id])
                }
                //승인
                await db.query(sql.updateEnabled, [studentId, lecture_id]);
                res.status(200).send({
                    result: 'true',
                    data: [],
                    message: '승인이 되었습니다.'
                });
            }
        }
    }
})
/**
 * 관리자는 해당하는 강좌에서 등록한 학생을 승인하거나 취소 가능
 * 이미 저장된 값을 출력하여 승인이나 취소 결정
 * @param name : 관리자인지 체크함 즉 현재 로그인 사용자의 ID
 * @param userid : 승인이나 취소할 학생 ID
 * @return 학생 리스트
 */
//과제
router.get("/:lecture_id/homework", async function (req, res) {
    const { lecture_id } = req.params;
    const { id } = req.user._user[0];
    try {
        let [rows] = await db.query(sql.checkRegisteredByUserId, [lecture_id, id]);
        if (rows) {
            [rows] = await db.query(sql.selectHomeworkByLectureId, [lecture_id]);
            if(rows.length === 1)
            {
                res.status(200).send({
                    result: 'true',
                    data: rows,
                    message: '공지사항 리스트 출력'
                });
                return;
            }
            let data = [];
            for(let i = 0; i  < rows.length - 1; i++)
            {   
                if(rows[i].id === rows[i + 1].id)
                {
                    rows[i].name = new Array(rows[i].name) ;
                    rows[i].path = new Array(rows[i].path);
                    for(var j = i + 1; j < rows.length && rows[i].id === rows[j].id; j++)
                    {
                        let {name, path} = rows[j];
                        rows[i].name.push(name);
                        rows[i].path.push(path);
                    }
                    data.push(rows[i])
                    //마지막 요수 체크함
                    i = j - 1;
                    if(i + 1 === rows.length - 1)
                    {
                        if(rows[i].id === rows[i+1].id){
                            let {name, path} = rows[i + 1];
                            rows[i].name.push(name);
                            rows[i].path.push(path);
                        }
                        data.push(rows[i+1]);
                    }
                }else{
                    data.push(rows[i]);
                    //마지막 요수 체크함
                    if(i + 1 === rows.length - 1)
                    {
                        if(rows[i].id === rows[i+1].id){

                            let {name, path} = rows[i + 1];
                            rows[i].name = new Array(rows[i].name);
                            rows[i].name.push(name);
                            rows[i].path = new Array(rows[i].path);
                            rows[i].path.push(path);
                        }
                        data.push(rows[i+1]);
                    }
                }
            }
            res.status(200).send({
                result: 'true',
                data: data,
                message: '본인이 신청한 과목의 과제 리스트'
            });
        } else {
            res.status(200).send({
                result: 'true',
                data: [],
                message: '본인이 신청한 과목이 아니라서 과제를 조회할 수 없습니다'
            })
        }
    } catch (error) {
        console.log(error)
        helper.failedConnectionServer(res, error);
    }
})
router.post("/:lecture_id/homework", upload.array('file'), async function (req, res) {
    const { lecture_id } = req.params;
    const { id } = req.user._user[0];
    try {
        let [rows] = await db.query(sql.checkRegisteredByUserId, [lecture_id, id]);
        //해당하는 User 신청한 강좌 체크
        if (rows) {
            if (helper.isAdmin(req)) {
                const dataBody = JSON.parse(req.body.hwdata);
                let { title, updated, data, limitdate, week } = dataBody;
                const files = req.files || 'NULL';
                try {
                    let result = await db.query(sql.insertHomeworkByClassId, [title, data, updated, limitdate, week, lecture_id, id]);
                    let reportId = result[0].insertId;

                    if(files !== 'NULL')
                    {
                        for(let i = 0; i < files.length; i++)
                        {
                            const {originalname, path} = files[i];
                            result = await db.query(sql.insertFiles, [originalname, path]);
                            const fileId = result[0].insertId;
                            await db.query(sql.insertToReportFile, [reportId, fileId]);
                        }
                    }
                    //해당하는 리포트에서 신청한 학생 들이 users_report에서 넣음
                    let [rows] = await db.query(sql.selectUserByLectureId,[lecture_id])
                    for(let i = 0; i < rows.length; i++){
                        await db.query(sql.insertUserReport,[rows[i].user_id,reportId])
                    }
                    res.status(200).send({
                        result: 'true',
                        data: [],
                        message: '과제 생성 성공했습니다.'
                    })
                } catch (e) {
                    console.log(e);
                    res.status(200).send({
                        result: 'false',
                        data: [],
                        message: `과제 생성 실패합니다.${e}`
                    })
                }
            } else {
                res.status(200).send({
                    result: 'false',
                    data: [],
                    message: '과제 생성 권한이 없습니다.'
                })
            }
        } else {
            res.status(200).send({
                result: 'false',
                data: [],
                message: '본인이 신청한 과목이 아니라서 과제를 조회할 수 없습니다'
            })
        }
    } catch (error) {
        console.log(error)
        helper.failedConnectionServer(res, error);
    }
})

router.get("/:lecture_id/homework/:hwId", async function (req, res) {
    const { lecture_id, hwId } = req.params;
    const { id } = req.user._user[0];
    try {
        let [row] = await db.query(sql.checkRegisteredByUserId, [lecture_id, id]);
        //해당하는 User 신청한 강좌 체크
        if (row) {
            let [rows] = await db.query(sql.selectHomeworkByID, [hwId]);
            if(rows.length !== 1)
            {
                rows[0].path = new Array(rows[0].path);
                rows[0].name = new Array(rows[0].name) ;
                for(let i = 1; i < rows.length; i++)
                {
                    let {name, path} = rows[i];
                    rows[0].name.push(name);
                    rows[0].path.push(path);
                }
            }
            res.status(200).send({
                result: 'true',
                data: rows[0],
                message: '본인이 신청한 과목의 특정한 과제'
            })
        } else {
            res.status(200).send({
                result: 'true',
                data: [],
                message: '본인이 신청한 과목이 아니라서 과제를 조회할 수 없습니다'
            })
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
});

// 해당 강좌의 과제 수정(admin) 
router.put("/:lecture_id/homework/:hwId", upload.array('file'), async function (req, res) {
    const { lecture_id, hwId } = req.params;
    const { id } = req.user._user[0];
    try {
        const [row] = await db.query(sql.selectReportById, [hwId]);
        if (row.length > 0) {
            const [row] = await db.query(sql.checkAdminForLecture, [id, lecture_id]);
            if (row.length > 0) { //과제 수정 가능
                const data = JSON.parse(req.body.hwdata);
                const { title, description, updated, limitdate, week, olderFiles } = data;
                const files  = req.files || 'NULL';
                const [savedFiles] = await db.query(sql.selectAllFileHomeworkId,[hwId]);
                if(files.length !== 0) //새로 파일 올림
                {
                    for(let i = 0; i  < files.length; i++)
                    {
                        const {originalname, path} = files[i];
                        let result = await db.query(sql.insertFiles, [originalname, path]);
                        let fileId = result[0].insertId;
                        await db.query(sql.insertToReportFiles,[hwId, fileId]);
                    }
                }
                //원래 저장되어 있는 파일 수정
                if(olderFiles.length !== savedFiles)
                {
                    let temp = [];
                    for(let i = 0; i < savedFiles.length; i++)
                    {
                        for(let j = 0; j < olderFiles.length; j++)
                        {
                            if(savedFiles[i].name === olderFiles[j].name)
                            {
                                temp.push(savedFiles[i])
                            }
                        }
                    }
                    let deleteFiles = savedFiles.filter(element => !temp.includes(element));
                    for(let i = 0; i < deleteFiles.length; i++)
                    {
                        await db.query(sql.deleteToReportFile,[deleteFiles[i]["report_file_id"]]);
                        await db.query(sql.deleteFile,[deleteFiles[i]["id"]]);
                    }
                }
                await db.query(sql.updateHomwworkByClassIdHmwId, [title, description, updated , limitdate, week, hwId]);
                res.status(200).send({
                    result: 'true',
                    data: [],
                    message: '과제를 수정하였습니다.'
                });
            }
            else {
                res.status(201).send({
                    result: 'false',
                    data: [],
                    message: '과제정보를 수정할 권한이 없습니다.'
                });
            }
    } else {
        res.status(200).send({
            result: 'false',
            data: [],
            message: '과제정보가 존재하지 않습니다.'
        });

    }

    } catch (error) {
        console.log(error)
        helper.failedConnectionServer(res, error);
    }
});

router.get("/:lecture_id/notice", async function (req, res) {
    const { lecture_id } = req.params;
    try {
        const [rows] = await db.query(sql.getNoticeByClassName, [lecture_id]);
        if(rows.length === 1)
        {
            res.status(200).send({
                result: 'true',
                data: rows,
                message: '공지사항 리스트 출력'
            });
            return;
        }
        let data = [];
        for(let i = 0; i  < rows.length - 1; i++)
        {   
            if(rows[i].id === rows[i + 1].id)
            {
                rows[i].name = new Array(rows[i].name) ;
                rows[i].path = new Array(rows[i].path);
                //앞 뒤에 id 같으면 파일을 첫번째 요수에 다가 파일 리스트 저장
                for(var j = i + 1; j < rows.length && rows[i].id === rows[j].id; j++)
                {
                    let {name, path} = rows[j];
                    rows[i].name.push(name);
                    rows[i].path.push(path);
                }
                //그 요수 data에서  저장함
                data.push(rows[i])

                 //마지막 요수까지 같으면 추가함
                i = j - 1;
                if(i + 1 === rows.length - 1)
                {
                    if(rows[i].id === rows[i+1].id){
                        let {name, path} = rows[i + 1];
                        rows[i].name.push(name);
                        rows[i].path.push(path);
                    }
                    data.push(rows[i+1]);
                }
            }else{ //같지 않은 경우에는 
                data.push(rows[i]);
                //마지막 요수 체크함
                if(i + 1 === rows.length - 1)
                {
                    if(rows[i].id === rows[i+1].id){
                        rows[i].name = new Array(rows[i].name) ;
                        rows[i].path = new Array(rows[i].path);
                        let {name, path} = rows[i + 1];
                        rows[i].name.push(name);
                        rows[i].path.push(path);
                    }
                    data.push(rows[i+1]);
                }
            }
        }
        res.status(200).send({
            result: 'true',
            data: data,
            message: '공지사항 리스트 출력'
        });
    } catch (error) {
        console.log(error)
        helper.failedConnectionServer(res, error);
    }
});

//공지사항 작성 API 
router.post("/:lecture_id/notice", upload.array('file'), async function (req, res) {
    try {
            var data = JSON.parse(req.body.notice);
            const { lecture_id } = req.params
            const { title, contents, week} = data;
            const { id, name } = req.user._user[0];
            const files  = req.files || 'NULL';
            const [rows] =  await db.query(sql.checkAdminForLecture, [id, lecture_id])
                if (rows.length > 0) {
                 //전달된 데이터를 산입
                    console.log(title, contents, lecture_id, name, week)
                    let result = await db.query(sql.insertNoticeAdmin, [title, contents, lecture_id, name, week])
                    let noticeId = result[0].insertId;
                    if(files !== 'NULL')
                    {
                        for(let i = 0; i < files.length; i++)
                        {
                            const {originalname, path} = files[i];
                            let result = await db.query(sql.insertFiles, [originalname, path]);
                            let fileId = result[0].insertId;
                            await db.query(sql.insertToNoticeFiles,[noticeId, fileId]);
                        }
                        
                    }
                    const [rows] =  await db.query(sql.selectNoticeId, [noticeId]);
                    if(rows.length !== 1)
                    {
                        rows[0].name = new Array(rows[0].name);
                        rows[0].path = new Array(rows[0].path);
                        for(let i = 1; i < rows.length; i++)
                        {
                            let {name, path} = rows[i];
                            rows[0].name.push(name);
                            rows[0].path.push(path);
                        }
                    }
                    res.status(200).send({
                        result: 'true',
                        data: rows[0],
                        message: '공지 생성에 성공했습니다.'
                    });
                }
            else{
                res.status(200).send({
                    result: 'true',
                    data: [],
                    message: '공지작성 권한이 없습니다.'
                });
            }
    } catch (error) {
        console.log(error)
        helper.failedConnectionServer(res, error);
    }
})
// 공지사항 수정 API (commit)
router.put("/:lecture_id/notice/:notice_id",  upload.array('file'), async function (req, res) {
    try {
    
            var data = JSON.parse(req.body.notice);
            const files  = req.files || 'NULL';
            const { id } = req.user._user[0];
            const { lecture_id, notice_id } = req.params;
            const [auth] = await db.query(sql.checkAdminForLecture, [id, lecture_id]);
            if(auth.length > 0)
            {
                const { title, contents , week, olderFiles} = data;
                const [savedFiles] = await db.query(sql.selectAllFileByNoticeId,[notice_id]);
                if(files.length !== 0) //새로 파일 올림
                {
                    for(let i = 0; i < files.length; i++)
                    {
                        const {originalname, path} = files[i];
                        let result = await db.query(sql.insertFiles, [originalname, path]);
                        let fileId = result[0].insertId;
                        await db.query(sql.insertToNoticeFiles,[notice_id, fileId]);
                    }
                }
                //원래 저장되어 있는 파일을 수정함
                if(olderFiles.length !== savedFiles.length)
                {
                    let temp = [];
                    for(let i = 0; i < savedFiles.length; i++)
                    {
                        for(let j = 0; j < olderFiles.length; j++)
                        {
                            if(savedFiles[i].name === olderFiles[j].name)
                            {
                                temp.push(savedFiles[i])
                            }
                        }
                    }
                    let deleteFiles = savedFiles.filter(element => !temp.includes(element));
                    for(let i = 0; i < deleteFiles.length; i++)
                    {
                        await db.query(sql.deleteNoticeFile,[deleteFiles[i]["notices_file_id"]]);
                        await db.query(sql.deleteFile,[deleteFiles[i]["id"]]);
                    }
                }
                // const [rows] = await db.query(sql.selectFilesByNoticeId,[notice_id])
                await db.query(sql.updateNoticeAdmin, [title, contents, week, notice_id]);
                // const [rows] = await db.query(sql.getNoticeByNoticeByLectureId, [lecture_id]);
                const [rows] =  await db.query(sql.selectNoticeId, [notice_id]);
                console.log(rows, notice_id);
                if(rows.length !== 1)
                {
                    rows[0].name = new Array(rows[0].name);
                    rows[0].path = new Array(rows[0].path);
                    for(let i = 1; i < rows.length; i++)
                    {
                        let {name, path} = rows[i];
                        rows[0].name.push(name);
                        rows[0].path.push(path);
                    }
                }
                res.status(200).send({
                    result: 'true',
                    data: rows[0],
                    message: '공지사항을 수정하였습니다.'
                });
            }else{
                res.status(200).send({
                    result: 'false',
                    data: [],
                    message: '접근 권한이 없습니다.'
                });
            }
    } catch (error) {
        console.log(error)
        helper.failedConnectionServer(res, error);
    }

})

// 공지사항 삭제 API
router.delete("/:lecture_id/notice/:notice_id", async function (req, res) {
    try {
        const { lecture_id, notice_id } = req.params;
        const [notice] = await db.query(sql.selectNoticeByLecture, [lecture_id,notice_id]);
        if (notice.length == 0) {
            res.status(200).send({
                result: 'false',
                data: [],
                message: '공지사항이나 강좌이 존재하지 않습니다.'
            });
        } else {
            const [auth] = await db.query(sql.checkAdminForLecture, [req.user._user[0].id, lecture_id]);
            if (auth.length > 0) {
                await db.query(sql.deleteNoticeByNoticeID, [notice_id]);
                await db.query(sql.deleteFilesByNoticeId,[notice_id]);
                await db.query(sql.	deleteNoticeFileByNoticeId,[notice_id]);
                res.status(200).send({
                    result: 'false',
                    data: [],
                    message: '삭제되었습니다.'
                });
            } else {
                res.status(200).send({
                    result: 'false',
                    data: [],
                    message: '접근 권한이 없습니다.'
                });
            }
        }
    } catch (error) {
        helper.failedConnectionServer(res, error);
    }
})
module.exports = router;