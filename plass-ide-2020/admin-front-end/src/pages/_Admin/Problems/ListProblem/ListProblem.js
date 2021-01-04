import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {FaEdit } from 'react-icons/fa';
import Search from '../../../../components/Search';
import Loading from '../../../../components/Loading';
import './ListProblem.scss'
import qs from 'query-string'
var moment = require('moment');
export default class ListProblem extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			problems: [],
			loading: true,
			singleProblem: {},
			displayProblem: !this.props.displayList,
		}
	}
	getProblemsByTagId = async (childTagId) => {
		let { listTutorials } = this.props;
        let child  ='';
        for(let i = 0; i < listTutorials.length; i++)
        {
			const { childTag } = listTutorials[i];
			child = childTag.filter(element => element.id === parseInt(childTagId))
			if(child.length !== 0){
				const problems = child[0].problems;
				this.setState(() => {
					return { problems, loading: false}
				})
			}
		}
    }
	componentDidMount(){
		let { problems, handleClickTag } = this.props;
		const { tagid } = qs.parse(this.props.location.search);
		if(tagid){
			handleClickTag(tagid);
		}
		this.setState(() => {
			return {
				problems,
				loading : false
			}
		})

	}
	handleFiltersChange = (newFilters) => {
		const { option, text } = newFilters;
		if(!text)
		{
			window.location.reload();
		}
		switch (option) {
			case "제목":
				var filteredText = this.props.listProblem.filter((element) => element.name.includes(text))
				this.setState({
					listProblem : filteredText,
					loading: false
				})
				break;
			case "난이도":
				var filteredLevel = this.props.listProblem.filter((element) => element.name.includes(text))
				this.setState({
					listProblem : filteredLevel,
					loading: false
				})
				break;
			default: //default 난이도
				window.location.reload();
				break;
		}
	}
	static getDerivedStateFromProps(nextProps, currentState) {
		if (nextProps.problems !== currentState.problems) {
			return {
				displayProblem: false
			};
		}
	}
	handleDetailsProblem = (id) => {
		const { problems } = this.state;
		const problem = problems.filter(element => element.id === id)[0];
		this.setState(() => {
			return{
				singleProblem : problem,
				displayProblem: true,
			}
		})
	}
	handlePrevProblems = (id) => {
		const { problems } = this.state;
		let problem = problems.filter(element => element.id === id);
		console.log(problem)
		let index = problems.findIndex(item => item.id === problem[0].id);
		if((index-1) === -1)
			return;
		let prevProblem = problems[index-1];
		this.setState({
			singleProblem : prevProblem
		})
	}
	handleNextProblems = (id) => {
		const { problems } = this.state;
		let problem = problems.filter(element => element.id === id);
		let index = problems.findIndex(item => item.id === problem[0].id);
		if((index+1) === problems.length)
			return;
		let nextProblem = problems[index+1];
		this.setState({
			singleProblem : nextProblem
		})
	}
	render() {
		let {loading, displayProblem, singleProblem } = this.state;
		let { problems, displayList } = this.props;
		if(loading)
		{
			return (
				<Loading/>
			)
		}
		if(displayProblem){
			return (
				<DetailProblem problem = {singleProblem} 
				problems = {problems}
				handlePrevProblems = {this.handlePrevProblems}
				handleNextProblems = {this.handleNextProblems}
				/>
			)
		}
        return (
            <div className = "list_problem">
                	<h2 className = "u-text-center">문제 리스트</h2>
                    <div className = "headding">
						<Search
                            onSubmit = {this.handleFiltersChange}
                            method = "search-problems"
                            option = {
                                [ '제목', '난이도']
                            }
                        />
						<Link className = "btn_write u-mr-bottom-small" to = "create"><i className = "icon"><FaEdit/></i>문제 작성</Link>
                    </div>
					{
						problems.length !== 0 ?
						<React.Fragment>
							<table className="table table-contribution" border = "1">
								<thead>
									<tr>
										<th width = "10%">문제 번호</th>
										<th width = "35%">제목</th>
										<th width = "10%">난이도</th>
										<th width = "10%">작성일</th>
										<th width = "5%">수정</th>
									</tr>
								</thead>
								<tbody>
									{
										problems.map((item,index) => {
											return (
												<tr key = {index}>
													<td>{item.id}</td>
													<td style = {{cursor : "pointer"}} onClick = {(event) => {event.preventDefault(); this.handleDetailsProblem(item.id, "details")}}>{item.name}</td>
													<td>{item.level}</td>
													<td>{moment(item.created).format("YYYY-MM-DD")}</td>
													<td style = {{cursor : "pointer"}} onClick = {(event) => {event.preventDefault(); this.handleDetailsProblem(item.id, "modify")}}><FaEdit/></td>
												</tr>
											)
										})
									}
								</tbody>     
							</table>
						</React.Fragment>
						: <div style ={{
							textAlign:"center",
							marginTop:"10rem",
							fontSize:"2rem"
						}}>문제가 추가 될 예정입니다</div>
						}
            </div>
        )
    }
}
function DetailProblem({problems, problem, handlePrevProblems, handleNextProblems}){
	console.log(problem)
	return (
	<div  className = "problem_detail">
			<div className="nextTop">
				<button onClick= {() => handlePrevProblems(problem.id)} disabled={problem.id === problems[0].id}>앞 문제</button>
				<button onClick= {() => handleNextProblems(problem.id)} disabled={problem.id === problems[problems.length-1].id}>뒤 문제</button>
			</div>
			<div className = "problem_name u-mr-top-small">
				<span>{problem.id}.{problem.name}</span>
				{/* <button to = "#"  className = "btn btn_primary" onClick = {() => this.handleDisplayEditor()}>프로젝트 생성</button> */}
			</div>
			<div className = "problem_content">
				<div className = "define border-btm">
					<h3>문제</h3>
					<p>
					{problem.content}
					</p>   
				</div>    
				<div className = "problem_input border-btm">
					<h3>입력</h3>
					<p>
					{problem.input}
					</p>
				</div>    
				<div className = "problem_output border-btm">
					<h3>출력</h3>
					<p>
					{problem.output}
					</p>
				</div>                                           
				<div className = "problem-example">                   
					<div className = "col span-1-of-2 example_input">
						<h3 >입력 예제 1</h3><br/>
						<textarea className="form-control" cols="55"rows="12" disabled value = {problem.input_example}>
						</textarea>
					</div>
					<div className = "col span-1-of-2 example_output">
						<h3 >출력 예제 1</h3><br/>
						<textarea className="form-control" cols="55" rows="12" disabled  value =  {problem.output_example}>
						</textarea>
					</div>
				</div>    
			</div>
		</div>
	)
}
