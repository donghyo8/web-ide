require('dotenv').config();
const compiler = require('./modules/compile-run');


module.exports = function doTest() {

    const testcase = [
        {input: "1\n", output: "1\n"},
        {input: "2\n", output: "2\n"},
        {input: "3\n", output: "3\n"},
    ];
    
    let correct = 0;
    for(let i = 0; i < testcase.length; i++) {
        const docker = compiler.run('/0N9ef6Tu92QuYrcOWO3W', 'cpp');
        let isInjected = false;
        setTimeout(()=>{
            docker.stdin.write(testcase[i].input);
            isInjected = true;
        }, 3000);
    
    
        docker.stdout.on("data", function(chunk) {
            if(!isInjected) return;
            const data = chunk.toString();
            if(data === testcase[i].output) {
                correct++;
                console.log(`answer corrected ${correct}/${testcase.length}`);
            }            
        });
    
        docker.stderr.on("data", function(chunk) {
            console.log("err", chunk.toString());
        });
    }
}