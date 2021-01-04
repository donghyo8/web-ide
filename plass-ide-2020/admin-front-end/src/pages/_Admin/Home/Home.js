import React, { Component } from "react";
import HomeOption from "../../../layout/Home/HomeOption";
import Profile from "../../../layout/Home/Profile";
import MyListClass from "./MyListClass";
import RegisterClass from "./OpenedClass";
import CreateClass from "./CreateClass";
import Class from "../Class/Class";
import { connect } from "react-redux";
import { Route } from "react-router";
class Home extends Component {
render() {
    return (
    <>
    <Profile userData={this.props.userData} />
        <div className="home">
            <div className="row">
            <div className="home__top nav-bar">
            <HomeOption
                headerText={[
                {
                    title: "강좌 목록",
                    page: "",
                    isSelected:
                    !this.props.location.pathname.includes("openclass") &&
                    !this.props.location.pathname.includes("courselist")
                },
                {
                    title: "강좌 개설",
                    page: "openclass",
                    isSelected: this.props.location.pathname.includes("openclass")
                },
                {
                    title: "강좌 조회",
                    page: "courselist",
                    isSelected: this.props.location.pathname.includes("courselist")
                }
                ]}
            />
            </div>
            <div className="home_bottom">
                <div className="home_bottom-text u-mr-top-small">
                    <h3 className="text_headding">
                    <i className="fas fa-home">&nbsp;</i>학기정보 :{" "}
                    <b>2020년 1학기</b>
                    </h3>
                </div>
                <div className="home_bottom-box">
                    <Route exact  path = {`${this.props.match.path}/`} component = {MyListClass }/>
                    <Route path = {`${this.props.match.path}/openclass`} component = {CreateClass }/>
                    <Route path = {`${this.props.match.path}/classmodify/:id`} component = {CreateClass }/>
                    <Route path = {`${this.props.match.path}/classs`} component = {Class }/>
                    <Route path = {`${this.props.match.path}/courselist`} component = {RegisterClass}/>
                </div>
            </div>
        </div>
        </div>
    </>
    );
}
}
const mapStateToProps = (state, ownProps) => {
	const { user } = state;
		return {
        userData: user
    };
};
export default connect(mapStateToProps)(Home);
