import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {userActions} from '../../_action'
import { connect } from 'react-redux';
class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
				studentid: "", password: ""
		}
	}
	handeChange = (event) => {
		const { name, value } = event.target;
		this.setState({
				[name] : value
		})
	}
	handleSubmit(event) {
		event.preventDefault();
		const { studentid, password } = this.state;
		try {
				if (this.state.studentid && this.state.password ) {
					this.props.login(studentid, password);
				}else{
					alert("입력해주세요");
				}
		} catch (e) {
				console.log(e);
		}
	}
	render() {
		if (this.props.isAccount) {
				return <Redirect to="/main/home" />;
		}
		return (
				<div className="login-form">
					<form>
						<legend><h2>로그인</h2></legend><br />
						<br /><br />
						<div className="form-group">
								<div className="wrap-input100" data-validate="Valid email is required: ex@abc.xyz">
									<input className="input100" type="text" onChange={(event) => (this.handeChange(event))} name="studentid" placeholder="아이디 입력 (학번)" />
									<span className="focus-input100-1"></span>
									<span className="focus-input100-2"></span>
								</div>

								<div className="wrap-input100" data-validate="Password is required">
									<input className="input100" type="password" onChange={(event) => (this.handeChange(event))} name="password" placeholder="비밀번호 입력" />
									<span className="focus-input100-1"></span>
									<span className="focus-input100-2"></span>
								</div>
						</div><br /><br />
						<button type="submit" onClick={(event) => (this.handleSubmit(event))} className="btn-login btn-shadow">로그인</button>
						{/* {loginingIn &&
									<img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
						  } */}
					</form>
					<div>
						<ul>
								<Link to="#" className="text text_primary">아이디</Link>
								<Link to="#" className="text text_primary"> / 비밀번호 <span>찾기</span></Link>
						</ul>
					</div>
				</div>
		)
	}
}
const mapStateToProps = (state) => {
	const {isAccount} = state.user;
	return {
		isAccount : isAccount
	}
}
const mapDispatchToProps = (dispatch) => {
	return{
		login : (userid, username) => {
				dispatch(userActions.Login(userid,username))
		}
	}
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);