import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Login from '../layout/Index/Login'
import Register from '../layout/Index/Register'
import queryString from 'query-string';

function Contribution() {
    return (
        <div className="contribution">
            <h1>
                본 웹 IDE는 컴퓨터공학과 PLASS 연구실의 손윤식교수님 지도 하에
                        </h1>
            <h1>
                컴퓨터공학과 이준영, 양승영, 양시연, 이혜린, 김민성, 구미송, 심나영, 장효정,
                        </h1>
            <h1>
                김동효, 장종욱, 최수린, 응웬딩흐엉 학생들의 연구개발을 통해 개발되었습니다.
                        </h1>
            <br></br><br></br><br></br>
            <h1>[지원 프로젝트]</h1>
            <h1> - SW중심대학지원사업</h1>
            <h1> - 대학혁신지원사업</h1>
        </div>
    )
}
export default class Index extends Component {
    defaultRight = () =>{
        return (
            <div className = "right-box composition">
                <img src="./images/index.PNG"  className="right-image composition__photo composition__photo_1" alt="photo1"/>
                <img src="./images/index.PNG"  className="right-image composition__photo composition__photo_2" alt="photo1"/>
                <img src="./images/index.PNG"  className="right-image composition__photo composition__photo_3" alt="photo1"/>
            </div>
        )
    }
    menuRightComponents = () => {
        const page = queryString.parse(this.props.location.search).p;
        switch (page) {
            case "contribution":
                return <Contribution />;
            case "login":
                return <Login />;
            case "register":
                return <Register />;
            default:
                return this.defaultRight(); 
        }
    }
    render() {
        return (
        <div className = "main">
            <div className = "main_header">
                <ul className = "ul-nolist-inline">
                    <li><Link to = "/?p=login">로그인</Link></li>
                    <li><Link to = "/?p=register">회원가입</Link></li>
                    <li><Link to = "/?p=contribution">Contribution</Link></li>
                </ul>
            </div>
            <div className = "main_bottom"> 
                <div className="col span-1-of-2 main_bottom-left">
                        <div className = "logo_text">
                            <Link to = "/"><img src="./images/logo.jpg" className="logo" alt="Main logo"/></Link>
                            <span>DGU Programming</span>
                        </div>
                            <h2>온라인 환경에서 개발하세요.</h2>
                            <div className = "link-lab"
                                style ={{
                                marginTop : "50px"
                            }}>
                                <Link to = "/" onClick = {(event) => {event.preventDefault() ;window.open("http://plass.dongguk.edu/")} }target = "_blank" className = "btn btn_primary" style = {{
                                    padding: '15px',
                                    background: "#d35400",
                                    fontSize: '20px',
                                }}>PLASS 홈페이지 이동</Link>
                            </div>
                        <div className = "contribution-box u-mr-top-small">
                            {/* <Link to = "/index?p=contribution" className = "btn btn_contribution">CONTRIBUTION</Link> */}
                        </div>
                </div>
                <div className="col span-1-of-2 main_bottom-right">
                    {this.menuRightComponents()}
                </div>
            </div>
        </div>
        )
    }
}
