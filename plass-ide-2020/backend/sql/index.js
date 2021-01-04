module.exports = {
	selectusers : "select * from ide.users",
	selectSameLecture: "select * from ide.lectures where lecture_number = ? and lecture_name = ?",
	getNoticeByClassName : "select * from ide.notices where lecture_id = ?",
	insertNoticeAdmin: "insert into ide.notices (title, contents, lecture_id, viewcount, writer) values (?, ?, ?, ?, ?)",
	// notice_id를 통해 공지사항 검색
	// notice_id에 해당하는 공지사항 삭제
	deleteNoticeByNoticeID : "delete from ide.notices where id = ?",

	/**************************** User Sql instruction */
	//회원가입
	insertUser: "insert into ide.users(userid, password, name, email, major, admin) VALUES (?,?,?,?,?,?)",
	//로그인
	selectUserByUsernameAndPassword: "select * from ide.users where userid = ? and password = ? and admin = 0 ",
	selectUserByAdmin: "select * from ide.users where userid = ? and password = ? and admin = 1",
	selectNotAbleLectures: "select * from ide.users_lectures where user_id = ? and lecture_id = ? and enabled = 0",
	//특정한 User 출럭함
	selectUserbyUserId : "select * from ide.users where userid = ?",
	deleteRegisteredLecture: "delete from ide.users_lectures where user_id = ? and lecture_id = ?",
	selectRegisterdLectureByUserId: "select * from ide.users_lectures where user_id = ? and lecture_id = ?",
	/**************************** Lecture Sql instruction */
	//년도 학기 출력함
	selectLecturesByYearQuarter : "select * from ide.lectures where season_year = ?  and season_quarter = ?",
	//신청 여부 필요없이 특정한 과목 출력
	selectLectureByLectureId: "select * from ide.lectures where id = ?",
	//자기 신청된 과목 전체 출력
	selectRegisterdLecturesByAdmin: "select * from ide.lectures where id in (select lecture_id from ide.admin_lectures where user_id = ?)",
	//해당하는 User는 특정한 강좌 신청한 과목 출력
	selectEnabledLectureByUserId: 'select * from ide.lectures where id in (select lecture_id from ide.users_lectures where user_id = ? and enabled = 1)',
	//신청하고 있는 강좌 목록 출력함
	selectUsersLecturesByUserId: "select * from ide.users_lectures where lecture_id = ?",
	//해당하는 User는 신청하는 과목이 맞는지 체큼
	checkRegisteredByUserId: "select * from ide.users_lectures where lecture_id = ? and user_id = ? and enabled = 1",
	//해당하는 관리자의 개설되어 있는 강좌를 전체 출력함
	selectAdminLectures: "select * from ide.admin_lectures where user_id = ?",
	//해당하는 과목 관리자 맞는 체크함
	checkAdminForLecture: "select * from ide.admin_lectures where user_id = ? and lecture_id = ?",
	deleteNoticeFile : "delete from notices_files where id = ?",
	deleteFile : "delete from files where id = ?",
	deleteNoticeFileByNoticeId : "delete from notices_files where notice_id = ?",
	deleteFilesByNoticeId : "delete from files where id in (select file_id from notices_files where notice_id = ?)",
	// 강좌 정보 수정
	modifyLectureForAdmin : "update ide.lectures set title = ?, description = ?, season_year = ?, season_quarter = ?, lecture_type = ?, major = ?, lecture_number = ?, lecture_name = ?, score = ?,  professor = ? where id = ?",
	selectListEnabledRegisteredByLectureId : "select * from ide.users where id in (select user_id from ide.users_lectures where lecture_id = ? and user_id != ? and enabled = 1)",
	selectListUnenabledRegisteredByLectureId : "select * from ide.users where id in (select user_id from ide.users_lectures where lecture_id = ? and user_id != ? and enabled = 0)",
	selectRegisterdLectureByUserId: "select * from ide.users_lectures where user_id = ? and lecture_id = ?",
	// 강좌 신청
	insertUserLecture: "insert into ide.users_lectures(user_id, lecture_id, enabled) values (?, ?, 0)",
	// User의 승인 대기 중인 강좌 리스트 조회
	selectWatingLectures: "select * from ide.lectures where id in (select lecture_id from ide.users_lectures where user_id = ? and enabled = 0)",
	selectNotAbleLectures: "select * from ide.users_lectures where user_id = ? and lecture_id = ? and enabled = 0",
	deleteRegisteredLecture: "delete from ide.users_lectures where user_id = ? and lecture_id = ?",
	//해당하는 과목 모든 사용자의 정보 출력함
	selectAllRegisteredUserByLectureId : "select * from ide.users where id in (select user_id from ide.users_lectures where lecture_id = ? and enabled = 1)",
	/**************************** Homework Sql instruction */
	//특정한 과제 출력
	selectHomeworkByLectureId: `SELECT r.*,f.name,f.path FROM ide.reports as r 
								LEFT JOIN ide.reports_files as rf on r.id = rf.report_id 
								LEFT JOIN ide.files as f on rf.file_id = f.id 
								WHERE r.lecture_id = ? order by r.id;`,
	selectAllFileHomeworkId : "select r.id as hw_id, rf.id as report_file_id, f.* from ide.reports as r, ide.reports_files as rf, ide.files as f where r.id = rf.report_id and rf.file_id = f.id and r.id = ?",
	//특정한 과목의 과제 등록
	insertHomeworkByClassId: "insert into ide.reports(title, description , updated, limitdate, week, lecture_id, user_id) values (?, ?, ?, ?, ?, ?, ?)",
	selectReportByLectureId: "select * from reports where lecture_id = ? order by id",
	//특정한 강좌의 과제 출력
	selectReportById: "select * from ide.reports where id = ?",
	selectReportByContent : "select * from ide.reports where title = ? and description = ? and lecture_id = ?",
	selectUserByLectureId : "select * from ide.users_lectures where lecture_id = ? and enabled = 1",
	insertUserReport : "insert into  ide.users_report(user_id, reports_id) values (?, ?)",
	insertToReportFile : "insert into ide.reports_files(report_id, file_id) values (?, ?) ",
	deleteToReportFile : "delete from reports_files where id = ?",
	selectAllHomeworkByAdminId : "select r.*,l.title as lecture_name,l.id as lecture_id from ide.reports as r, ide.lectures as l where r.lecture_id = l.id and lecture_id in (select lecture_id from ide.admin_lectures where user_id = ?)",
	selectAllHomeworkByUserId : "select r.*,l.title as lecture_name,l.id as lecture_id from ide.reports as r, ide.lectures as l where r.lecture_id = l.id and lecture_id in (select lecture_id from ide.users_lectures where user_id = ?)",
	//특정한 강좌의 특정한 과제 수정
	updateHomwworkByClassIdHmwId: "update ide.reports set title = ? , description = ?,updated = ?, limitdate = ? ,week = ? where id = ?",
	//생성하는 과정에서 이미 존재 있는 과목 체크
	selectSameLecture: "select * from ide.lectures where lecture_number = ? and lecture_name = ?",
	//해당 ID의 과제가 존재하는 지 확인
	selectHomeworkByID: `SELECT r.*,f.name,f.path FROM ide.reports as r 
						LEFT JOIN ide.reports_files as rf on r.id = rf.report_id 
						LEFT JOIN ide.files as f on rf.file_id = f.id 
						WHERE r.id = ?;`,
	//한 강좌에 승인되어 수강중인 수강생 목록 조회
	selectRegisteredLectutreUser: "select * from ide.users_lectures where lecture_id = ? and enabled = 1",

	/**************************** Notice Sql instruction */
	getNoticeByClassName : `SELECT n.*, f.name, f.path from ide.notices as n 
							left join ide.notices_files as nf on n.id = nf.notice_id
							left join ide.files as f on nf.file_id = f.id
							where lecture_id = ? order by n.id`,
	insertNoticeAdmin: "insert into ide.notices (title, contents, lecture_id, writer,week) values (?, ?, ?, ?,?)",
	checkAdminForNotice: "select * from ide.admin_lectures where user_id = ? and lecture_id = ?",
	getNoticeByNoticeByLectureId : "select * from ide.notices where lecture_id = ?",
	// 공지 ID 출력
	selectNoticeByLecture : "select * from ide.notices where lecture_id = ? and id = ?",
	selectNoticeId : `SELECT n.*, f.name, f.path from ide.notices as n 
								left join ide.notices_files as nf on n.id = nf.notice_id
								left join ide.files as f on nf.file_id = f.id
								where  n.id = ?`,
	selectNoticeIdExistsFile : "select notice.*, f.* from notices as notice, notices_files as nf , files as f  where notice.lecture_id = ? and  notice.id = nf.notice_id and nf.file_id = f.id",
	// 강좌 공지 수정
	updateNoticeAdmin: "update ide.notices set title = ? , contents = ?, week = ? where id = ?",
	selectUserReportById : "select * from ide.users_report where reports_id = ?",
	selectAllFileByNoticeId : "select n.id as notice_id, nf.id as notices_file_id, f.* from ide.notices as n, ide.notices_files as nf, ide.files as f where n.id = nf.notice_id and nf.file_id = f.id and n.id = ?",

	//해당 과제의 모든 report 조회
	selectAllReports: "select * from ide.users_report where reports_id = ?",
	insertLectureByAdmin : "insert into ide.admin_lectures(user_id, lecture_id) values (?, ?)",
	//주차의 특정 report 조회
	selectReportByReportID: "select * from ide.users_report where reports_id = ? and id = ?",
	//특정 report의 점수 수정
	updateReportScore: "update ide.users_report set score = ? where user_id = ? and reports_id = ?",
	//대기 강좌 리스트
	selectWatingLectures: "select * from ide.lectures where id in (select lecture_id from ide.users_lectures where user_id = ? and enabled = 0)",
	
	//과목 신청하기
	insertLecturesAdmin: "insert into ide.lectures (title, description, season_year, season_quarter, lecture_type, major, lecture_number, lecture_name, score, professor) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
	
	selectLectureIdByContent: "select id from ide.lectures where title = ? and description = ? and professor = ?",
	//프로젝트 신청하기


	insertProject: "insert into projects (user_id, name, discription, path) values( ?, ?, ?, ? )",
	updateDisabled: "update ide.users_lectures set enabled = 0 where user_id = ? and lecture_id = ?",
	updateEnabled: "update ide.users_lectures set enabled = 1 where user_id = ? and lecture_id = ?",
	selectLecturesById: "select * from ide.lectures where id = ?",
	selectRegisterdLectureByUserId: "select * from ide.users_lectures where user_id = ? and lecture_id = ?",
	insertUserLecture: "insert into ide.users_lectures(user_id, lecture_id, enabled) values (?, ?, 0)",

	//문제 리스트
	selectProblems : "select * from ide.problems as p, ide.testCases as t where p.id = t.problem",
	insertProblem: "insert into ide.problems(name, content, input, output, level, category) values (?, ?, ?, ?, ?, ?)",
	deleteTestCases: "delete from ide.testCases where problem = ?",
	insertTestCase: function(testCasesCount = 1) {
		if(testCasesCount < 1) throw new Error("test case는 1개 이상이여야 합니다.");
		let query = "insert into ide.testCases(input_example, output_example, problem) values ";
		for(let i = 0 ; i < testCasesCount; i++) {
			query += "(?, ?, ?)";
			if(i + 1 !== testCasesCount) query+=", ";
		}
		return query;
	},
	selectProblemById: "select * from ide.problems as p, ide.testCases as t where p.id = t.problem and p.id = ?",
	selectTestCasesByProblemId: 'select * from ide.testCases where problem = ?',
	
	updateProblem: "update ide.problems set name = ?, content = ?, input = ?, output = ?, level = ?, category = ? where id = ?",
	// updateTestCase: "update ide.testCases set input_example = ?, output_example = ?, problem = ? where id = ?",
	selectProblemMatchId: "select * from ide.problems where id = ?",
	selectProblemByNameContent: "select * from ide.problems where name = ? and content = ?",

	// upload
	insertFiles: "insert into files(name, path) values ( ?, ? )",
	selectFileByNameAndPath: "select * from files where name = ? and path like '%?%",
	insertToNoticeFiles: "insert into notices_files(notice_id, file_id) values (? , ?)",
	insertToReportFiles: "insert into reports_files(report_id, file_id) values (? , ?)",	


	problems: require('./problems'),
};