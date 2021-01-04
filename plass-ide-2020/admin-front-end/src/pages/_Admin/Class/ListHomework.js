import React, { Component } from 'react';
import {
    Link
} from "react-router-dom";
import Homework from '../../../layout/Class/Homework';
import { MdLibraryBooks } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import callAPI from '../../../_utils/apiCaller';
const queryString = require('query-string');
class ListHomework extends Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			listHomework : []
		}
	}
	getToken = () => {
		const token = localStorage.getItem('token')
		return {
			auth_token: token
		}
	}
	componentDidUpdate(prevProps){
		if (prevProps.classId !== this.props.classId) {
			const { classId } =  this.props
			callAPI(`lectures/${classId}/homework`, 'GET', this.getToken(),null).then(res => {
				this.setState({
					listHomework : res.data.data
				})
			})
		}
	}
	componentDidMount()
	{
		const { classId } = this.props;
		callAPI(`lectures/${classId}/homework`, 'GET', this.getToken(),null).then(res => {
			this.setState({
				listHomework : res.data.data
			})
		})
	}
	currentCourse = () => {
		const course = queryString.parse(this.props.location.search).p;
		return course;
	}
	render(){ 
	const { listHomework } = this.state;
    return(
		<div className ="class_homeworks">   
			<h2><i className = "icon"><MdLibraryBooks /></i>과제 관리</h2>    
			<div className = "u-text-right u-mr-bottom-small">
				<Link className = "btn_primary" to = {`homeworkcreate?p=${this.currentCourse()}`} ><i className = "icon"><FaEdit/>&nbsp;</i>과제 등록</Link>
			</div>
			<div className =  "list_homework">
				{
					listHomework.slice(0).reverse().map((item, index) => (
						<Homework key = {index}
							homework = {item}
							course = {this.currentCourse()}
							file = {{
								name : item.name,
								path : item.path
							}}
						/>
					))
				}
			</div>
		</div>
    )
	};
}
export default ListHomework;
