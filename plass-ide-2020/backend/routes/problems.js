var express = require('express');
var router = express.Router();
var tokenUser = require('../modules/check-login-middleware');
const helper = require('../modules/helper');
const sql = require('../sql');
const db = require('../modules/db-connection-pool');
router.use(tokenUser.injectUser);

//문제 리스트 출력 //! 안씀
router.get('/', async function(req, res) {
    try {
        const [rows] = await db.query(sql.selectProblems)
        if(rows.length > 0)
        {
            res.status(200).send({
                result : true,
                data : rows,
                message : '문제 리스트 입니다'
            })
        }else{
            res.status(200).send({
                result : true,
                data: [],
                message : '문제 리스트 없습니다'
            })
        }
    } catch (e) {
        
    }
})
//문제 리스트 출력
router.get('/listtutorials', async function(req, res) {
    try {
        const [rows] = await db.query(sql.problems.selectTutorials);
        if(rows.length !== 0){
            res.status(200).send({
                result: true,
                data: rows,
                message:'Tutorisl 리스트'
            })
        }
    } catch (e) {
        console.log(e)
    }
})
//Get tags tree structure
router.get('/treetags', async function(req, res) {
    try {
        let [level1] = await db.query(sql.problems.selectTagsByTutorialId2,[0])
        for(let i = 0; i < level1.length; i++){
            let [level2] = await db.query(sql.problems.selectTagsByTutorialId2,[level1[i].id])
            level1[i].level2 = level2;
            for(let j = 0; j <  level1[i].level2.length; j++ ){
                let [level3] = await db.query(sql.problems.selectTagsByTutorialId2,[level1[i].level2[j].id])
                level1[i].level2[j].level3 = level3;
            }
        }
        res.status(200).send({
                result: true,
                data: level1,
                message:'Tutorisl 리스트'
            })
    } catch (e) {
        console.log(e)
    }
})
//해당하는 Tutorial tag 리스트 출력함, 해당하는 tag 문제 리스트를 출력함
router.get('/tutorial/:id', async function(req, res) {
    try {
        const { id } = req.params;
        let [tags] = await db.query(sql.problems.selectTagsByTutorialId,[id])
        for (let i = 0; i < tags.length; i++) { 
            let [child_tags] = await db.query(sql.problems.selectTagsByTutorialId,[tags[i].id])
            tags[i] = {...tags[i], childTag : child_tags};
            for(let j = 0; j < tags[i].childTag.length; j++){
                let [problems] = await db.query(sql.problems.selectProblemsByTagId,[tags[i].childTag[j].id]);
                tags[i].childTag[j] = {... tags[i].childTag[j], problems}
            }
        }
        res.status(200).send({
            result: true,
            data: tags,
            message:'해당하는 Tutorial tag 리스트'
        })
    } catch (e) {
        console.log(e)
    }
})
router.get('/:problem_id', async function(req, res) {
    const { problem_id } = req.params
    try {
        const [ rows ] = await db.query(sql.selectProblemById,[problem_id])
        const [ testCases ] = await db.query(sql.selectTestCasesByProblemId, [problem_id]);

        if(rows.length > 0)
        {
            rows[0].testCases = testCases;
            res.status(200).send({
                result : true,
                data : rows,
                message : '특정한 문제 리스트 입니다'
            })
        }else{
            res.status(200).send({
                result : true,
                data: [],
                message : '해당 문제가 없습니다'
            })
        }
    } catch (e) {
    
    }
})
//문제 등록
router.post('/', async function(req, res){
    try{
        if(helper.isAdmin(req)){
            const {name, content, input, output, testCases, level, category, level3Id} = req.body;
            if(name && content && input && output){
                const [problem] = await db.query(sql.selectProblemByNameContent, [name, content]);
                if(problem.length != 0){
                    res.status(200).send({
                        result : false,
                        data: problem,
                        message : '이미 같은 문제가 존재합니다.'
                    })    
                }else{
                    let result = await db.query(sql.insertProblem, [name, content, input, output, level, category]);
                    
                    let insertTestCaseQuery;
                    try {
                        insertTestCaseQuery = sql.insertTestCase(testCases.length);
                    } catch(e) {
                        res.status(500).send({ result: false, message: "잘못된 testcase 입력" })
                    }
                    console.log( ...testCases.map(e=>([ e.input_example, e.output_example, result[0].insertId ])) );
                    await db.query(insertTestCaseQuery, testCases.reduce((prev, e)=>{
                        return prev.concat([ e.input_example, e.output_example, result[0].insertId ]);
                    }, []));
                    await db.query(sql.problems.insertProblemTag, [result[0].insertId, level3Id]);

                    // TODO: 이거 의도를 모르겠음 확인 부탁
                    // let [problemIDmathching] = await db.query(sql.selectProblemById,[result[0].insertId])
                    res.status(200).send({
                        result : true,
                        data: [],
                        message : '문제가 추가되었습니다.'
                    })  
                }  
            }else{
                res.status(200).send({
                    result : false,
                    data: [],
                    message : '입력 정보에 빈 칸이 존재합니다.'
                })
            }
        }else{
            res.status(201).send({
                result : false,
                data: [],
                message : '문제 추가 권한이 없습니다.'
            })
        }
    }catch(error){
        console.log(error)
        helper.failedConnectionServer(res, error);
    }
})

router.put('/:problem_id', async function(req, res){
    const { problem_id } = req.params;
    try{
        if(helper.isAdmin(req)){
            const {name, content, input, output, testCases, level, category} = req.body;
            if(name && content && input && output){
                const [problem] = await db.query(sql.selectProblemById,[problem_id]);
                if(problem.length == 0){
                    res.status(200).send({
                        result : false,
                        data: problem,
                        message : '존재하지 않는 문제입니다.'
                    })    
                }else{
                    await db.query(sql.updateProblem, [name, content, input, output, level, category, problem_id]);

                    // test case모두 삭제 후 다시 삽입
                    await db.query("START TRANSACTION");
                    await db.query(sql.deleteTestCases, [problem_id]);  
                    try {
                        const insertTestCaseQuery = sql.insertTestCase(testCases.length);
                        await db.query(insertTestCaseQuery, testCases.reduce((prev, e)=>{
                            return prev.concat([ e.input_example, e.output_example, problem_id ]);
                        }, []));
                    } catch(e) {
                        await db.query("ROLLBACK");
                        res.status(500).send({ result: false, message: "잘못된 testcase 입력" })
                    }
                    await db.query("COMMIT");
                    
                    res.status(200).send({
                        result : true,
                        data: [],
                        message : '문제가 수정되었습니다.'
                    })  
                }  
            }else{
                res.status(200).send({
                    result : false,
                    data: [],
                    message : '입력 정보에 빈 칸이 존재합니다.'
                })
            }
        }else{
            res.status(201).send({
                result : false,
                data: [],
                message : '문제 추가 권한이 없습니다.'
            })
        }
    }catch(error){
        helper.failedConnectionServer(res, error);
    }
})
module.exports = router;