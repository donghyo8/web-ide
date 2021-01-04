import React, { Component } from 'react'
import CKEditor from 'ckeditor4-react';
import callAPI from '../../../_utils/apiCaller';
export default class CreateClass extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            classProf : '',
            classType : '학부',
            classMajor : '컴퓨터 공학과',
            className : '',
            classNumber : '',
            classCode : '',
            classDescription : '',
            modifyclass : false
        }
        this.handleSubmit = this.handleChange.bind(this);
    }
    getToken = () =>{
        const token = localStorage.getItem('token')
        return {
            auth_token : token
        }
    }
    onEditorChange = (event) => {
        this.setState ({
            classDescription : event.editor.getData()
        })
    }
    handleChange = (event) => {
        const {name , value} = event.target;
        this.setState ({
            [name] : value
        })
    }
    handleCreateClass = event => {
        event.preventDefault();
        const {className, classDescription, classType, classNumber, classMajor , classCode, classProf} = this.state
        if(className && classDescription && classCode && classProf){
            callAPI('lectures','POST',this.getToken(),{
                title : className,
                description : classDescription,
                lecture_type : classType,
                major : classMajor,
                lecture_number : classNumber,
                lecture_name : classCode,
                score : 3,
                professor : classProf,
                season_year : 2020,
                season_quarter : 1
            }).then(res => {
                const {message} = res.data
                alert(message)
                if(message === "강좌 생성에 성공했습니다."){
                    this.setState({
                        classProf : '',
                        classType : '학부', 
                        classMajor : '컴퓨터 공학과',
                        className : '',
                        classNumber : '',
                        classCode : '',
                        classDescription : '',
                    })
                    this.props.history.push(`/main/home`);
                }
            })
        }else{
            alert("빈 값을 있습니다. 다시 확인해주세요")
        }
    }
    handleModifyClass = event => {
        event.preventDefault();
        const classId = this.props.match.params.id;
        const {className, classDescription, classType,classNumber, classMajor , classCode, classProf} = this.state
        callAPI(`lectures/modify/${classId}`,'PUT',this.getToken(),{
            title : className,
            description : classDescription,
            lecture_type : classType,
            major : classMajor,
            lecture_number : classNumber,
            lecture_name : classCode,
            score : 3,
            professor : classProf,
            season_year : 2020,
            season_quarter : 1
        }).then(res => {
            alert(res.data.message);
            this.props.history.push(`/main/home`);
        })
    }
    componentDidMount() {
        const path = this.props.location.pathname;
        const classId = this.props.match.params.id;
        if(path.includes("classmodify")){
            callAPI(`lectures/view/${classId}`,'GET',this.getToken(),null).then(res => {
                let { professor, title, lecture_number, lecture_name, description } = res.data.data[0];
                this.setState({
                    classProf : professor,
                    classType : '학부',
                    classMajor : '컴퓨터 공학과',
                    className : title,
                    classNumber : lecture_number,
                    classCode : lecture_name,
                    classDescription : description,
                    modifyclass : 'true',
                })
            })
        }
    }
    render() {
        return (
            <div className = "open_class">  
                <div className = "classs u-mr-top-small">
                    <form action  = "POST" >
                        <table className = "create_class-tbl">
                            <thead>
                                <tr >
                                    <th colSpan = "4">
                                        강좌 정보 입력
                                        {
                                            this.state.modifyclass ? 
                                            <button className = "u-float-right btn btn_primary" onClick = {event => this.handleModifyClass(event)}> 강좌 수정</button> :
                                            <button className = "u-float-right btn btn_primary" onClick = {event => this.handleCreateClass(event)}> 강좌 개설</button>
                                        }
                                    </th>
                                </tr>
                            </thead>
                        <tbody>
                            <tr>
                                <td>
                                교수 성명 : 
                                    <input type = "text" name = "classProf" value = {this.state.classProf} onChange = {(event) => this.handleChange(event)}/>
                                </td> 
                                <td>
                                강좌 구분 :
                                <select value  = {this.state.classType}  onChange = {(event) => this.handleChange(event)}>
                                    <option value = "학부">학부</option>
                                </select>
                                </td>
                                <td>    
                                강좌 학과 : 
                                <select value  = {this.state.classMajor} onChange = {(event) => this.handleChange(event)}>
                                    <option value = "컴퓨터 공학과">컴퓨터 공학과</option>
                                </select>
                                </td>
                            </tr>
                            <tr>
                                <td> 
                                강좌 코드 : 
                                <input type = "text" name = "classCode" value = {this.state.classCode} onChange = {(event) => this.handleChange(event)}/>
                                </td>
                                <td>
                                강좌 이름 : 
                                <input type = "text" name = "className" value  = {this.state.className} onChange = {(event) => this.handleChange(event)}/>
                                </td>  
                                <td>
                                강좌 분반 : 
                                <input type = "text" name = "classNumber" value = {this.state.classNumber} onChange = {(event) => this.handleChange(event)}/>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan = "3">
                                <CKEditor 
                                    data = {this.state.classDescription}
                                    onChange = {event => this.onEditorChange(event)}
                                />
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </form>
                </div>
            </div>
        )
    }
}
