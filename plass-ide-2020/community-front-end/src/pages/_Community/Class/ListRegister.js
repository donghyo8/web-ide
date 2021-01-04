import React, { Component } from 'react';
import { FaUserGraduate } from "react-icons/fa";
import callAPI from '../../../_utils/apiCaller';
class ListRegister extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = ({
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
            callAPI(`lectures/listregister/${classId}/user`,'GET', this.getToken(), null).then(res => {
                this.setState(state => {
                    return {
                        listStudentRegistered : res.data.data
                    }
                })
            }) 
        }
    }
    componentDidMount()
	{
        const {classId } = this.props;
        callAPI(`lectures/listregister/${classId}/user`,'GET', this.getToken(), null).then(res => {
            this.setState(state => {
                return {
                    listStudentRegistered : res.data.data
                }
            })
        }) 
    }
    render() {
        return (
            <div className="class_student">
                <h2><i className = "icon"> <FaUserGraduate /></i>수강생 목록</h2>
                <div className = "list-registed u-mr-top-small">
                    {
                        this.state.listStudentRegistered.length !== 0 &&
                    <table className ="table table-contribution" border = "1">
                        <thead>
                            <tr>
                                <th width = "5%">번호</th>
                                <th width = "10%">전공</th>
                                <th width = "10%">학번</th>
                                <th width = "10%">이름</th>
                                <th width = "15%">이메일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listStudentRegistered.map((item,index) => {
                                    return(
                                        <tr key = {index}>
                                            <td>{index + 1}</td>
                                            <td>{item.major}</td>
                                            <td>{item.userid.substring(0,2)}****</td>
                                            <td>{item.name.substring(0,2)}*</td>
                                            <td>{item.email.substring(0,5)}****</td>
                                        </tr> 
                                    ) 
                                })
                            }
                        </tbody>
                    </table>
                    }
                </div>
            </div>
        )
    };
}
export default ListRegister;


