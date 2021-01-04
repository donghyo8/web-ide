module.exports = {
    selectTutorials: "select * from tags where parent_id = 0",
    selectTagsByTutorialId: "select * from tags where parent_id = ?",
    selectTagsByTutorialId2: "select tags.id,tags.name from tags where parent_id = ?",
    selectProblemsByTagId: `select p.*,ts.input_example,ts.output_example from problems as p, problems_tag as pt, testCases as ts 
    where p.id = pt.problem_id and p.id = ts.problem and pt.tag_id = ?`,
    insertProblemTag: "insert into problems_tag(problem_id, tag_id) values (?, ?)"
}