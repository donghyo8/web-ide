import React, { Component } from 'react'
import callAPI from '../../../_utils/apiCaller';
export default class RegisterClass extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            ClassName: '',
            ClassProf: '',
            listSearchClass : [],
            listWaitingClass : [],
        }
        this.handleSubmit = this.handleChange.bind(this);
    }
    getToken = () =>{
        const token = localStorage.getItem('token')
        return {
            auth_token : token
        }
    }
    handleChange = (event) => {
        const {name , value} = event.target;
        this.setState ({
            [name] : value
        })
    }
    handleSearchClass = async event => {
        event.preventDefault();
        const {ClassName, ClassProf} = this.state
        if(ClassName || ClassProf){
                let  listClassSearch;
                await callAPI('lectures','GET',this.getToken(),null).then(res => {
                    listClassSearch = res.data.data
                })
                if(ClassName){
                    const filtered = listClassSearch.filter(element => element.title.includes(ClassName))
                    this.setState({
                        listSearchClass : filtered
                    })
                }else if(ClassProf){
                    const filtered = listClassSearch.filter(element => element.professor.includes(ClassProf))
                    this.setState({
                        listSearchClass : filtered
                    })
                }
        }else
        {
            await callAPI('lectures','GET',this.getToken(),null).then(res => {
                this.setState({
                    listSearchClass : res.data.data
                })
            })
        }
    }
    handleRegisterClass = async (classId) => {
        await callAPI(`lectures/register/${classId}/user`,'POST',this.getToken(),null).then(res => {
            const {message} = res.data
            if(message === '이미 신청한 강좌입니다.'){
                alert(message);
            }else{
                const filtered = this.state.listSearchClass.filter(element => element.id === classId)
                this.setState({
                    listWaitingClass : this.state.listWaitingClass.concat(filtered)
                })
            }
            
        })
    }
    handleDeleteWaitingClass = (classId) => {
        callAPI(`lectures/register/${classId}/waiting/user`,'DELETE',this.getToken(),null).then(res => {
            const {message} = res.data
            alert(message);
            if(message === '강좌 신청 취소 되었습니다.')
            {
                const filtered = this.state.listWaitingClass.filter(element => element.id !== classId)
                this.setState({
                    listWaitingClass : filtered
                })
            }
        })
    }
    componentDidMount () {
        callAPI('lectures/waiting/user','GET',this.getToken(),null).then(res => {
            this.setState({
                listWaitingClass : res.data.data
            })
        })
    }
    render() {
        return (
            <div className = "register_class">  
                <div className = "class u-mr-top-small">
                    <ul className = "ul-nolist-inline">
                        <li>
                            강좌 구분 :
                            <select value  = {this.state.Classtype}  onChange = {(event) => this.handleChange(event)}>
                                <option value = "학부">학부</option>
                            </select>
                        </li>
                        <li>    
                            강좌 학과 : 
                            <select value  = {this.state.ClassMajor} onChange = {(event) => this.handleChange(event)}>
                                <option value = "컴퓨터 공학과">컴퓨터 공학과</option>
                            </select>
                        </li>
                        <li>
                            강좌 이름 : 
                            <input type = "text" name = "ClassName" value = {this.state.ClassName} onChange = {(event) => this.handleChange(event)}/>
                        </li> 
                        <li>
                            교수명 : 
                            <input type = "text" name = "ClassProf" value = {this.state.ClassProf} onChange = {(event) => this.handleChange(event)}/>
                        </li>
                        <li>
                            <button className = "btn btn_primary" onClick = {event => this.handleSearchClass(event)}> 강좌 검색</button>
                        </li>
                    </ul>
                    <strong
                    style = {{color : "#747474"}}
                    >알람 : 정확한 강좌를 신청하기 위해서 맞는 정보를 입력하여 검색하세요. 아무것나 입력하지 않거나 틀린 값을 입력하는 경우에는 전체 강좌를 출력합니다.</strong>
                {
                    this.state.listSearchClass.length !== 0 &&
                    <div className = "u-text-center u-mr-top-small">
                    <h2>강좌 신청 목록</h2>
                    <table border="1" className="table table-contribution">
                        <thead>
                            <tr>
                                <th width = "5%"> 등록</th>
                                <th width = "10%">과목 코드</th>
                                <th width = "20%">과목명</th>
                                <th width = "10%">담당 교수</th>
                                <th width = "5%">분반</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listSearchClass.map((item,index) => (
                                    <tr key = {`class-${index}`}>
                                    <td><button className = "btn btn_permission" onClick = {() => this.handleRegisterClass(item.id)}> 등록</button></td>
                                    <td>{item.lecture_name}</td>
                                    <td>{item.title}</td>
                                    <td>{item.professor}</td>
                                    <td>{item.lecture_number}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    </div>
                }
                </div>
                {
                this.state.listWaitingClass.length !== 0 &&
                <div className = "register_class u-mr-top-big">
                <h2>강좌 신청 목록</h2>
                <table border="1" className="table table-contribution">
                    <thead>
                        <tr>
                            <th width = "5%"> 취소</th>
                            <th width = "10%">과목 코드</th>
                            <th width = "20%">과목명</th>
                            <th width = "10%">담당 교수</th>
                            <th width = "5%">분반</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.listWaitingClass.map((item,index) => (
                                <tr key = {`class-${index}`}>
                                <td><button className = "btn btn_refuse" onClick = {() => this.handleDeleteWaitingClass(item.id)}> 취소</button></td>
                                <td>{item.lecture_name}</td>
                                <td>{item.title}</td>
                                <td>{item.professor}</td>
                                <td>{item.lecture_number}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                </div>
                }
            </div>
        )
    }
}