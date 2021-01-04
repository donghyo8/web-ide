 import React, { Component } from 'react';
import ListHomework from './ListHomework';
import ClassEvaluation from './Evaluation'
import CreateHomework from '../../../layout/Class/CreateHomework'
import ClassNotice from './ClassNotice';
import ListRegister from './ListRegister';
import ClassTasks from '../../../layout/Class/ClassTasks';
import ClassInfor from '../../../layout/Class/ClassInfor';
import { Route } from 'react-router';
import HomeworkDetails from '../../../layout/Class/HomeworkDetails';
import qs from 'query-string';
import callAPI from '../../../_utils/apiCaller';
import FutureWorks from '../../../layout/Class/FutureWorks';

const routes = [
	{
		path : (path) =>  `${path}/notice`,
		render : (data) => ((props) => <ClassNotice {...props}  classId = {data}/>)
	},
	{
		path : (path) =>  `${path}/homework`,
		render : (data) => ((props) => <ListHomework {...props}  classId = {data}/>)
	},
	{
		path : (path) =>  `${path}/homeworkview/:id`,
		render : (data) => ((props) => <HomeworkDetails {...props} classId = {data} />)
	},
	{
		path : (path) =>  `${path}/registers`,
		render : (data) => ((props) => <ListRegister {...props} classId = {data} />)
	},
	{
		path : (path) =>  `${path}/homeworkevaluation`,
		render : (data) => ((props) => <ClassEvaluation {...props} classId = {data} />)
	},
	{
		path : (path) =>  `${path}/homeworkcreate`,
		render : (data) => ((props) => <CreateHomework {...props} classId = {data} />)
	},
	{
		path : (path) =>  `${path}/homeworkmodify`,
		render : (data) => ((props) => <CreateHomework {...props}  classId = {data}/>)
	},
]
class Class extends Component {
	constructor(props) {
		super(props)
		this.state = {
			listMyClass : [],
			selectedClass : [],
		}
	}
	getToken = () => {
		const token  = localStorage.getItem('token')
		return {
			auth_token : token
		}
	}
	async componentDidMount(){
		await callAPI('lectures/register','GET',this.getToken(),null).then(res => {
			try {
				this.setState({
					listMyClass : res.data.data
				})
			} catch (error) {
				alert("사용하려면 다시 로그인을 하세요")
				this.props.history.push(`/`);	
			}
			const {p} = qs.parse(this.props.location.search);
			if(p === undefined)
			{
				const { listMyClass } = this.state;
				if(listMyClass.length !== 0)
				{
					let firstClassId = listMyClass[0].id;
					this.props.history.push(`/main/class/notice?p=${firstClassId}`)
				}
			}else{
				const found = this.state.listMyClass.find(element => element.id === parseInt(p));
				this.setState({ selectedClass : found })
			}
		})
	}
	handleChangeSelectClass = async (event) => {
		const found = this.state.listMyClass.find(element => element.id === parseInt(event.target.value));
		this.setState((state) => {
			return {
				selectedClass : found
			}
		})
		this.props.history.push(`?p=${found.id}`);
	}
	currentPageName = () => {
		const page = this.props.location.pathname;
		return page.includes("notice") ? "홈" : page.includes("homework") ? "과제 관리" : "수강생 관리"
	}
	render(){ 
	const { listMyClass } = this.state
	const clickCurrentClass = this.state.selectedClass.length !== 0 ? this.state.selectedClass : listMyClass[0];
    return(	
		<>
		{
			listMyClass.length !== 0 ? 
			<>
			<ClassInfor 
				classInfo = {clickCurrentClass}
			/>
			<div className="class_instance">
            <div className = "row">
                <div className = "class_instance-body">
					<div className = "col span-1-of-5">
						<div className = "my_class-list">
							<select className = "u-outline-null" value={this.state.selectedClass.id} onChange = {event => this.handleChangeSelectClass(event)}>
								{
									listMyClass.map((item, index) => (
										<option key = {`class-idx${index}`} value = {item.id}>{item.title}</option>
									))
								}
							</select>
						</div>
						<div className = "left-box">
							<ClassTasks
							tasks = {[
								{
									block: '홈',
									link: `${this.props.match.path}/notice?p=${clickCurrentClass.id}`,
									isSelected :
									!this.props.location.pathname.includes("homework") && !this.props.location.pathname.includes("registers")
								},
								{
									block: '과제 관리',
									link: `${this.props.match.path}/homework?p=${clickCurrentClass.id}`,
									isSelected: this.props.location.pathname.includes("homework")
								},
								{ 
									block: '수강생 관리',
									link:  `${this.props.match.path}/registers?p=${clickCurrentClass.id}`,
									isSelected: this.props.location.pathname.includes("registers")
								}]}
							/>
						</div>
						<FutureWorks />
					</div>
					<div className = "col span-4-of-5">
						<div className = "path-task">
							<span>강의실 > {clickCurrentClass.title} > {this.currentPageName()}</span>
						</div>
						<div className = "right-box">
						{
							routes.map((route) => (
								<Route
									key={route.path}
									path={route.path(this.props.match.path)}
									render={route.render(clickCurrentClass.id)}
								/>
							))
						}
						</div>
					</div>
				</div>
			</div>
        </div>
			</> :
			<h2 className = "u-text-center" style = {{height : "100vh"}}>개설된 강좌가 없습니다</h2>
		}
		</>
    )
	};
}
export default Class