import React, { Component } from 'react';
import { FaUserGraduate } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { IoMdListBox } from "react-icons/io";
import { TiArrowUnsorted } from "react-icons/ti";
import { Link } from "react-router-dom";
import callAPI from '../../../_utils/apiCaller';
class ListRegister extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = ({
            listStudentRegister : [],
            listStudentRegistered : []
        })
    }
    getToken = () => {
        const token = localStorage.getItem('token');
        return {
            auth_token : token
        }
    }
    componentDidUpdate(prevProps){
        if (prevProps.classId !== this.props.classId) {
            const {classId } = this.props;
            callAPI(`lectures/register/${classId}/admin`,'GET', this.getToken(), null).then(res => {
                this.setState(state => {
                    return {
                        listStudentRegister : res.data.data.disabledList,
                        listStudentRegistered : res.data.data.enabledList
                    }
                })
            }) 
        }
    }
    componentDidMount()
	{
        const {classId } = this.props;
        callAPI(`lectures/register/${classId}/admin`,'GET', this.getToken(), null).then(res => {
            this.setState(state => {
                return {
                    listStudentRegister : res.data.data.disabledList,
                    listStudentRegistered : res.data.data.enabledList
                }
            })
        }) 
    }
    //수강 신청생을 허학
    handleEnabledRegister(user){
        const {classId} = this.props;
        callAPI(`lectures/register/${classId}/admin`,'PUT',this.getToken(),{
            studentId : user.id
        }).then(res => {
            if(res.data.message === '승인이 되었습니다.'){
                alert(res.data.message)
                this.setState({
                    listStudentRegister : this.state.listStudentRegister.filter(item => item !== user),
                    listStudentRegistered : this.state.listStudentRegistered.concat(user)
                })
            }else{
                alert('취소 되었습니다.')
                this.setState({
                    listStudentRegistered : this.state.listStudentRegistered.filter(item => item !== user),
                    listStudentRegister : this.state.listStudentRegister.concat(user)
                })
            }
        })
    }
    render() {
        return (
            <div className="class_student">
                <h2><i className = "icon"> <FaUserGraduate /></i>수강생 관리</h2>
                <div className = "headding u-mr-bottom-small">
                    {/* <SelectSearch /> */}
                </div>
                <div className = "list-waiting">
                <h3 className = "u-mr-bottom-small"><i className = "icon"> <IoMdListBox />&nbsp;</i>수강생 관리</h3>
                {
                            this.state.listStudentRegister.length !== 0 ?
                            <table className ="table table-contribution" border = "1">
                            <thead>
                                <tr>
                                    <th width = "5%">순위</th>
                                    <th width = "10%">전공</th>
                                    <th width = "10%">학번<Link to = "#"><i className = "icon"><TiArrowUnsorted/></i></Link></th>
                                    <th width = "10%">이름</th>
                                    <th width = "15%">이메일</th>
                                    <th width = "10%">비고</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {
                                        this.state.listStudentRegister.map((item,index) => {
                                            return(
                                                <tr key = {index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.major}</td>
                                                    <td>{item.userid}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.email}</td>
                                                    <td className = "td-tasks">
                                                        <button onClick = {() => this.handleEnabledRegister(item)} className = "btn_permission">승인</button>
                                                    </td>
                                                </tr>
                                            ) 
                                        })
                                    }
                                    </tbody>
                            </table>
                            :
                            <h2 className = "u-text-center">수강 신청자가 없습니다</h2>
                }
                </div>
                <div className = "list-registed u-mr-top-small">
                    <h3 className = "u-mr-bottom-small"><i className = "icon"> <GoChecklist />&nbsp;</i>수강생 목록</h3>
                    {
                    this.state.listStudentRegistered.length !== 0 ?
                    <table className ="table table-contribution" border = "1">
                        <thead>
                            <tr>
                                <th width = "5%">번호</th>
                                <th width = "10%">전공</th>
                                <th width = "10%">학번<Link to = "#"><i className = "icon"><TiArrowUnsorted/></i></Link></th>
                                <th width = "10%">이름</th>
                                <th width = "15%">이메일</th>
                                <th width = "10%">비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listStudentRegistered.map((item,index) => {
                                    return(
                                        <tr key = {index}>
                                            <td>{index + 1}</td>
                                            <td>{item.major}</td>
                                            <td>{item.userid}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td className = "td-tasks">
                                                <button onClick = {() => this.handleEnabledRegister(item)} className = "btn_refuse">취소</button>
                                            </td>
                                        </tr> 
                                    ) 
                                })
                            }
                        </tbody>
                    </table>
                    :
                    <h2 className = "u-text-center">수강한 신청자가 없습니다</h2>
                    }
                </div>
            </div>
        )
    };
}
export default ListRegister;


