var db = require('../modules/db-connection-pool');
var sql = require('../sql');
var compiler = require('../modules/compile-run');

var { PROBLEM_START_DELEMETER: startDelem, PROBLEM_END_DELEMETER: endDelem } = process.env;

module.exports = function(io) {
    const socket = io.of('/problems');
    socket.on('connection', function(socket) {
        console.log("connected");

        socket.on("problems", async function({ sourceCode, language, problemId }) {
            const [testCases] = await db.query(sql.selectTestCaseByProblemId, [problemId]);
            let correctCount = 0;

            const promises = testCases.map(testcase => {

                return new Promise((resolve) => {
                    const docker = compiler.getProblemDocker(sourceCode, language);

                    let isStarted = false;
                    docker.stderr.on("data", (data) => {
                        console.log(data.toString('utf-8'));
                    })

                    docker.stdout.on("data", (data) => {
                        if(!isStarted) return;
                        const line = data.toString('utf-8');
                        if(line.includes(testcase.output)) correctCount++;
                    })

                    docker.stdout.on("data", (data) => {
                        const line = data.toString('utf-8');
                        if(line.includes(startDelem)) {
                            isStarted = true;
                            docker.stdin.write(Buffer.from(testcase.input + "\n"));
                        } else if(line.includes(endDelem)) {
                            isStarted = false;
                            resolve();
                        }
                    });
                });
            })

            for(let i = 0 ; i < promises.length; i++) { await promises[i] } // TODO: recfectoring this

            socket.emit("result", { correctCount, count: testCases.length })
            socket.leave();
        })
    });
}