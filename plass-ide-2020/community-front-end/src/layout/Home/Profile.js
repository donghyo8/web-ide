import React from 'react';
class Profile extends React.Component {
    render() {
    return (
        <div className = "profile">
            <div className = "row">
                <div className = "col span-1-of-2 profile_left">
                    <img
                        className = "profile_left-logo"
                        src="https://nimael.com/wp-content/uploads/2017/07/student.png"
                        alt="Dongguk logo"
                    /> 
                </div>
                <div className = "col span-1-of-2 profile_right">
                        <ul className = "ul-nolist-inline">
                            <li><b>이름 :</b> {this.props.userData.name}</li>
                            <li><b>학과 :</b> {this.props.userData.major}</li>
                            <li><b>학번 :</b> {this.props.userData.userid}</li>
                            <li><b>학년 :</b> 4</li>
                            <li><b>이메일 :</b> {this.props.userData.email}</li>
                        </ul>
                        {/* <div className = "profile_right_works">
                            <button className = "btn btn_primary">수정</button>
                        </div>   */}
                </div>
            </div>
        </div>
    )
    }
}
export default Profile;
