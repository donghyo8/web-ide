var fs = require('fs').promises;
var _fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var mkdirp = require('mkdirp');

const ROOT = process.env.ROOT_PATH;
const TRASH = process.env.TRASH_PATH
const BOILERPLATES = process.env.BOILERPLATE_PATH

/**
 * zip파일이 압축이 해제됐는지 확인하는 함수
 * 
 * @param {String} filePath 압축파일 이름 
 * @returns {Boolean} 압축해제 여부
 */
async function isUnzipped(filePath) {
	const fileDirPath = path.dirname(filePath);
	const extname = path.extname(filePath);
	const fileName = path.basename(filePath, extname);

	try {
		const stat = await fs.lstat(path.resolve(fileDirPath, fileName)); // 이름과 같은 디렉토리가 있는지 확인
		return stat.isDirectory(); // 그 파일이 디렉토리면 압축이 풀린 것 으로 판단
	} catch(e) {
		return false;
	}
}


/**
 * 파일 목록을 읽을 때 사용하는 함수
 * @param {string} _startPath
 * @param {String} _filePath 
 * @param {Boolean} readSubDir 서브 디렉토리 읽을지 여부
 * @returns {Array}
 */
async function readFiles(_filePath, readSubDir, onlyDirs) {
	const root = path.resolve(ROOT, _filePath);
	const files = [];

	// 디렉토리 읽기
	const fileNames = await fs.readdir(root);

	for (let i = 0; i < fileNames.length; i++) {
		// 하위 파일 명
		const filePath = (_filePath ? (_filePath + path.sep) : "") + fileNames[i];
		const fileInfo = await readFileInfo(filePath, {readSubDir, onlyDirs});
		if(fileInfo) files.push(fileInfo);
	}

	return files;
}

const defaultOptions = {readSubDir: false, onlyDirs: false, buffer: false};
/**
 * 파일 정보를 얻기 위한 함수이다
 * @param {String} _filePath
 * @param {{readSubDir: Boolean, onlyDirs:Boolean, buffer: Boolean}} 서브 디렉토리 읽을지 여부
 * @returns {Object}
 * @throws
 * code	-102 파일 / 디렉토리가 존재하지 않는경우
 */
async function readFileInfo(_filePath, {readSubDir, onlyDirs, buffer}=defaultOptions) {
	const filePath = path.resolve(ROOT, _filePath);
	let stat;
	try {
		stat = await fs.stat( filePath );
	} catch(e) {
		throw { code: -102, msg: "파일이 존재하지 않습니다", path: _filePath};
	}
	const file = {path: _filePath.slice(_filePath.indexOf(path.sep) + 1)};
	console.log(file);
	// 파일 사이즈
	file["size"] = stat.size;
	file["name"] = _filePath ? path.basename(filePath) : "";
	file["regDate"] = stat.birthtime;

	if(stat.isDirectory()) {
		file["isDirectory"] = true;
		file["ext"] = "dir";
		file["attr"] = "dir";

		if(readSubDir) file["files"] = sortFiles(await readFiles(_filePath, readSubDir, onlyDirs));
		
		return file;
	} else if(!onlyDirs) {
		file["attr"] = "normal";
		file["ext"] = path.extname(filePath).split(".")[1];
		file["data"] = await fs.readFile(filePath, 'utf-8');

		if(buffer) file["buffer"] = await fs.readFile(filePath);
		
		switch(file["ext"]) { // 확장자에 따른 추가 정보 
			case ".zip": file["unziped"] = await isUnzipped(filePath); break;
		}

		return file;
	}
}


/**
 * 파일 저장을 위한 함수
 * @param {string} data 데이터
 * @param {String} projectPath 프로젝트의 주소
 * @param {String} filePath 목적 주소
 * @throws {Object} 파일 생성 실패시 error exception
 * code	-100 하위 path가 디렉토리가 아닌 경우
 * code -101 파일 / 디렉토리가 존재하는 경우
 */
async function saveFile(data, filePath, subpath, name) {
	const targetPath = path.resolve(ROOT, filePath, subpath, name);
	console.log("이거임");
	console.log(subpath);
	console.log(filePath);
	if(_fs.existsSync(targetPath)) {
		throw { code: -101, msg: "파일이 존재합니다", path: targetPath};
	}

	await fs.writeFile(targetPath, data, "utf-8");
}

/**
 * 
 * @param {} projectPath 
 * @param {*} filePath 
 * @param {*} name 
 */
async function modifyFile(data, subpath, filePath) {
	const targetPath = path.resolve(ROOT, subpath, filePath);

	let stat;
	try {
		stat = await fs.stat( targetPath );
	} catch(e) {
		throw { code: -102, msg: "파일이 존재하지 않습니다", path: _filePath};
	}
	if(stat.isDirectory()) throw { code: -101, msg: "디렉토리는 수정 불가능합니다.", path: targetPath};

	await fs.writeFile(targetPath, data, "binary");
}

/**
 * 디렉토리 생성 함수
 * @param {String} projectPath
 * @param {String} filePath
 * @param {String} name
 * @throws {Object} 파일 생성 실패시 error exception
 * code	-100 하위 path가 디렉토리가 아닌 경우
 * 		-101 파일 / 디렉토리가 존재하는 경우
 */
async function createDirectory(projectPath, filePath, name) {
	const targetPath = path.resolve(ROOT, projectPath, filePath, name);
	console.log(targetPath);
	if(_fs.existsSync(targetPath)) {
		throw { code: -101, msg: "파일이 존재합니다", path: targetPath};
	}

	await (new Promise((resolve, reject) => {
		mkdirp(targetPath, (err) => {
			if(err) { reject(err); return; }
			resolve();
		});
	}));
	
}

/**
 * 파일의 이름 변경
 * @param {String} _filePath 파일경로
 * @param {String} name 변경할 이름
 * @throws
 * code	-102 파일 / 디렉토리가 존재하지 않는경우
 */
async function renameFile(_filePath, middlePath, name) {
	const filePath = path.resolve(ROOT, middlePath, _filePath);
	const baseDir = path.dirname(filePath);
	const newFilePath = path.resolve(baseDir, name);
	console.log(_filePath);
	console.log(ROOT);
	console.log(filePath);
	// if(!_fs.existsSync(filePath)) {
	// 	throw { code: -102, msg: "파일이 존재하지 않습니다", path: _filePath};
	// }
	try{
		console.log("tjdrhd");
		await fs.rename(filePath, newFilePath);
	} catch(e){
		console.log(e);
	}
}


/**
 * 파일들을 정렬해주는 함수이다.
 * @param {[{attr!: String, name!: String}]} files 정렬할 파일 목록
 * @returns {[]} 정렬된 파일들
 */

function sortFiles(files) {
	files.sort((a, b) => { 
		let compA = a.attr === "dir" ? 10000 : 0;
		let compB = b.attr === "dir" ? 10000 : 0;
		if (a.name > b.name ) compA -= 1;
		else if(a.name < b.name) compB -= 1;
		
		return compB - compA;
	})

	return files;
}


/**
 * 파일을 trash폴더에 넣는다.
 * @param { String } projectPath
 * @param { String } _filePath
 */
async function removeFile(projectPath, _filePath) {
	const filePath = path.resolve(ROOT, projectPath, _filePath);
	let trashPath = path.resolve(TRASH, projectPath, _filePath);

	if(!_fs.existsSync(filePath)) {
		throw { code: -102, msg: "파일이 존재하지 않습니다", path: _filePath};
	}

	if(_fs.existsSync(trashPath)) {
		let isNew = false;
		let index = 1;
		do {
			const dir = path.dirname(trashPath);
			const ext = path.extname(trashPath);
			const name = path.basename(trashPath, ext);
			
	
			trashPath = path.resolve(dir, name + `(${index})` + ext);

			isNew = !_fs.existsSync(trashPath)
		} while(!isNew)
	}

	// 하위 폴더 구조 생성
	const dir = path.dirname(trashPath);
	mkdirp(dir, () => { fs.rename(filePath, trashPath); });
}

/**
 * 파일을 복사한다
 * @param {String} _filePath 
 * @param {String} dest 
 */

function copyFile(_filePath, dest) {
	const filePath = path.resolve(ROOT, _filePath);
	const destPath = path.resolve(ROOT, dest);

	if(!_fs.existsSync(filePath)) {
		throw { code: -102, msg: "파일이 존재하지 않습니다", path: _filePath};
	}

	if(_fs.existsSync(destPath)) {
		throw { code: -101, msg: "파일이 존재합니다", path: _filePath};
	}
	
	// 하위 폴더 구조 생성
	const dir = path.dirname(destPath);
	mkdirp(dir, async function() {
		fse.copy(filePath, destPath);
	})
}

/**
 * 보일러플레이트 생성
 * @param {String} projectPath 
 * @param {String} language
 */

function createProject(projectPath, language) {
	console.log({ROOT, projectPath,BOILERPLATES, language})
	const destPath = path.resolve(ROOT, projectPath);
	const filePath = path.resolve(BOILERPLATES, language);
	

	if(!_fs.existsSync(filePath)) {
		throw { code: -102, msg: "파일이 존재하지 않습니다", path: _filePath};
	}

	if(_fs.existsSync(destPath)) {
		throw { code: -101, msg: "파일이 존재합니다", path: _filePath};
	}
	
	// 하위 폴더 구조 생성
	fse.copy(filePath, destPath);
}

module.exports = {
	readFiles,
	readFileInfo,
	saveFile,
	modifyFile,
	createDirectory,
	renameFile,
	removeFile,
	copyFile,
	sortFiles,
	createProject
};