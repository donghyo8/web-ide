module.exports = {
	projects: require('./projects'),
	selectReportsByUserId: `
	select users_report.id as id, reports.id as report_id, reports.title as title, reports.limitdate as limitedate, 
		users_report.project_id as project_id from users_report 
		right join reports
		on users_report.reports_id = reports.id
		where users_report.user_id = ?
		order by limitdate desc`,
	selectTestCaseByProblemId: `select id, input_example as input, output_example as output from testCases where problem = ?`,
	updateReportsWithProjectId: 'update users_report set project_id = ? where id = ?'
};