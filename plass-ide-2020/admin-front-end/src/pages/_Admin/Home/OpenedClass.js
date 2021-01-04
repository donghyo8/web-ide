import React, { Component } from 'react'
import callAPI from '../../../_utils/apiCaller';
export default class OpenedClass extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            listSearchClass : [],
            viewSelectedClass : {},
            details : false
        }
    }
    getToken = () =>{
        const token = localStorage.getItem('token')
        return {
            auth_token : token
        }
    }
    handleViewDetailClass = async (classView) => {
        this.setState({
            viewSelectedClass : classView,
            details : !this.state.details
        })
    }
    async componentDidMount () {
        await callAPI('lectures','GET',this.getToken(),null).then(res => {
            this.setState({
                listSearchClass : res.data.data
            })
        })
    }
    render() {
        return (
            <div className = "open_class">  
                <div className = "classs u-mr-top-small">
                    <h1 className = "u-text-center"
                    style = {{
                        borderBottom : "2px solid black"
                    }}>개설 강좌 리스트</h1><br/>
                <div className = "u-text-center u-mr-top-small">
                {
                this.state.listSearchClass.length !== 0 &&
                <table border="1" className="table table-contribution">
                    <thead>
                        <tr>
                            <th width = "5%">번호</th>
                            <th width = "5%">학부</th>
                            <th width = "5%">학과</th>
                            <th width = "10%">과목 코드</th>
                            <th width = "10%">과목명</th>
                            <th width = "5%">분반</th>
                            <th width = "5%">학점</th>
                            <th width = "10%">담당 교수</th>
                        </tr>
                    </thead>
                        <tbody>
                            {
                                this.state.listSearchClass.map((item,index) => (
                                    <tr key = {`class-${index}`}>
                                        <td>{index}</td>
                                        <td>{item.lecture_type}</td>
                                        <td>{item.major}</td>
                                        <td>{item.lecture_name}</td>
                                        <td>{item.title}</td>
                                        <td>{item.lecture_number}</td>
                                        <td>{item.score}</td>
                                        <td>{item.professor}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
                    </div>
                </div>
            </div>
        )
    }
}