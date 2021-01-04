var fs = require('fs');
var path = require('path');

const ROOT = path.resolve(process.env.ROOT_PATH);

const DIRS = [ ROOT ];

function checkDir() {
	DIRS.forEach( dir => {
		fs.lstat(dir, ( err ) => {
			if(err) {
				if(err.errno !=- 2) { throw Error(err) }
				generateDir(dir);
				return;
			}
		});
	})
}

function generateDir(dir) {
	fs.mkdirSync(dir); // 디렉토리 생성
	console.debug(`디렉토리 생성 ${dir}`);
}

module.exports = { checkDir };