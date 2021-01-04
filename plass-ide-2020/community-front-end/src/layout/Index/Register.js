import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { userActions } from "../../_action";
import { connect } from "react-redux";

var password2;
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      user: {
        userid: "",
        password: "",
        name: "",
        email: "",
        major: "",
        admin: "1"
      }
    };
  }
  checkPassword = () => {
    return this.state.user.password === password2;
  };
  //테스트부터 입력한 데이터
  handleChange = event => {
    const { name, value } = event.target;
    if (name === "password2") {
      password2 = value;
    }
    this.setState({
      user: {
        ...this.state.user,
        [name]: value
      }
    });
  };
  //회원가입 이벤트
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { user } = this.state;
    try {
      if (
        user.userid &&
        user.password &&
        user.name &&
        user.email &&
        user.major &&
        user.admin &&
        this.checkPassword()
      ) {
        this.props.register(user);
      }
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    if (this.props.registering) {
      return <Redirect to=""/>;
    }
    const { user, submitted } = this.state;
    return (
      <div className="login-form">
        <form action="post" onSubmit={this.handleSubmit}>
          <legend>
            <h2>회원가입</h2>
          </legend>
          <br />
          <div className="form-group">
            <table className="register-table">
              <tbody>
                <tr>
                  <td width="20%">학번</td>
                  <td width="80%">
                    <input
                      type="text"
                      onChange={event => this.handleChange(event)}
                      name="userid"
                      placeholder="학번"
                    />
                    {submitted && !user.userid && (
                      <div className="help-block">Id is required</div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>비밀번호</td>
                  <td>
                    <input
                      type="password"
                      onChange={event => this.handleChange(event)}
                      name="password"
                      placeholder="비밀번호"
                    />
                    {submitted && !user.password && (
                      <div className="help-block">Password is required</div>
                    )}
                  </td>
                </tr>
                <tr>
                <td>비밀번호 확인</td>
                  <td>
                    <input
                    type="password"
                    onChange={event => this.handleChange(event)}
                    name="password2"
                    id="input"
                    placeholder="비밀번호 확인"
                    />
                    {submitted &&
                      !this.checkPassword(user.password, password2) && (
                        <div className="help-block">Password is required</div>
                      )}
                  </td>
                </tr>
                <tr>
                  <td>이름</td>
                  <td>
                    <input
                      type="text"
                      onChange={event => this.handleChange(event)}
                      name="name"
                      placeholder="이름"
                    />
                    {submitted && !user.name && (
                      <div className="help-block">Name is required</div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td>
                    <div className="email">
                      <input
                        type="email"
                        onChange={event => this.handleChange(event)}
                        name="email"
                        placeholder="이메일"
                      />
                    </div>
                    {submitted && !user.email && (
                      <div className="help-block">Email is required</div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>전공</td>
                  <td>
                    <input
                      type="text"
                      onChange={event => this.handleChange(event)}
                      name="major"
                      placeholder="전공"
                    />
                    {submitted && !user.major && (
                      <div className="help-block">Major is required</div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <button
            type="submit"
            onClick={event => this.handleSubmit(event)}
            className="btn-login"
          >
            회원가입
          </button>
          {/* {this.props.registering && (
            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
          )} */}
        </form>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { registering } = state.user;
  return {
    registering
  };
};
const mapDispatchToProps = dispatch => {
  return {
    register: user => {
      dispatch(userActions.Register(user));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
