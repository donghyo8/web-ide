import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {FaEdit } from 'react-icons/fa';
import Search from '../../../components/Search';
import Loading from '../../../components/Loading';
var moment = require('moment');
export default class ListProblem extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			listProblem : this.props.listProblem,
			loading : true
		}
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
	render() {
		let { handleDetailsProblem } = this.props;
		let { listProblem, loading } = this.state;
		console.log(listProblem)
		if(listProblem.length === 0 && this.props.listProblem.length !== 0) //!refactoring
		{
			listProblem = this.props.listProblem;
			loading = false;
		}
		if(loading)
		{
			return (
				<Loading/>
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
                    </div><br/>
                    <table className="table table-contribution" border = "1">
					<thead>
						<tr>
							<th width = "10%">문제 번호</th>
							<th width = "35%">제목</th>
							<th width = "10%">난이도</th>
							<th width = "10%">작성일</th>
							<th width = "5%">풀이</th>
						</tr>
					</thead>
					<tbody>
						{
							listProblem.map((item,index) => {
								return (
									<tr key = {index}>
										<td>{item.id}</td>
										<td style = {{cursor : "pointer"}} onClick = {(event) => {event.preventDefault(); handleDetailsProblem(item.id, "details")}}>{item.name}</td>
										<td>{item.level}</td>
										<td>{moment(item.created).format("YYYY-MM-DD")}</td>
										<td style = {{cursor : "pointer"}} onClick = {(event) => {event.preventDefault(); handleDetailsProblem(item.id, "modify")}}>보기</td>
									</tr>
								)
							})
						}
					</tbody>     
                    </table>
            </div>
        )
    }
}
