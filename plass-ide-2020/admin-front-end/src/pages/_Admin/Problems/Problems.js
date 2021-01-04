import React, { Component } from 'react';
import CreateProblem from './CreateProblem/CreateProblem';
import ListTutorial from './ListTutorial/ListTutorial'
import { Route } from 'react-router';
// import ListProblem from './ListProblem';
import DetailsTutorial from './DetailTutorial/DetailsTutorial';

class Problems extends Component {
	constructor(props, context) {
        super(props, context)
        this.state = {
			listProblem : [],
			problem : {},
			
			problemName : '',
			problemContent : '',
			problemInput : '',
			problemOutput : '',
			problemOutputExam : '',
			problemInputExam : '',
			category : 'C/C++',
			level : '하',
			modify : false,
		}
	}
	getToken(){
        const token = localStorage.getItem('token')
        return {
            auth_token : token
        }
	}
	handleDetailsProblem = (id, method) =>
	{	
		//! Promise refactoring
		let filteredProblem = this.state.listProblem.filter((element) => element.id === id)
		this.setState({
			problem : filteredProblem
		})
		switch (method) {
			case "details":
				this.props.history.push(`${this.props.match.path}/details?id=${id}`);
				break;
			default: //default modify
				this.props.history.push(`${this.props.match.path}/modify?id=${id}`);
				break;
		}
	}
	render(){ 
		return( 
		<div className = "problem">
			<div className = "row">
				<div className = "content">
					<Route path = {`${this.props.match.path}/list`} 
						render = {(props) => <ListTutorial />}
					/>
					<Route path = {`${this.props.match.path}/tutorial`} 
						render = {(props) => <DetailsTutorial  {...props} />}
					/>
					<Route path = {`${this.props.match.path}/modify`}
						render = {(props) => <CreateProblem {...props} problem = {this.state.problem} method = "modify"/>}
					/>
					<Route path = {`${this.props.match.path}/create`} 
						render = {(props) => <CreateProblem  {...props} method = "create" />} />
				</div>
			</div>
		</div>
		)
	};
}
export default Problems;
