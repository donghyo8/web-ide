import React from 'react';
import {Link} from "react-router-dom";
import classname from 'classname'
import callAPI from '../_utils/apiCaller';
function Welcome({HeaderTask}) {
    return (
        HeaderTask.map((item, index) => {
            if(item.title === "프로젝트 관리")
                return (
                <li key = {`li-${index}`}><Link to = "editor" onClick = {(event) => {event.preventDefault(); window.open(item.url)}}>{item.title}</Link></li>
                )
            return (
                <li className = {classname({'select-home': item.isSelected})} key = {`li-${index}`}><Link to = {`${item.url}`}>{item.title}</Link></li>
            )
        })
    )
}
class Header extends React.Component {
    state = {
        isOpen:false
    };
    handleToggle = () => {
        this.setState({ isOpen : !this.state.isOpen});
    }
    handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        callAPI('users/logout','GET',null, null).then(res => {})
    }
    render() {
    return (
    <div className = "header">
            <div className="header__top">
                <div className = "header__top_logo-box">
                    <Link to = "/main/home">
                        <img src="../../images/logo.jpg" className="logo" alt="Main logo"
                            style = {{
                                width : "100px",
                            }}/>
                    </Link>
                </div>
                <div className = "header__top_text-box">
                    <h1><Link to = "/main/home">DGU IDE</Link></h1>
                </div>
                <div className= "header__top_user-box">
                        <span>{this.props.userid} ({this.props.userName})</span> &nbsp;<Link onClick = {() => this.handleLogOut()} to = "/" >로그아웃</Link>
                </div>
            </div>
            <div className = "header__bottom">
                <div className = "row">
                    <ul className = "header__bottom-nav ul-nolist-inline">
                        <Welcome 
                            HeaderTask = {[
                        {
                                title : "학습 목차",
                                url : "/main/class/notice",
                                isSelected : window.location.pathname.includes("/main/class/")
                            },
                            {
                                title : "문제 리스트",
                                url : "/main/problems/list",
                                isSelected : window.location.pathname.includes("/main/problems")
                            },
                            {
                                title : "프로젝트 관리",
                                url : `http://210.94.194.70:8001?id=${this.props.userSeq}`,
                                isSelected : false
                            },
                            {
                                title : "마이페이지",
                                url : "/main/home", 
                                isSelected : window.location.pathname.includes("/main/home")
                            }
                            ]}
                        />
                    </ul>
                </div>
            </div>
        </div>
        )
    }
}
export default Header;
