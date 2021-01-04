import React, { Component } from 'react';
import ListProblem from './ListProblem';
import callAPI from '../../../_utils/apiCaller';
import { Route } from 'react-router';
import ProblemDetail from './ProblemDetail';
class Problems extends Component {
	constructor(props, context) {
        super(props, context)
        this.state = {
			listProblem : [],
			selectedProblem: {},
		}
	
	}
	getToken(){
        const token = localStorage.getItem('token')
        return {
            auth_token : token
        }
	}
    async componentDidMount(){
        try {
			const response = await callAPI('problems','GET',this.getToken(),null);
			const { data } = await response.data;
			this.setState({
				listProblem : data
			})
		} catch (error) {
			alert("계속 사용하려면 다시 로그인 하십시오");			
		}
	}
	handleDetailsProblem = (id, method) =>
	{	
		//! Promise refactoring
		let filteredProblem = this.state.listProblem.filter((element) => element.id === id)
		this.setState({
			problem : filteredProblem
		})
		this.props.history.push(`${this.props.match.path}/details?id=${id}`);
	}
	render(){ 
		return( 
		<div className = "problem">
			<div className = "row">
				<div className = "content">
					<Route path = {`${this.props.match.path}/list`} 
						render = {(props) => <ListProblem {...props} listProblem = {this.state.listProblem} handleDetailsProblem = {this.handleDetailsProblem}/>}
					/>
					<Route path = {`${this.props.match.path}/details`} 
						render = {(props) => <ProblemDetail {...props} problem = {this.state.problem} />}
					/>
				</div>
			</div>
		</div>
		)
  };
}
export default Problems;
